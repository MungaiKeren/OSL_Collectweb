import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function CustomAreaChart(props) {
  return (
    <ResponsiveContainer aspect={props.aspect} width={"100%"}>
      <AreaChart data={props.data}>
        <defs>
          <linearGradient id="linearbg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#002F6C" />
            <stop offset="100%" stop-color="#AECAE7" />
          </linearGradient>
        </defs>
        <XAxis dataKey="name" />
        <YAxis domain={[0, 20]} />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
        <Area
          dataKey="value"
          type="linear"
          fill="url(#linearbg)"
          name="Background"
        />
        {/* You can add more <Line> components for additional lines on the chart */}
      </AreaChart>
    </ResponsiveContainer>
  );
}
