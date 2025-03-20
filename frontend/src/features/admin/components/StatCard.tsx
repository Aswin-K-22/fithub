import React from "react";

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  percentage: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, percentage, color }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="text-2xl font-semibold mt-1">{value}</h3>
      </div>
      <div className={`w-12 h-12 bg-indigo-600 bg-opacity-10 rounded-full flex items-center justify-center ${color}`}>
        <i className={`fas ${icon}`}></i>
      </div>
    </div>
    <div className="mt-4 flex items-center">
      <span className="text-green-500 text-sm flex items-center">
        <i className="fas fa-arrow-up mr-1"></i>
        {percentage}
      </span>
      <span className="text-gray-400 text-sm ml-2">vs last month</span>
    </div>
  </div>
);

export default StatCard;