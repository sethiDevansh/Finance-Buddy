import React from 'react'
import {PieChart,Pie,Cell,Tooltip,ResponsiveContainer,Legend} from 'recharts';
import CustomTooltip from './CustomTooltip';
import CustomLegend from './CustomLegend';

const CustomPieChart = ({data,label,totalAmount,colors,showTextAnchor}) => {

  return <ResponsiveContainer width="100%" height={380}>
    <PieChart width={400} height={400}>
        <Pie
            data={data}
            dataKey="amount"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={130}
            innerRadius={100}
            labelLine={false}
        >
            {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend content={<CustomLegend />} />

        {showTextAnchor && (
  <>
    <text
      x="50%"
      y="50%"
      textAnchor="middle"
      dominantBaseline="central"
      fill="#666"
      fontSize="14px"
      style={{ backgroundColor: 'red' }}
    >
      {label}
    </text>
    <text
      x="50%"
      y="50%"
      dy="20"
      textAnchor="middle"
      dominantBaseline="central"
      fill="#333"
      fontSize="24px"
      fontWeight="600"
    >
      {totalAmount}
    </text>
  </>
)}

    </PieChart>
    </ResponsiveContainer>
};

export default CustomPieChart;