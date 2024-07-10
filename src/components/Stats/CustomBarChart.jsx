import React, { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

export default function CustomBarChart(props) {
  const [clicked, setClicked] = useState(null);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: "white",
            padding: "10px",
            borderRadius: "3px",
            border: "1px solid #60606040",
            boxShadow: "1px 1px #60606050",
          }}
          className="custom-tooltip"
        >
          <p
            style={{ border: "none" }}
            className="label"
          >{`${label} : ${withCommas(payload[0]?.value)}`}</p>
        </div>
      );
    }

    return null;
  };

  function withCommas(x) {
    return x?.toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ",");;
  }

  const CustomBarLabel = ({ x, y, value }) => {
    return (
      <text x={x} y={y} dy={-(y / 2)} fill="#fff" textAnchor="middle">
        {withCommas(value)}
      </text>
    );
  };
  return (
    <ResponsiveContainer aspect={props.aspect} width={"99%"}>
      <BarChart data={props.data} cx="0%" margin={{ left: -5, right: 20 }}>
        <CartesianGrid stroke="#f5f5f5" />
        <YAxis
          style={{ fill: "#29B6F6" }}
          tick={{ fill: "red" }}
          fontSize={12}
          tickLine={{ stroke: "#29B6F6" }}
          dataKey="value"
        />
        <XAxis
          style={{ fill: "#29B6F6" }}
          tick={{ fill: "red" }}
          fontSize={12}
          tickLine={{ stroke: "#29B6F6" }}
          dataKey="name"
        />
        <Tooltip
          wrapperStyle={{ outline: "none" }}
          content={<CustomTooltip />}
        />
        <Bar dataKey="value" fill="#0064B6">
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
