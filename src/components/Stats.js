import React from "react";
import { AreaChart, XAxis, Tooltip, CartesianGrid, YAxis,Area, Legend, Scatter } from "recharts";

function Stats(props) {
  return (
    <div style ={{"paddingTop":"15vh"}}>  
        <AreaChart width={props.width} height={props.height} data={props.data} margin={{ top:  0, right: 30, left: 10, bottom: 0 }}>
            <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                </linearGradient>
            </defs>
            <XAxis dataKey="name" />
            <YAxis label = {{value:'Words per Minute',angle:-90,position:'insideLeft',style: { textAnchor: 'middle' }}}/>
            <CartesianGrid stroke="#ffffff10" />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="raw" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
            <Area type="monotone" dataKey="cpm" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv)" />
            <Scatter name="Errors" dataKey="err" fill="#d81c1c" />
        </AreaChart>
    </div>
  );
}

export default Stats;