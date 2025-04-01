import React, { useState } from "react";
import { Link } from "react-router-dom";
import StatCard from "../components/StatCard";
import { Gym } from "../../../entities/Gym";


const Gyms: React.FC = () => {
  const gyms: Gym[] = [
    {
      name: "PowerFit Elite",
      description: "Premium Facility",
      location: "New York, NY",
      subLocation: "Downtown",
      contact: "+1 (555) 123-4567",
      email: "info@powerfit.com",
      rating: 4.8,
      status: "Active",
      image:
        "https://creatie.ai/ai/api/search-image?query=A modern gym interior with state-of-the-art equipment, clean and well-lit space, featuring weight machines and cardio equipment against a minimalist background&width=40&height=40&orientation=squarish&flag=72d77b7d-9dd8-4671-bb54-08e95e17780b",
    },
    {
      name: "FitZone Central",
      description: "Standard Facility",
      location: "Los Angeles, CA",
      subLocation: "Beverly Hills",
      contact: "+1 (555) 987-6543",
      email: "contact@fitzone.com",
      rating: 4.2,
      status: "Pending",
      image:
        "https://creatie.ai/ai/api/search-image?query=A modern gym interior with focus on functional training area, featuring kettlebells, resistance bands, and open space for workouts against a minimalist background&width=40&height=40&orientation=squarish&flag=7f343262-f0db-4cb2-bb65-35e150093c6d",
    },
  ];

  const stats = {
    totalGyms: 248,
    pendingApprovals: 18,
    activeMembers: 15248,
    monthlyRevenue: 86429,
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGym, setSelectedGym] = useState<Gym | null>(null);

  const openModal = (gym: Gym) => {
    setSelectedGym(gym);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedGym(null);
  };

  return (
    <main className="max-w-8xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Gym Management</h1>
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-4">
          <StatCard
            title="Total Gyms"
            value={stats.totalGyms}
            icon="fas fa-dumbbell"
            bgColor="bg-custom bg-opacity-10"
            textColor="text-custom"
            percentage="12%"
          />
          <StatCard
            title="Pending Approvals"
            value={stats.pendingApprovals}
            icon="fas fa-clock"
            bgColor="bg-yellow-100"
            textColor="text-yellow-600"
            percentage="8%"
          />
          <StatCard
            title="Active Members"
            value={stats.activeMembers.toLocaleString()}
            icon="fas fa-users"
            bgColor="bg-green-100"
            textColor="text-green-600"
            percentage="24%"
          />
          <StatCard
            title="Monthly Revenue"
            value={`$${stats.monthlyRevenue.toLocaleString()}`}
            icon="fas fa-dollar-sign"
            bgColor="bg-purple-100"
            textColor="text-purple-600"
            percentage="18%"
          />
        </div>
      </div>

      {/* Updated Search and Filters Section */}
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-search text-gray-400"></i>
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-4 py-2 text-base border border-gray-300 rounded-md focus:ring-custom focus:border-custom focus:outline-none sm:text-sm"
                  placeholder="Search gyms..."
                />
              </div>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-4 flex items-center space-x-3">
              <select className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-custom focus:border-custom sm:text-sm">
                <option>All Status</option>
                <option>Active</option>
                <option>Pending</option>
                <option>Suspended</option>
              </select>
              <select className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-custom focus:border-custom sm:text-sm">
                <option>Rating: All</option>
                <option>5 Stars</option>
                <option>4+ Stars</option>
                <option>3+ Stars</option>
              </select>
              <Link
                to="/admin/gyms/add"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-custom hover:bg-custom-dark rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom"
              >
                <i className="fas fa-plus mr-2"></i>
                Add New Gym
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of the Gyms.tsx content (table and modal) remains unchanged */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gym</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {gyms.map((gym) => (
                <tr key={gym.email}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-lg object-cover" src={gym.image} alt={gym.name} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{gym.name}</div>
                        <div className="text-sm text-gray-500">{gym.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{gym.location}</div>
                    <div className="text-sm text-gray-500">{gym.subLocation}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{gym.contact}</div>
                    <div className="text-sm text-gray-500">{gym.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900">{gym.rating}</span>
                      <div className="ml-2 flex text-yellow-400">
                        {Array(Math.floor(gym.rating)).fill(<i className="fas fa-star"></i>)}
                        {gym.rating % 1 !== 0 && <i className="fas fa-star-half-alt"></i>}
                        {Array(5 - Math.ceil(gym.rating)).fill(<i className="far fa-star"></i>)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        gym.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : gym.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {gym.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button className="text-custom hover:text-custom-dark">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="text-gray-400 hover:text-gray-500"
                        onClick={() => openModal(gym)}
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button className="text-red-400 hover:text-red-500">
                        <i className="fas fa-ban"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{" "}
                  <span className="font浏览-medium">{stats.totalGyms}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-custom text-sm font-medium text-white">1</button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">2</button>
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

      {isModalOpen && selectedGym && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="relative mx-auto p-5 w-full max-w-4xl bg-white rounded-lg shadow-xl">
            <div className="flex items-start justify-between p-4 border-b border-gray-200 rounded-t">
              <h3 className="text-xl font-semibold text-gray-900">Gym Details</h3>
              <button
                onClick={closeModal}
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-full text-sm p-1.5 border border-gray-300"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="p-6">
              <div className="flex space-x-4 mb-6">
                <img
                  src={selectedGym.image.replace("width=40&height=40", "width=300&height=200")}
                  alt={selectedGym.name}
                  className="w-1/2 h-48 object-cover rounded-lg"
                />
                <div className="w-1/2 space-y-4">
                  <h4 className="font-semibold text-lg">{selectedGym.name}</h4>
                  <p className="text-gray-600">{selectedGym.description}</p>
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-map-marker-alt text-custom"></i>
                    <span className="text-gray-600">{`${selectedGym.location}, ${selectedGym.subLocation}`}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-phone text-custom"></i>
                    <span className="text-gray-600">{selectedGym.contact}</span>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-6">
                <h5 className="font-semibold mb-4">Facilities</h5>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-dumbbell text-custom"></i>
                    <span>Weight Training</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-running text-custom"></i>
                    <span>Cardio Zone</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-hot-tub text-custom"></i>
                    <span>Sauna</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-swimming-pool text-custom"></i>
                    <span>Swimming Pool</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-user-friends text-custom"></i>
                    <span>Group Classes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-parking text-custom"></i>
                    <span>Parking</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end p-6 border-t border-gray-200 rounded-b">
              <button className="text-white bg-custom hover:bg-custom-dark font-medium rounded-md text-sm px-5 py-2.5 mr-2">
                Save Changes
              </button>
              <button
                onClick={closeModal}
                className="text-gray-500 bg-white hover:bg-gray-100 rounded-md border border-gray-300 text-sm font-medium px-5 py-2.5"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Gyms;