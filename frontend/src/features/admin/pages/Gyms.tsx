// features/admin/pages/Gyms.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StatCard from "../components/StatCard";
import { Gym } from "../../../entities/Gym";
import { gymsList } from "../../../lib/api/authApi";

const Gyms: React.FC = () => {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalGyms, setTotalGyms] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGym, setSelectedGym] = useState<Gym | null>(null);

  const backendUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  const limit = 2; // 2 gyms per page

  // Fetch gyms from backend
  useEffect(() => {
    const fetchGyms = async () => {
      try {
        const {gyms ,total,totalPages } = await gymsList(page,limit);
        setGyms(gyms);
        setTotalGyms(total);
        setTotalPages(totalPages);

       
      } catch (error) {
        console.error("Error fetching gyms:", error);
      }
    };
    fetchGyms();
  }, [page]);

  const stats = {
    totalGyms, // Dynamic from DB
    pendingApprovals: 18, // Static for now
    activeMembers: 15248, // Static for now
    monthlyRevenue: 86429, // Static for now
  };

  const openModal = (gym: Gym) => {
    setSelectedGym(gym);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedGym(null);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
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
              <Link
                to="/admin/gym/add"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-custom hover:bg-custom-dark rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom"
              >
                <i className="fas fa-plus mr-2"></i>
                Add New Gym
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gym</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {gyms.map((gym) => (
                <tr key={gym.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-lg object-cover"
                          src={`${backendUrl}${gym.images[0]?.url || "/default-gym.jpg"}`}
                          alt={gym.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{gym.name}</div>
                        <div className="text-sm text-gray-500">{gym.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{gym.address?.city || "N/A"}</div>
                    <div className="text-sm text-gray-500">{gym.address?.state || "N/A"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{gym.contact?.phone || "N/A"}</div>
                    <div className="text-sm text-gray-500">{gym.contact?.email || "N/A"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900">
                        {gym.ratings?.average || "N/A"}
                      </span>
                      {/* Static rating display for now */}
                      <div className="ml-2 flex text-yellow-400">
                        {gym.ratings?.average
                          ? Array(Math.floor(gym.ratings.average)).fill(<i className="fas fa-star"></i>)
                          : null}
                        {gym.ratings?.average && gym.ratings.average % 1 !== 0 ? (
                          <i className="fas fa-star-half-alt"></i>
                        ) : null}
                        {gym.ratings?.average
                          ? Array(5 - Math.ceil(gym.ratings.average)).fill(<i className="far fa-star"></i>)
                          : null}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button className="text-custom hover:text-custom-dark">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="text-gray-400 hover:text-gray-500" onClick={() => openModal(gym)}>
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
                  Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{" "}
                  <span className="font-medium">{Math.min(page * limit, totalGyms)}</span> of{" "}
                  <span className="font-medium">{totalGyms}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                        p === page ? "bg-custom text-white" : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
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
                  src={`${backendUrl}${selectedGym.images[0]?.url || "/default-gym.jpg"}`}
                  alt={selectedGym.name}
                  className="w-1/2 h-48 object-cover rounded-lg"
                />
                <div className="w-1/2 space-y-4">
                  <h4 className="font-semibold text-lg">{selectedGym.name}</h4>
                  <p className="text-gray-600">{selectedGym.description}</p>
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-map-marker-alt text-custom"></i>
                    <span className="text-gray-600">{`${selectedGym.address?.city || "N/A"}, ${
                      selectedGym.address?.state || "N/A"
                    }`}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-phone text-custom"></i>
                    <span className="text-gray-600">{selectedGym.contact?.phone || "N/A"}</span>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-6">
                <h5 className="font-semibold mb-4">Facilities</h5>
                <div className="grid grid-cols-3 gap-4">
                  {selectedGym.facilities?.hasPool && (
                    <div className="flex items-center space-x-2">
                      <i className="fas fa-swimming-pool text-custom"></i>
                      <span>Swimming Pool</span>
                    </div>
                  )}
                  {selectedGym.facilities?.hasSauna && (
                    <div className="flex items-center space-x-2">
                      <i className="fas fa-hot-tub text-custom"></i>
                      <span>Sauna</span>
                    </div>
                  )}
                  {selectedGym.facilities?.hasParking && (
                    <div className="flex items-center space-x-2">
                      <i className="fas fa-parking text-custom"></i>
                      <span>Parking</span>
                    </div>
                  )}
                  {selectedGym.facilities?.hasLockerRooms && (
                    <div className="flex items-center space-x-2">
                      <i className="fas fa-lock text-custom"></i>
                      <span>Locker Rooms</span>
                    </div>
                  )}
                  {selectedGym.facilities?.hasWifi && (
                    <div className="flex items-center space-x-2">
                      <i className="fas fa-wifi text-custom"></i>
                      <span>Wifi</span>
                    </div>
                  )}
                  {selectedGym.facilities?.hasShowers && (
                    <div className="flex items-center space-x-2">
                      <i className="fas fa-shower text-custom"></i>
                      <span>Showers</span>
                    </div>
                  )}
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