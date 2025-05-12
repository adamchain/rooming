import React, { useState, useEffect } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import { Building2, Wrench } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

interface Property {
  id: string;
  name: string;
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  occupancyRate?: number;
  maintenanceRequests?: number;
}

interface PropertyMapProps {
  properties: Property[];
}

export default function PropertyMap({ properties }: PropertyMapProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [viewport, setViewport] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
    zoom: 11
  });

  // Demo coordinates for properties
  const propertiesWithCoords = properties.map((property, index) => ({
    ...property,
    coordinates: {
      lat: 37.7749 + (index * 0.01),
      lng: -122.4194 + (index * 0.01)
    }
  }));

  return (
    <div className="h-[500px] w-full bg-white dark:bg-[#252525] rounded-lg border border-gray-200 dark:border-[#3b3b3b] overflow-hidden">
      <Map
        mapboxAccessToken="pk.eyJ1IjoiZGVtby11c2VyIiwiYSI6ImNscnhkN2FjaTBhOXEya3BlZGxqZWZ0em8ifQ.6QR7RPEUVcKRkHKpKxwqww"
        {...viewport}
        onMove={evt => setViewport(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        style={{ width: '100%', height: '100%' }}
      >
        {propertiesWithCoords.map((property) => (
          <Marker
            key={property.id}
            latitude={property.coordinates.lat}
            longitude={property.coordinates.lng}
            onClick={e => {
              e.originalEvent.stopPropagation();
              setSelectedProperty(property);
            }}
          >
            <div className="cursor-pointer">
              <div className="p-2 rounded-full bg-[#0078d4] text-white">
                <Building2 className="h-5 w-5" />
              </div>
            </div>
          </Marker>
        ))}

        {selectedProperty && (
          <Popup
            latitude={selectedProperty.coordinates.lat}
            longitude={selectedProperty.coordinates.lng}
            onClose={() => setSelectedProperty(null)}
            closeButton={true}
            closeOnClick={false}
            className="property-popup"
          >
            <div className="p-2">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                {selectedProperty.name || 'Unnamed Property'}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                {selectedProperty.address}
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Occupancy</span>
                  <span className="text-xs font-medium text-gray-900 dark:text-white">
                    {selectedProperty.occupancyRate || 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Maintenance</span>
                  <div className="flex items-center">
                    <Wrench className="h-3 w-3 text-orange-500 mr-1" />
                    <span className="text-xs font-medium text-gray-900 dark:text-white">
                      {selectedProperty.maintenanceRequests || 0} open
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}