import React, { useState } from "react";

import {
  Cell,
  Pie,
  PieChart,
  Tooltip
} from "recharts";

export default function RChart(props) {
  const [clicked, setClicked] = useState(null);
  const COLORS = ["red", "green"];
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
            style={{ fontSize: "small", border: "none" }}
            className="label"
          >{`${payload[0].name} : ${withCommas(payload[0].value)}`}</p>
        </div>
      );
    }

    return null;
  };

  function withCommas(x) {
    return x?.toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ",");;
  }

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.3;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <PieChart width={50} height={50} style={{ margin: "auto" }}>
      {props.data && (
        <Pie
          dataKey="value"
          isAnimationActive={true}
          data={props.data}
          cx="50%"
          cy="50%"
          innerRadius="0%"
          outerRadius="100%"
          fill="#8884d8"
          labelLine={false}
        >
          {props?.data?.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                props?.data[index]?.name === clicked ? "#ff9900" : COLORS[index]
              }
            />
          ))}
        </Pie>
      )}
      <Tooltip wrapperStyle={{ outline: "none" }} content={<CustomTooltip />} />
    </PieChart>
  );
}
