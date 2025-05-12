import React, { useState } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import { Building2, Wrench, MapPin } from 'lucide-react';
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
  revenue?: number;
}

interface PropertyMapProps {
  properties: Property[];
}

export default function PropertyMap({ properties }: PropertyMapProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [hoveredProperty, setHoveredProperty] = useState<Property | null>(null);

  // Mock enhanced coordinates and data
  const propertiesWithCoords = properties.map((property, index) => ({
    ...property,
    coordinates: {
      lat: 37.7749 + (index * 0.001), // Much smaller difference in latitude
      lng: -122.4194 + (index * 0.001) // Much smaller difference in longitude
    },
    revenue: Math.floor(Math.random() * 50000) + 10000, // Random revenue between 10k-60k
    occupancyRate: Math.floor(Math.random() * 20) + 80, // Random occupancy between 80-100%
    maintenanceRequests: Math.floor(Math.random() * 4) // 0-3 maintenance requests
  }));

  // Viewport calculation
  const calculateViewport = () => {
    if (propertiesWithCoords.length === 0) {
      return {
        latitude: 37.7749,
        longitude: -122.4194,
        zoom: 15
      };
    }

    const lats = propertiesWithCoords.map(p => p.coordinates?.lat || 0);
    const lngs = propertiesWithCoords.map(p => p.coordinates?.lng || 0);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;

    return {
      latitude: centerLat,
      longitude: centerLng,
      zoom: 15 // Increased zoom level
    };
  };

  const [viewport, setViewport] = useState(calculateViewport());

  return (
    <div className="bg-white dark:bg-[#252525] overflow-hidden rounded-lg border border-gray-200 dark:border-[#3b3b3b]">
      <div className="h-[500px] w-full relative">
        <Map
          mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
          {...viewport}
          onMove={evt => setViewport(evt.viewState)}
          mapStyle="mapbox://styles/mapbox/streets-v11"
        >
          {propertiesWithCoords.map((property) => (
            <React.Fragment key={property.id}>
              <Marker
                latitude={property.coordinates?.lat || 0}
                longitude={property.coordinates?.lng || 0}
                onClick={e => {
                  e.originalEvent.stopPropagation();
                  setSelectedProperty(property);
                }}
                onMouseEnter={() => setHoveredProperty(property)}
                onMouseLeave={() => setHoveredProperty(null)}
              >
                <div className="relative">
                  <div className="flex-shrink-0 bg-green-100 dark:bg-green-900/20 rounded-full p-2 shadow-md">
                    <Building2 className="h-6 w-6 text-green-600 dark:text-green-400 cursor-pointer" />
                  </div>
                  
                  {/* Hover Card */}
                  {hoveredProperty === property && (
                    <div className="absolute z-50 top-full left-1/2 transform -translate-x-1/2 mt-2 w-56 bg-white dark:bg-[#2c2c2c] rounded-lg shadow-lg border border-gray-200 dark:border-[#3b3b3b] p-4">
                      <div className="flex items-center mb-2">
                        <Building2 className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">{property.name}</h3>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-300 truncate">{property.address}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 bg-green-100 dark:bg-green-900/20 rounded-full p-1 mr-2">
                              <Building2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </div>
                            <span className="text-sm text-gray-900 dark:text-white">Occupancy</span>
                          </div>
                          <span className="font-semibold text-green-600">{property.occupancyRate}%</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 bg-orange-100 dark:bg-orange-900/20 rounded-full p-1 mr-2">
                              <Wrench className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                            </div>
                            <span className="text-sm text-gray-900 dark:text-white">Maintenance</span>
                          </div>
                          <span className="font-semibold text-orange-600">{property.maintenanceRequests}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/20 rounded-full p-1 mr-2">
                              <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <span className="text-sm text-gray-900 dark:text-white">Revenue</span>
                          </div>
                          <span className="font-semibold text-blue-600">${property.revenue?.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Marker>
            </React.Fragment>
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
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                  <Building2 className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
                  {selectedProperty.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                  {selectedProperty.address}
                </p>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
                    <div className="flex items-center mb-1">
                      <Building2 className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">Occupancy</span>
                    </div>
                    <p className="font-semibold text-green-600 text-lg">{selectedProperty.occupancyRate}%</p>
                  </div>
                  
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded-lg">
                    <div className="flex items-center mb-1">
                      <Wrench className="h-4 w-4 mr-2 text-orange-600 dark:text-orange-400" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">Maintenance</span>
                    </div>
                    <p className="font-semibold text-orange-600 text-lg">{selectedProperty.maintenanceRequests}</p>
                  </div>
                </div>
                
                <div className="mt-3 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
                  <div className="flex items-center mb-1">
                    <DollarSign className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Monthly Revenue</span>
                  </div>
                  <p className="font-semibold text-blue-600 text-lg">${selectedProperty.revenue?.toLocaleString()}</p>
                </div>
              </div>
            </Popup>
          )}
        </Map>
      </div>
    </div>
  );
}