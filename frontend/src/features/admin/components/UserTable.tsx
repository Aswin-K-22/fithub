// frontend/src/features/admin/components/UserTable.tsx
import React from "react";
import { User } from "../../../entities/User";
import { toggleUserVerification } from "../../../useCases/admin/toggleUserVerification";
import { userApiRepository } from "../../../adapters/api/admin/userApi";
import { toast } from "react-toastify";

interface UserTableProps {
  users: User[];
  onUserUpdate: (updatedUser: User) => void; // Callback to update user in parent
}

const UserTable: React.FC<UserTableProps> = ({ users, onUserUpdate }) => {
  const getMembershipStyle = (membership: string | undefined) => {
    const value = membership || "N/A";
    switch (value) {
      case "Premium": return "bg-blue-100 text-blue-800";
      case "Elite": return "bg-purple-100 text-purple-800";
      case "Basic": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusStyle = (status: string | undefined) => {
    const value = status || "free-plan";
    switch (value) {
      case "Active": return "bg-green-100 text-green-800";
      case "Suspended": return "bg-red-100 text-red-800";
      case "Expiring Soon": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleToggleVerification = async (id: string) => {
    try {
      const updatedUser = await toggleUserVerification(userApiRepository, id);
      onUserUpdate(updatedUser);
      toast.success(updatedUser.isVerified ? "User unblocked" : "User blocked");
    } catch (error) {
      console.error("Failed to toggle user verification:", error);
      toast.error("Failed to toggle user status");
    }
  };

  const backendUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  const defaultProfilePic = "/images/user.jpg";

  return (
    <div className="bg-white shadow rounded-lg mb-8 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4 w-full">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fas fa-search text-gray-400 text-sm"></i>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
              placeholder="Search users..."
            />
          </div>
          <div className="flex space-x-4 sm:flex-row flex-col sm:w-auto w-full gap-4 sm:gap-0">
            <select className="block w-full sm:w-40 py-2 px-3 border border-gray-300 rounded-md text-sm text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600">
              <option>All Status</option>
              <option>Active</option>
              <option>Suspended</option>
              <option>Expiring Soon</option>
              <option>free-plan</option>
            </select>
            <select className="block w-full sm:w-40 py-2 px-3 border border-gray-300 rounded-md text-sm text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600">
              <option>All Memberships</option>
              <option>Basic</option>
              <option>Premium</option>
              <option>Elite</option>
              <option>N/A</option>
            </select>
            <button className="rounded-md bg-indigo-600 px-4 py-2 text-white text-sm hover:bg-indigo-700 transition duration-150 ease-in-out w-full sm:w-auto">
              <i className="fas fa-filter mr-2"></i>Apply Filters
            </button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 table-fixed">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Membership</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user, index) => (
              <tr key={user.email || index} className={index % 2 === 1 ? "bg-gray-50" : ""}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {user.profilePic ? (
                        <img className="h-10 w-10 rounded-full" src={`${backendUrl}${user.profilePic}`} alt={user.name} />
                      ) : (
                        <img className="h-10 w-10 rounded-full" src={defaultProfilePic} alt="Default" />
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getMembershipStyle(user.membership)}`}>
                    {user.membership || "N/A"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(user.status)}`}>
                    {user.status || "free-plan"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="rounded text-indigo-600 hover:text-indigo-700 mr-2">
                    <i className="fas fa-edit"></i>
                  </button>
                  <button className="rounded text-green-600 hover:text-green-700 mr-2">
                    <i className="fas fa-check"></i>
                  </button>
                  <button
                    onClick={() => handleToggleVerification(user.id)}
                    className={`rounded mr-2 ${
                      user.isVerified
                        ? "text-red-600 hover:text-red-700"
                        : "text-green-600 hover:text-green-700"
                    }`}
                  >
                    <i className={user.isVerified ? "fas fa-ban" : "fas fa-unlock"}></i>
                  </button>
                  <button className="rounded text-gray-600 hover:text-gray-700">
                    <i className="fas fa-ellipsis-v"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;