import React from "react";
import StatCard from "../components/StatCard";
import { Trainer } from "../../../entities/Trainer";
import { Link } from "react-router-dom";



const Trainers: React.FC = () => {

  const trainers: Trainer[] = [
    {
      name: "Sarah Johnson",
      email: "sarah.j@fithub.com",
      specialization: "Yoga, Pilates",
      experience: "5 years",
      rating: 4.8,
      status: "Active",
      avatar:
        "https://creatie.ai/ai/api/search-image?query=A professional headshot of a female fitness trainer with a confident smile, wearing athletic attire, against a light studio background. The image should convey expertise and approachability.&width=40&height=40&orientation=squarish&flag=15014e22-0124-45ba-943e-16868bc477e2",
    },
    {
      name: "Michael Chen",
      email: "michael.c@fithub.com",
      specialization: "CrossFit, Strength",
      experience: "3 years",
      rating: 4.6,
      status: "Pending",
      avatar:
        "https://creatie.ai/ai/api/search-image?query=A professional headshot of a male fitness trainer with a strong physique, wearing a fitted t-shirt, against a neutral studio background. The image should convey strength and professionalism.&width=40&height=40&orientation=squarish&flag=0b7f0941-7b5c-4cb5-9821-6566f349a85e",
    },
  ];

  // Static stats (replace with dynamic data later)
  const stats = {
    totalTrainers: 248,
    pendingApproval: 12,
    activeTrainers: 189,
    suspended: 7,
  };

  return (
    <main className="max-w-8xl px-4 sm:px-6 lg:px-8 py-8">
      
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Trainer Management</h1>
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-4">
          <StatCard
            title="Total Trainers"
            value={stats.totalTrainers}
            icon="fas fa-users"
            bgColor="bg-custom bg-opacity-10"
            textColor="text-custom"
          />
          <StatCard
            title="Pending Approval"
            value={stats.pendingApproval}
            icon="fas fa-clock"
            bgColor="bg-yellow-100"
            textColor="text-yellow-600"
          />
          <StatCard
            title="Active Trainers"
            value={stats.activeTrainers}
            icon="fas fa-check-circle"
            bgColor="bg-green-100"
            textColor="text-green-600"
          />
          <StatCard
            title="Suspended"
            value={stats.suspended}
            icon="fas fa-ban"
            bgColor="bg-red-100"
            textColor="text-red-600"
          />
        </div>
      </div>

      {/* Search and Filters Section */}
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1 min-w-0">
              <div className="relative rounded-md shadow-sm max-w-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-search text-gray-400"></i>
                </div>
                <input
                  type="text"
                  className="focus:ring-custom focus:border-custom block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search trainers..."
                />
              </div>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-4 flex items-center space-x-3">
              <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-custom focus:border-custom sm:text-sm rounded-md">
                <option>All Status</option>
                <option>Active</option>
                <option>Pending</option>
                <option>Suspended</option>
              </select>
              <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-custom focus:border-custom sm:text-sm rounded-md">
                <option>All Specializations</option>
                <option>Yoga</option>
                <option>CrossFit</option>
                <option>Personal Training</option>
              </select>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom">
                <i className="fas fa-filter mr-2"></i>
                More Filters
              </button>
              <Link
                to="/admin/trainers/add"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-custom hover:bg-custom-dark rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom"
              >
                <i className="fas fa-plus mr-2"></i>
                Add New Trainer
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Trainers Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trainer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {trainers.map((trainer) => (
                <tr key={trainer.email}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full" src={trainer.avatar} alt={trainer.name} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{trainer.name}</div>
                        <div className="text-sm text-gray-500">{trainer.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trainer.specialization}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trainer.experience}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <i className="fas fa-star text-yellow-400"></i>
                      <span className="ml-1 text-sm text-gray-900">{trainer.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        trainer.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : trainer.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {trainer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {trainer.status === "Pending" ? (
                      <>
                        <button className="text-green-600 hover:text-green-900 mr-3">
                          <i className="fas fa-check"></i>
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <i className="fas fa-times"></i>
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="text-custom hover:text-custom-dark mr-3">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <i className="fas fa-ban"></i>
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{" "}
                  <span className="font-medium">{stats.totalTrainers}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">1</button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-custom text-sm font-medium text-white">2</button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">3</button>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

    </main>
  );
};

export default Trainers;