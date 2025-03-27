// src/features/admin/components/Header.tsx
import React from "react";

interface HeaderProps {
  user: { name?: string; email?: string } | null;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  handleLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, isOpen, setIsOpen, handleLogout }) => (
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
            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Profile Settings
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
);

export default Header;