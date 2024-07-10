import { Legend, PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip } from "recharts";

export default function CustomRadarChart (props) {

  return (
    <ResponsiveContainer width="100%" height={400}>
      {props.data && <RadarChart outerRadius={100} data={props.data}>
        <Radar name="Data" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        <PolarGrid />
        <PolarAngleAxis dataKey="name" />
        <Legend />
        <Tooltip />
      </RadarChart>}
    </ResponsiveContainer>
  );
};
