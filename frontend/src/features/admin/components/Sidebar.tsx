import React from "react";

const Sidebar: React.FC = () => {
  const navItems = [
    { icon: "fa-chart-line", label: "Dashboard", active: true },
    { icon: "fa-users", label: "Users" },
    { icon: "fa-dumbbell", label: "Trainers" },
    { icon: "fa-building", label: "Gyms" },
    { icon: "fa-dollar-sign", label: "Earnings" },
    { icon: "fa-credit-card", label: "Subscriptions" },
    { icon: "fa-robot", label: "AI Training" },
    { icon: "fa-bell", label: "Notifications" },
    { icon: "fa-headset", label: "Support" },
    { icon: "fa-cog", label: "Settings" },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 fixed h-full">
      <div className="h-16 flex items-center justify-center border-b border-gray-200">
        <img src="https://ai-public.creatie.ai/gen_page/logo_placeholder.png" alt="FitHub Logo" className="h-8" />
      </div>
      <nav className="mt-6">
        <div className="px-3 space-y-1">
          {navItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                item.active ? "bg-indigo-600 text-white" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <i className={`fas ${item.icon} w-6`}></i>
              <span>{item.label}</span>
            </a>
          ))}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;