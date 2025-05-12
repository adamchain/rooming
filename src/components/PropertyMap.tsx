import React, { useState } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import { Building2, Wrench, MapPin, DollarSign } from 'lucide-react';
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
      lat: 37.7749 + (index * 0.02),
      lng: -122.4194 + (index * 0.02)
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
        zoom: 11
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
      zoom: propertiesWithCoords.length === 1 ? 13 : 12
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
                  <div className="flex-shrink-0 bg-black dark:bg-black rounded-full p-2 shadow-md transition-transform hover:scale-110">
                    <Building2 className="h-6 w-6 text-white dark:text-white cursor-pointer" />
                  </div>
                  
                  {/* Hover Card */}
                  {hoveredProperty === property && (
                    <div className="absolute z-50 top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-white dark:bg-[#1b1b1b] rounded-lg shadow-lg border border-gray-200 dark:border-[#3b3b3b] p-4">
                      <div className="flex items-center mb-3">
                        <Building2 className="h-5 w-5 mr-2 text-[#0078d4]" />
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">{property.name}</h3>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="truncate">{property.address}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 bg-[#0078d4]/10 rounded-full p-1 mr-2">
                              <Building2 className="h-4 w-4 text-[#0078d4]" />
                            </div>
                            <span className="text-sm text-gray-900 dark:text-white">Occupancy</span>
                          </div>
                          <span className="font-semibold text-[#0078d4]">{property.occupancyRate}%</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 bg-[#0078d4]/10 rounded-full p-1 mr-2">
                              <Wrench className="h-4 w-4 text-[#0078d4]" />
                            </div>
                            <span className="text-sm text-gray-900 dark:text-white">Maintenance</span>
                          </div>
                          <span className="font-semibold text-[#0078d4]">{property.maintenanceRequests}</span>
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
              closeOnClick={false}
              className="property-popup"
            >
              <div className="bg-white dark:bg-[#1b1b1b] rounded-lg overflow-hidden w-72">
                <div className="p-4 border-b border-gray-200 dark:border-[#3b3b3b]">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1 flex items-center">
                    <Building2 className="h-5 w-5 mr-2 text-[#0078d4]" />
                    {selectedProperty.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {selectedProperty.address}
                  </p>
                </div>
                
                <div className="p-4 space-y-3">
                  <div className="bg-[#0078d4]/5 dark:bg-[#0078d4]/10 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <Building2 className="h-4 w-4 mr-2 text-[#0078d4]" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Occupancy Rate</span>
                      </div>
                      <span className="text-lg font-semibold text-[#0078d4]">{selectedProperty.occupancyRate}%</span>
                    </div>
                  </div>

                  <div className="bg-[#0078d4]/5 dark:bg-[#0078d4]/10 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <Wrench className="h-4 w-4 mr-2 text-[#0078d4]" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Maintenance Requests</span>
                      </div>
                      <span className="text-lg font-semibold text-[#0078d4]">{selectedProperty.maintenanceRequests}</span>
                    </div>
                  </div>

                  <div className="bg-[#0078d4]/5 dark:bg-[#0078d4]/10 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-[#0078d4]" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Monthly Revenue</span>
                      </div>
                      <span className="text-lg font-semibold text-[#0078d4]">${selectedProperty.revenue?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Popup>
          )}
        </Map>
      </div>
    </div>
  );
}