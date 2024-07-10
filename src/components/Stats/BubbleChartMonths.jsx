import React from "react";
import {
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis
} from "recharts";

const data01 = [
  { month: "Jan", index: 1, value: 170 },
  { month: "Feb", index: 1, value: 180 },
  { month: "Mar", index: 1, value: 150 },
  { month: "Apr", index: 1, value: 120 },
  { month: "May", index: 1, value: 200 },
  { month: "Jun", index: 1, value: 300 },
  { month: "Jul", index: 1, value: 400 },
  { month: "Aug", index: 1, value: 200 },
  { month: "Sep", index: 1, value: 100 },
  { month: "Oct", index: 1, value: 150 },
  { month: "Nov", index: 1, value: 160 },
  { month: "Dec", index: 1, value: 170 },
];

const data02 = [
  { month: "12a", index: 1, value: 160 },
  { month: "1a", index: 1, value: 180 },
  { month: "2a", index: 1, value: 150 },
  { month: "3a", index: 1, value: 120 },
  { month: "4a", index: 1, value: 200 },
  { month: "5a", index: 1, value: 300 },
  { month: "6a", index: 1, value: 100 },
  { month: "7a", index: 1, value: 200 },
  { month: "8a", index: 1, value: 100 },
  { month: "9a", index: 1, value: 150 },
  { month: "10a", index: 1, value: 160 },
  { month: "11a", index: 1, value: 160 },
  { month: "12a", index: 1, value: 180 },
  { month: "1p", index: 1, value: 144 },
  { month: "2p", index: 1, value: 166 },
  { month: "3p", index: 1, value: 145 },
  { month: "4p", index: 1, value: 150 },
  { month: "5p", index: 1, value: 160 },
  { month: "6p", index: 1, value: 180 },
  { month: "7p", index: 1, value: 165 },
  { month: "8p", index: 1, value: 130 },
  { month: "9p", index: 1, value: 140 },
  { month: "10p", index: 1, value: 160 },
  { month: "11p", index: 1, value: 180 },
];

const parseDomain = () => [
  0,
  Math.max(
    Math.max.apply(
      null,
      data01.map((entry) => entry.value)
    ),
    Math.max.apply(
      null,
      data02.map((entry) => entry.value)
    )
  ),
];

export default function BubbleChartMonth() {
  const domain = parseDomain();
  const range = [16, 225];

  return (
    <ResponsiveContainer width={"95%"} height={60}>
      <ScatterChart
        width={"100%"}
        height={"100%"}
        margin={{
          top: 10,
          right: 10,
          bottom: 10,
          left: 10,
        }}
      >
        <XAxis
          type="category"
          dataKey="month"
          interval={0}
          tick={{ fontSize: 0 }}
          tickLine={{ transform: "translate(0, -6)" }}
        />
        <YAxis
          type="number"
          dataKey="index"
          name="sunday"
          height={10}
          width={80}
          tick={false}
          tickLine={false}
          axisLine={false}
          label={{ value: "2023", position: "insideRight" }}
        />
        <ZAxis type="number" dataKey="value" domain={data01} range={range} />
        <Tooltip
          cursor={{ strokeDasharray: "3 3" }}
          wrapperStyle={{ zIndex: 100 }}
        />
        <Scatter data={data01} fill="#8884d8" />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
