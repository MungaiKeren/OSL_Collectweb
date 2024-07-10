import React, { PureComponent } from "react";
import {
  Legend,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "2020",
    value: 2400,
    fill: "#8884d8",
  },
  {
    name: "2021",
    value: 4567,
    fill: "#CD5888",
  },
  {
    name: "2022",
    value: 1398,
    fill: "#A084DC",
  },
  {
    name: "2023",
    value: 400,
    fill: "#FC7300",
  },
];

const style = {
  top: "50%",
  right: 0,
  transform: "translate(0, -50%)",
  lineHeight: "24px",
};

export default class BarGraphExpense extends PureComponent {
  static demoUrl = "https://codesandbox.io/s/simple-radial-bar-chart-qf8fz";

  render() {
    return (
      <ResponsiveContainer width="95%" aspect={1.3}>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="10%"
          outerRadius="100%"
          barSize={20}
          data={data}
        >
          <RadialBar
            minAngle={15}
            label={{ position: "insideStart", fill: "#000" }}
            background
            clockWise
            dataKey="value"
          />
          <Legend
            iconSize={10}
            layout="vertical"
            verticalAlign="middle"
            wrapperStyle={style}
          />
        </RadialBarChart>
      </ResponsiveContainer>
    );
  }
}
