import React from "react";
//import { useSelector } from "react-redux";
//import { RootState } from "../../../lib/redux/store";

const Navbar: React.FC = () => {
  //const { user } = useSelector((state: RootState) => state.auth);

  return (
    <nav className="bg-white shadow-sm fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <img className="h-8 w-auto" src="https://ai-public.creatie.ai/gen_page/logo_placeholder.png" alt="FitHub" />
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <a href="#" className="border-indigo-600 text-indigo-600 border-b-2 inline-flex items-center px-1 pt-1 text-sm font-medium">
                Dashboard
              </a>
              <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Clients
              </a>
              <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Schedule
              </a>
              <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Analytics
              </a>
            </div>
          </div>
          <div className="flex items-center">
            <button className="p-2 rounded-full text-gray-500 hover:text-gray-600 relative">
              <i className="fas fa-bell text-xl"></i>
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
            </button>
            <div className="ml-4 flex items-center">
              <button className="flex rounded-full bg-white focus:outline-none">
                <img
                  className="h-8 w-8 rounded-full object-cover"
                  src="https://creatie.ai/ai/api/search-image?query=A%20professional%20headshot%20of%20a%20male%20fitness%20trainer%20with%20a%20friendly%20smile,%20wearing%20athletic%20attire,%20against%20a%20neutral%20studio%20background.%20The%20image%20should%20be%20well-lit%20and%20capture%20the%20subject%27s%20confident%20and%20approachable%20demeanor.&width=200&height=200&orientation=squarish&flag=d79633d0-a3c3-4ed3-a8b2-4347f3a5ee71"
                  alt="Trainer"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;