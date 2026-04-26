import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
  } from "recharts";
  
  const data = [
    { name: "Mon", value: 30 },
    { name: "Tue", value: 50 },
    { name: "Wed", value: 40 },
    { name: "Thu", value: 70 },
    { name: "Fri", value: 60 },
  ];
  
  export const SalesChart = () => {
    return (
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#4f46e5" />
        </LineChart>
      </ResponsiveContainer>
    );
  };