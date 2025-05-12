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
  const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains('dark'));

  // Watch for dark mode changes
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setDarkMode(document.documentElement.classList.contains('dark'));
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

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
        mapboxAccessToken="pk.eyJ1IjoiZGVtby11c2VyIiwiYSI6ImNscnhkN2FjaTBhOXEyam8yOXRqb2RqdXIifQ.bHlFEjwiQcF2GYVxBxBG3w"
        initialViewState={viewport}
        style={{ width: '100%', height: '100%' }}
        mapStyle={darkMode ? "mapbox://styles/mapbox/dark-v11" : "mapbox://styles/mapbox/light-v11"}
        onMove={(evt) => setViewport(evt.viewState)}
      >
        {propertiesWithCoords.map((property) => (
          <Marker
            key={property.id}
            latitude={property.coordinates!.lat}
            longitude={property.coordinates!.lng}
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setSelectedProperty(property);
            }}
          >
            <div className="cursor-pointer bg-white dark:bg-[#252525] rounded-full p-2 shadow-lg border border-gray-200 dark:border-[#3b3b3b] hover:border-[#0078d4] dark:hover:border-[#0078d4] transition-colors">
              <Building2 className="h-5 w-5 text-[#0078d4]" />
            </div>
          </Marker>
        ))}

        {selectedProperty && (
          <Popup
            latitude={selectedProperty.coordinates!.lat}
            longitude={selectedProperty.coordinates!.lng}
            onClose={() => setSelectedProperty(null)}
            closeButton={true}
            closeOnClick={false}
            anchor="bottom"
          >
            <div className="p-2">
              <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2">
                {selectedProperty.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                {selectedProperty.address}
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Occupancy Rate</span>
                  <div className="flex items-center">
                    <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500"
                        style={{ width: `${selectedProperty.occupancyRate}%` }}
                      />
                    </div>
                    <span className="ml-2 text-sm text-gray-900 dark:text-white">
                      {selectedProperty.occupancyRate}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Maintenance</span>
                  <div className="flex items-center">
                    <Wrench className="h-4 w-4 text-orange-500 mr-1" />
                    <span className="text-sm text-gray-900 dark:text-white">
                      {selectedProperty.maintenanceRequests} open
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