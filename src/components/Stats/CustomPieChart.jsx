import React, { useState } from "react";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function CustomPieChart(props) {
  const [clicked, setClicked] = useState(null);

  const predefinedColors = [
    "#002F6C",
    "#BA0C2F",
    "#0064B6",
    "#A7C6ED",
    "#8C8C8C",
    "#5E5E5E",
    "#F8F9FB",
    "#CBCBC8",
    "#231F20",
  ];

  // Initialize a variable to keep track of the current color index
  let currentColorIndex = 0;

  // Function to get the next color
  function getNextColor() {
    const color = predefinedColors[currentColorIndex];
    currentColorIndex = (currentColorIndex + 1) % predefinedColors.length;
    return color;
  }

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

  function randomColor() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  }

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
    value,
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
        fontSize={9}
      >
        {`${withCommas(value)}`}
      </text>
    );
  };

  function slice_string(input) {
    return input.slice(0, 15);
  }

  return (
    <ResponsiveContainer width={"100%"} aspect={props.aspect}>
      <PieChart style={{ margin: "auto" }}>
        {props.data && (
          <Pie
            dataKey="value"
            isAnimationActive={true}
            data={props.data}
            cx="50%"
            cy="50%"
            innerRadius="10%"
            outerRadius="100%"
            fill="#8884d8"
            labelLine={false}
            label={renderCustomizedLabel}
           
          >
            {props?.data?.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  props?.data[index]?.name === clicked
                    ? "#ff9900"
                    : getNextColor()
                }
              />
            ))}
          </Pie>
        )}
        <Tooltip
          wrapperStyle={{ outline: "none" }}
          content={<CustomTooltip />}
        />
        <Legend
          formatter={(value, entry, index) => (
            <span style={{ fontSize: "x-small" }} className="chart-text">
              {value?.length <= 5 ? value : value?.substring(0, 5)}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
