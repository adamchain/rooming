import React, { useMemo } from 'react';
import { Pie } from '@visx/shape';
import { Group } from '@visx/group';
import { Text } from '@visx/text';

interface AssetPortfolioChartProps {
  width: number;
  height: number;
  properties: Array<{
    id: string;
    currentValue: number;
    name?: string;
  }>;
}

export default function AssetPortfolioChart({ width, height, properties }: AssetPortfolioChartProps) {
  const radius = Math.min(width, height) / 2;
  const centerY = height / 2;
  const centerX = width / 2;

  const totalValue = useMemo(
    () => properties.reduce((sum, p) => sum + p.currentValue, 0),
    [properties]
  );

  // Generate colors based on property index
  const getColor = (index: number) => {
    const colors = [
      '#0078d4', // Primary blue
      '#106ebe', // Darker blue
      '#2b88d8', // Lighter blue
      '#71afe5', // Even lighter blue
      '#c7e0f4', // Palest blue
    ];
    return colors[index % colors.length];
  };

  return (
    <svg width={width} height={height}>
      <Group top={centerY} left={centerX}>
        <Pie
          data={properties}
          pieValue={(d) => d.currentValue}
          outerRadius={radius - 20}
          innerRadius={radius - 60}
          padAngle={0.02}
        >
          {(pie) => {
            return pie.arcs.map((arc, index) => {
              const [centroidX, centroidY] = pie.path.centroid(arc);
              const percentage = ((arc.data.currentValue / totalValue) * 100).toFixed(1);
              const hasRoom = arc.endAngle - arc.startAngle >= 0.25;

              return (
                <g key={arc.data.id}>
                  <path
                    d={pie.path(arc) || ''}
                    fill={getColor(index)}
                    className="transition-all duration-300 hover:opacity-80"
                  />
                  {hasRoom && (
                    <Text
                      x={centroidX}
                      y={centroidY}
                      dy=".33em"
                      fill="#ffffff"
                      fontSize={12}
                      textAnchor="middle"
                    >
                      {percentage}%
                    </Text>
                  )}
                </g>
              );
            });
          }}
        </Pie>
      </Group>
    </svg>
  );
}