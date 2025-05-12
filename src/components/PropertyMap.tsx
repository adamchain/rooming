import React, { useState, useEffect } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import { Building2, Wrench } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import 'mapbox-gl/dist/mapbox-gl.css';

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
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
        {...viewport}
        onMove={evt => setViewport(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v11"
      >
        {propertiesWithCoords.map((property) => (
          <Marker
            key={property.id}
            latitude={property.coordinates?.lat || 0}
            longitude={property.coordinates?.lng || 0}
            onClick={e => {
              e.originalEvent.stopPropagation();
              setSelectedProperty(property);
            }}
          >
            <Building2 className="h-6 w-6 text-blue-500 cursor-pointer" />
          </Marker>
        ))}

        {selectedProperty && selectedProperty.coordinates && (
          <Popup
            latitude={selectedProperty.coordinates.lat}
            longitude={selectedProperty.coordinates.lng}
            onClose={() => setSelectedProperty(null)}
            closeButton={true}
          >
            <div className="p-2">
              <h3 className="font-semibold">{selectedProperty.name}</h3>
              <p className="text-sm text-gray-600">{selectedProperty.address}</p>
              {selectedProperty.occupancyRate && (
                <p className="text-sm">Occupancy: {selectedProperty.occupancyRate}%</p>
              )}
              {selectedProperty.maintenanceRequests && (
                <div className="flex items-center gap-1 text-sm text-orange-500">
                  <Wrench className="h-4 w-4" />
                  <span>{selectedProperty.maintenanceRequests} requests</span>
                </div>
              )}
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}