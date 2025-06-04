import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Label,
} from 'recharts';
import CustomTooltip from './CustomTooltip';
import CustomLegend from './CustomLegend';

const CustomPieChart = ({ data, label, totalAmount, colors, showTextAnchor }) => {
  return (
    <div style={{ width: '100%', height: 380 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius="80%"
            innerRadius="60%"
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}

            {/* ✨ Center label */}
            {showTextAnchor && (
              <Label
                position="center"
                content={({ viewBox }) => {
                  const { cx, cy } = viewBox;
                  return (
                    <>
                      <text
                        x={cx}
                        y={cy - 10}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill="#666"
                        fontSize="14px"
                      >
                        {label}
                      </text>
                      <text
                        x={cx}
                        y={cy + 15}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill="#333"
                        fontSize="24px"
                        fontWeight="600"
                      >
                        {totalAmount}
                      </text>
                    </>
                  );
                }}
              />
            )}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomPieChart;
