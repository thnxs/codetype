import React from "react";
import { LineChart, XAxis, Tooltip, CartesianGrid, Line } from "recharts";

function Stats(props) {
  return (
    <>
        <LineChart width={400} height={400} data={props.data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <XAxis dataKey="name" />
            <Tooltip />
            <CartesianGrid stroke="#f5f5f5" />
            <Line type="monotone" dataKey="uv" stroke="#ff7300" yAxisId={0} />
            <Line type="monotone" dataKey="pv" stroke="#387908" yAxisId={1} />
        </LineChart>
    </>
  );
}

export default Stats;