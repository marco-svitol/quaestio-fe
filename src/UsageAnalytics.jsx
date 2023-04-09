import React from 'react';
import { Bar } from '@visx/shape';
import { scaleBand, scaleLinear } from '@visx/scale';
import './App.css';

const data = [
  { category: 'A', value: 10 },
  { category: 'B', value: 20 },
  { category: 'C', value: 30 },
  { category: 'D', value: 40 },
];

const width = 400;
const height = 200;

const xScale = scaleBand({
  domain: data.map((d) => d.category),
  range: [0, width],
  padding: 0.2,
});

const yScale = scaleLinear({
  domain: [0, Math.max(...data.map((d) => d.value))],
  range: [height, 0],
});

const UsageAnalytics = () => {
  return (
    <div className="usage-analytics">
      <h3>Usage Analytics</h3>
      <svg width={width} height={height}>
        {data.map((d, i) => {
          const barHeight = height - yScale(d.value);
          return (
            <Bar
              key={`bar-${i}`}
              x={xScale(d.category)}
              y={yScale(d.value)}
              width={xScale.bandwidth()}
              height={barHeight}
              fill="#428bca"
            />
          );
        })}
      </svg>
    </div>
  );
};

export default UsageAnalytics;
