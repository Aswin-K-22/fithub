import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../lib/redux/store";
import Navbar from "./Navbar"; 
import StatCard from "./StatCard";
import SessionCard from "./SessionCard";
import NotificationCard from "./NotificationCard";
import ChatCard from "./ChatCard";
import ReactECharts from "echarts-for-react";
import { EChartsOption } from "echarts";

const TrainerDashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const stats = [
    { icon: "fa-calendar-day", title: "Today's Sessions", value: "8" },
    { icon: "fa-users", title: "Active Clients", value: "24" },
    { icon: "fa-dollar-sign", title: "Monthly Earnings", value: "$4,250" },
    { icon: "fa-star", title: "Average Rating", value: "4.9" },
  ];

  const sessions = [
    {
      name: "Sarah Johnson",
      type: "Strength Training",
      time: "9:00 AM - 10:00 AM",
      avatar: "https://creatie.ai/ai/api/search-image?query=A%20professional%20headshot%20of%20a%20young%20woman%20in%20athletic%20wear,%20looking%20confident%20and%20energetic,%20against%20a%20clean%20studio%20background.%20The%20image%20should%20convey%20fitness%20and%20wellness.&width=200&height=200&orientation=squarish&flag=1a5a83ba-75bd-4237-b15a-187f1f4e9d05",
    },
    {
      name: "David Miller",
      type: "HIIT Workout",
      time: "10:30 AM - 11:30 AM",
      avatar: "https://creatie.ai/ai/api/search-image?query=A%20professional%20headshot%20of%20a%20middle-aged%20man%20in%20fitness%20attire,%20showing%20a%20determined%20expression,%20against%20a%20neutral%20background.%20The%20image%20should%20reflect%20dedication%20to%20fitness.&width=200&height=200&orientation=squarish&flag=93b9c1da-1a95-4b1b-94ae-a84013218191",
    },
  ];

  const notifications = [
    { icon: "fa-bell", text: "New booking request from Emma Wilson", time: "5 minutes ago", color: "text-indigo-600" },
    { icon: "fa-check", text: "Session completed with John Davis", time: "1 hour ago", color: "text-green-600" },
  ];

  const chats = [
    { name: "Sarah Johnson", status: "Online", avatar: sessions[0].avatar },
    { name: "David Miller", status: "Last seen 5m ago", avatar: sessions[1].avatar },
  ];

  const chartOption : EChartsOption = {
    animation: false,
    tooltip: { trigger: "axis" },
    legend: { data: ["Sessions", "Revenue"] },
    grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
    xAxis: { type: "category", boundaryGap: false, data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
    yAxis: { type: "value" },
    series: [
      { name: "Sessions", type: "line", data: [5, 7, 6, 8, 9, 6, 4], smooth: true, lineStyle: { color: "#4F46E5" }, itemStyle: { color: "#4F46E5" } },
      { name: "Revenue", type: "line", data: [250, 350, 300, 400, 450, 300, 200], smooth: true, lineStyle: { color: "#10B981" }, itemStyle: { color: "#10B981" } },
    ],
  };

  return (
    <div className="bg-gray-50 min-h-screen font-[Inter]">
      <Navbar />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-center">
              <img
                className="h-20 w-20 rounded-full object-cover mr-6"
                src="https://creatie.ai/ai/api/search-image?query=A%20professional%20headshot%20of%20a%20male%20fitness%20trainer%20with%20a%20friendly%20smile,%20wearing%20athletic%20attire,%20against%20a%20neutral%20studio%20background.%20The%20image%20should%20be%20well-lit%20and%20capture%20the%20subject%27s%20confident%20and%20approachable%20demeanor.&width=200&height=200&orientation=squarish&flag=17c37b32-d20a-4129-92b3-6ac4eb738e85"
                alt="Trainer"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name || "Michael Anderson"}</h1>
                <p className="text-gray-500">Personal Trainer | Fitness Specialist</p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 mb-8">
            {stats.map((stat, index) => (
              <StatCard key={index} icon={stat.icon} title={stat.title} value={stat.value} />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {/* Upcoming Sessions */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Upcoming Sessions</h2>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center">
                    <i className="fas fa-plus mr-2"></i> Add Session
                  </button>
                </div>
                <div className="space-y-4">
                  {sessions.map((session, index) => (
                    <SessionCard key={index} {...session} />
                  ))}
                </div>
                {/* Pagination */}
                <div className="flex justify-center mt-6">
                  <nav className="inline-flex rounded-md shadow-sm -space-x-px">
                    <button className="px-2 py-2 rounded-l-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50">
                      <i className="fas fa-chevron-left"></i>
                    </button>
                    {[1, 2, 3].map((page) => (
                      <button key={page} className="px-4 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
                        {page}
                      </button>
                    ))}
                    <button className="px-2 py-2 rounded-r-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50">
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </nav>
                </div>
              </div>

              {/* Performance Analytics */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Performance Analytics</h2>
                <ReactECharts option={chartOption} style={{ height: "300px" }} />
              </div>
            </div>

            <div>
              {/* Notifications */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Notifications</h2>
                <div className="space-y-4">
                  {notifications.map((notification, index) => (
                    <NotificationCard key={index} {...notification} />
                  ))}
                </div>
              </div>

              {/* Quick Chat */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Chat</h2>
                <div className="space-y-4">
                  {chats.map((chat, index) => (
                    <ChatCard key={index} {...chat} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TrainerDashboard;