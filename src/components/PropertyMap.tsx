import React, { useState, useEffect } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import { Building2, Wrench, Users } from 'lucide-react';
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

  const getOccupancyColor = (rate?: number) => {
    if (!rate) return 'bg-gray-400';
    if (rate >= 90) return 'bg-green-500';
    if (rate >= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="h-[500px] w-full bg-white dark:bg-[#252525] rounded-lg border border-gray-200 dark:border-[#3b3b3b] overflow-hidden">
      <Map
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
        {...viewport}
        onMove={evt => setViewport(evt.viewState)}
        style={{ width: '100%', height: '100%' }}
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
            <div className="relative group">
              {/* Main Property Icon */}
              <div className="p-2 bg-white dark:bg-[#252525] rounded-lg shadow-lg border border-gray-200 dark:border-[#3b3b3b] cursor-pointer transform transition-transform group-hover:scale-110">
                <Building2 className="text-[#0078d4] h-6 w-6" />
              </div>

              {/* Occupancy Indicator */}
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-[#252525] shadow-sm transition-colors duration-200 ease-in-out"
                title={`Occupancy: ${property.occupancyRate}%`}
                style={{
                  backgroundColor: getOccupancyColor(property.occupancyRate)
                }}
              />

              {/* Maintenance Requests Badge */}
              {property.maintenanceRequests && property.maintenanceRequests > 0 && (
                <div className="absolute -bottom-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center border-2 border-white dark:border-[#252525]"
                  title={`${property.maintenanceRequests} maintenance requests`}
                >
                  {property.maintenanceRequests}
                </div>
              )}

              {/* Hover Card */}
              <div className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className="bg-white dark:bg-[#252525] p-2 rounded-lg shadow-lg border border-gray-200 dark:border-[#3b3b3b] whitespace-nowrap">
                  <p className="font-medium text-sm text-gray-900 dark:text-white">{property.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                      <Users className="h-3 w-3 mr-1" />
                      {property.occupancyRate}%
                    </div>
                    {property.maintenanceRequests && property.maintenanceRequests > 0 && (
                      <div className="flex items-center text-xs text-orange-600 dark:text-orange-400">
                        <Wrench className="h-3 w-3 mr-1" />
                        {property.maintenanceRequests}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Marker>
        ))}

        {selectedProperty && selectedProperty.coordinates && (
          <Popup
            latitude={selectedProperty.coordinates.lat}
            longitude={selectedProperty.coordinates.lng}
            onClose={() => setSelectedProperty(null)}
            closeButton={true}
            closeOnClick={false}
            className="bg-white rounded-lg shadow-lg"
          >
            <div className="p-2">
              <h3 className="font-semibold text-lg text-gray-900">{selectedProperty.name}</h3>
              <p className="text-gray-600">{selectedProperty.address}</p>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center text-sm">
                  <Users className="h-4 w-4 mr-1 text-gray-500" />
                  <span className={`font-medium ${
                    (selectedProperty.occupancyRate || 0) >= 90 ? 'text-green-600' :
                    (selectedProperty.occupancyRate || 0) >= 75 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {selectedProperty.occupancyRate}%
                  </span>
                </div>
                {selectedProperty.maintenanceRequests && selectedProperty.maintenanceRequests > 0 && (
                  <div className="flex items-center text-sm text-orange-600">
                    <Wrench className="h-4 w-4 mr-1" />
                    <span>{selectedProperty.maintenanceRequests} requests</span>
                  </div>
                )}
              </div>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}