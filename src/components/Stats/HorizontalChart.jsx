import React from "react";
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";


export default function Horizontal(props) {

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
  function randomColor() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  }

  return (
    <div className="chrt">
      <ResponsiveContainer width="100%" aspect={props.aspect}>
        <ComposedChart
          layout="vertical"
          data={props.data}
          margin={{
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="value" type="number" />
          <YAxis dataKey="name" fontSize={10} type="category" />
          <Tooltip
            wrapperStyle={{ outline: "none" }}
            content={<CustomTooltip />}
          />
          <Bar dataKey="value" fill={randomColor()}>
            {props?.data?.map((entry, index) => (
              <Cell key={index} fill={randomColor()} />
            ))}
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>

    </div>
  );
}
