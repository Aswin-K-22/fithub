import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; // Add useNavigate
import { RootState, AppDispatch } from "../../../lib/redux/store";
import Sidebar from "./Sidebar";
import StatCard from "./StatCard";
import ActivityCard from "./ActivityCard";
import ReactECharts from "echarts-for-react";
import { EChartsOption } from "echarts";
import { logout as logoutAction } from "../../../lib/redux/slices/authSlice"; // Add logout action
import { logout as logoutApi } from "../../../lib/api/authApi"; // Add logout API
import { toast } from "react-toastify"; // Add toast

const AdminDashboard: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>(); // Add dispatch
    const navigate = useNavigate(); // Add navigate
    const [isOpen, setIsOpen] = useState(false); // State for dropdown
  
    const handleLogout = async () => {
      try {
        if (user?.email) {
          await logoutApi(user.email);
          dispatch(logoutAction());
          toast.success("Logged out successfully!", { position: "top-right" });
          navigate("/admin/login");
        }
      } catch (error) {
        console.error("Logout failed:", error);
        toast.error("Logout failed—try again!", { position: "top-right" });
      }
      setIsOpen(false); // Close dropdown
    };
  
    const stats = [
      { title: "Total Users", value: "24,892", icon: "fa-users", percentage: "12.5%", color: "text-indigo-600" },
      { title: "Total Revenue", value: "$128,950", icon: "fa-dollar-sign", percentage: "8.2%", color: "text-indigo-600" },
      { title: "Active Trainers", value: "1,234", icon: "fa-dumbbell", percentage: "5.3%", color: "text-indigo-600" },
      { title: "Active Gyms", value: "456", icon: "fa-building", percentage: "3.8%", color: "text-indigo-600" },
    ];
  
    const activities = [
      { icon: "fa-user-plus", title: "New User Registration", desc: "John Smith joined the platform", time: "2 minutes ago", color: "bg-green-100 text-green-600" },
      { icon: "fa-dumbbell", title: "New Trainer Application", desc: "Sarah Johnson submitted application", time: "15 minutes ago", color: "bg-blue-100 text-blue-600" },
      { icon: "fa-dollar-sign", title: "New Subscription", desc: "Premium plan purchased", time: "1 hour ago", color: "bg-purple-100 text-purple-600" },
      { icon: "fa-star", title: "New Review", desc: "5-star rating received", time: "2 hours ago", color: "bg-yellow-100 text-yellow-600" },
    ];
  
    const revenueOption: EChartsOption = {
      animation: false,
      tooltip: { trigger: "axis" },
      grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
      xAxis: { type: "category", boundaryGap: false, data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] },
      yAxis: { type: "value" },
      series: [
        {
          name: "Revenue",
          type: "line",
          smooth: true,
          data: [15000, 18000, 22000, 25000, 28000, 32000, 35000, 38000, 42000, 45000, 48000, 52000],
          itemStyle: { color: "#4F46E5" },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{ offset: 0, color: "rgba(79, 70, 229, 0.3)" }, { offset: 1, color: "rgba(79, 70, 229, 0.1)" }],
            },
          },
        },
      ],
    };
  
    const userGrowthOption: EChartsOption = {
      animation: false,
      tooltip: { trigger: "axis" },
      xAxis: { type: "category", data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
      yAxis: { type: "value" },
      series: [{ data: [150, 230, 224, 218, 135, 147, 260], type: "bar", itemStyle: { color: "#4F46E5" } }],
    };
  
    const subscriptionOption: EChartsOption = {
      animation: false,
      tooltip: { trigger: "item" },
      series: [
        {
          type: "pie",
          radius: ["40%", "70%"],
          data: [{ value: 435, name: "Monthly" }, { value: 310, name: "Yearly" }, { value: 234, name: "Quarterly" }],
          itemStyle: { color: (params: { dataIndex: number }) => ["#4F46E5", "#818CF8", "#C7D2FE"][params.dataIndex] },
        },
      ],
    };

  return (
    <div className="min-h-screen flex bg-gray-50 font-[Inter]">
      <Sidebar />
      <div className="flex-1 ml-64">
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex-1 flex items-center">
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <i className="fas fa-bell"></i>
            </button>
            {/* Dropdown with Logout Button */}
            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
              >
                <img
                  src="https://creatie.ai/ai/api/search-image?query=A%20professional%20headshot%20of%20a%20business%20person%20with%20a%20friendly%20smile,%20wearing%20formal%20attire,%20against%20a%20neutral%20background&width=40&height=40&orientation=squarish&flag=8e4607d4-63ad-4bd7-a7c8-3d99b97bdfba"
                  alt="Admin"
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm font-medium">{user?.name || "Admin"}</span>
                <i className="fas fa-chevron-down text-xs"></i>
              </button>
              {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <a
                    href="#"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile Settings
                  </a>
                  <a
                    href="#"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Reports
                  </a>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="col-span-2 bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Revenue Overview</h3>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded-md">Week</button>
                  <button className="px-3 py-1 text-sm font-medium text-white bg-indigo-600 rounded-md">Month</button>
                  <button className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded-md">Year</button>
                </div>
              </div>
              <ReactECharts option={revenueOption} style={{ height: "320px" }} />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-6">Recent Activities</h3>
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <ActivityCard key={index} {...activity} />
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-6">User Growth</h3>
  <ReactECharts option={userGrowthOption} style={{ height: "256px" }} />            
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-6">Subscription Distribution</h3>
              <ReactECharts option={subscriptionOption} style={{ height: "256px" }} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;