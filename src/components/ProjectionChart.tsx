import React, { useMemo } from 'react';
import { LinePath } from '@visx/shape';
import { scaleLinear, scaleTime } from '@visx/scale';
import { extent, max } from 'd3-array';
import { Group } from '@visx/group';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { GridRows } from '@visx/grid';
import { formatCurrency } from '../utils/formatters';

interface ProjectionChartProps {
  width: number;
  height: number;
  data: Array<{
    date: Date;
    value: number;
  }>;
  margin?: { top: number; right: number; bottom: number; left: number };
}

export default function ProjectionChart({
  width,
  height,
  data,
  margin = { top: 20, right: 20, bottom: 40, left: 80 }
}: ProjectionChartProps) {
  // Dimensions
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Scales
  const xScale = useMemo(
    () =>
      scaleTime({
        range: [0, innerWidth],
        domain: extent(data, d => d.date) as [Date, Date],
      }),
    [data, innerWidth]
  );

  const yScale = useMemo(
    () =>
      scaleLinear({
        range: [innerHeight, 0],
        domain: [0, max(data, d => d.value) || 0],
        nice: true,
      }),
    [data, innerHeight]
  );

  return (
    <svg width={width} height={height}>
      <Group left={margin.left} top={margin.top}>
        {/* Grid */}
        <GridRows
          scale={yScale}
          width={innerWidth}
          strokeDasharray="3,3"
          stroke="#e0e0e0"
          strokeOpacity={0.2}
        />

        {/* Axes */}
        <AxisLeft
          scale={yScale}
          tickFormat={(value) => formatCurrency(value as number)}
          stroke="#718096"
          tickStroke="#718096"
          tickLabelProps={() => ({
            fill: '#718096',
            fontSize: 11,
            textAnchor: 'end',
            dy: '0.33em',
          })}
        />
        <AxisBottom
          top={innerHeight}
          scale={xScale}
          stroke="#718096"
          tickStroke="#718096"
          tickLabelProps={() => ({
            fill: '#718096',
            fontSize: 11,
            textAnchor: 'middle',
          })}
        />

        {/* Line */}
        <LinePath
          data={data}
          x={(d) => xScale(d.date)}
          y={(d) => yScale(d.value)}
          stroke="#0078d4"
          strokeWidth={2}
          strokeOpacity={0.8}
          className="transition-all duration-300 hover:stroke-opacity-100"
        />
      </Group>
    </svg>
  );
}