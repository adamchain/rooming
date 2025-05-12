import React, { useState } from 'react';
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
  // Calculate the center of the properties
  const propertiesWithCoords = properties.map((property, index) => ({
    ...property,
    coordinates: {
      lat: 37.7749 + (index * 0.01),
      lng: -122.4194 + (index * 0.01)
    }
  }));

  // Determine initial viewport based on property coordinates
  const calculateViewport = () => {
    if (propertiesWithCoords.length === 0) {
      return {
        latitude: 37.7749,
        longitude: -122.4194,
        zoom: 11
      };
    }

    // Find the bounds of the properties
    const lats = propertiesWithCoords.map(p => p.coordinates?.lat || 0);
    const lngs = propertiesWithCoords.map(p => p.coordinates?.lng || 0);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    // Calculate the center
    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;

    return {
      latitude: centerLat,
      longitude: centerLng,
      zoom: propertiesWithCoords.length === 1 ? 13 : 12
    };
  };

  const [viewport, setViewport] = useState(calculateViewport());

  return (
    <div className="bg-white dark:bg-[#252525] overflow-hidden rounded-lg border border-gray-200 dark:border-[#3b3b3b]">
      <div className="h-[500px] w-full">
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
              <div className="flex-shrink-0 bg-green-100 dark:bg-green-900/20 rounded-full p-2">
                <Building2 className="h-6 w-6 text-green-600 dark:text-green-400 cursor-pointer" />
              </div>
            </Marker>
          ))}
          {selectedProperty && selectedProperty.coordinates && (
            <Popup
              latitude={selectedProperty.coordinates.lat}
              longitude={selectedProperty.coordinates.lng}
              onClose={() => setSelectedProperty(null)}
              closeButton={true}
              className="custom-popup"
            >
              <div className="p-4 bg-white dark:bg-[#252525] rounded-lg shadow-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{selectedProperty.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{selectedProperty.address}</p>
                {selectedProperty.occupancyRate !== undefined && (
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-shrink-0 bg-green-100 dark:bg-green-900/20 rounded-full p-1">
                      <Building2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <p className="text-sm text-gray-900 dark:text-white">Occupancy: {selectedProperty.occupancyRate}%</p>
                  </div>
                )}
                {selectedProperty.maintenanceRequests !== undefined && selectedProperty.maintenanceRequests > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex-shrink-0 bg-orange-100 dark:bg-orange-900/20 rounded-full p-1">
                      <Wrench className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <p className="text-sm text-orange-600 dark:text-orange-400">
                      {selectedProperty.maintenanceRequests} maintenance requests
                    </p>
                  </div>
                )}
              </div>
            </Popup>
          )}
        </Map>
      </div>
    </div>
  );
}