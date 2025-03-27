// src/features/admin/components/UserTable.tsx
import React from "react";
import { User } from "../../../entities/User";

interface UserTableProps {
  users: User[];
}

const UserTable: React.FC<UserTableProps> = ({ users }) => {
  const getMembershipStyle = (membership: string | undefined) => {
    const value = membership || "N/A"; // Use "N/A" if undefined
    switch (value) {
      case "Premium":
        return "bg-blue-100 text-blue-800";
      case "Elite":
        return "bg-purple-100 text-purple-800";
      case "Basic":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800"; // Applies to "N/A" too
    }
  };

  const getStatusStyle = (status: string | undefined) => {
    const value = status || "free-plan"; // Use "free-plan" if undefined
    switch (value) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Suspended":
        return "bg-red-100 text-red-800";
      case "Expiring Soon":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800"; // Applies to "free-plan" too
    }
  };

  return (
    <div className="bg-white shadow rounded-lg mb-8 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4 w-full">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fas fa-search text-gray-400"></i>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600"
              placeholder="Search users..."
            />
          </div>
          <div className="flex space-x-4 sm:flex-row flex-col sm:w-auto w-full">
            <select className="block w-full rounded-md border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600">
              <option>All Status</option>
              <option>Active</option>
              <option>Suspended</option>
              <option>Expiring Soon</option>
              <option>free-plan</option> {/* Add default status */}
            </select>
            <select className="block w-full rounded-md border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600">
              <option>All Memberships</option>
              <option>Basic</option>
              <option>Premium</option>
              <option>Elite</option>
              <option>N/A</option> {/* Add default membership */}
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
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input type="checkbox" className="rounded h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-600" />
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Membership</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user, index) => (
              <tr key={user.email || index} className={index % 2 === 1 ? "bg-gray-50" : ""}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input type="checkbox" className="rounded h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-600" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {user.avatar && user.avatar !== "profile pic" ? (
                        <img className="h-10 w-10 rounded-full" src={user.avatar} alt={user.name} />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                          N/A
                        </div>
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.lastLogin || "N/A"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="rounded text-indigo-600 hover:text-indigo-700 mr-2">
                    <i className="fas fa-edit"></i>
                  </button>
                  <button className="rounded text-green-600 hover:text-green-700 mr-2">
                    <i className="fas fa-check"></i>
                  </button>
                  <button className="rounded text-red-600 hover:text-red-700 mr-2">
                    <i className="fas fa-ban"></i>
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
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button className="rounded relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            Previous
          </button>
          <button className="rounded relative ml-3 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of <span className="font-medium">{users.length}</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded shadow-sm -space-x-px">
              <button className="rounded-l relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <i className="fas fa-chevron-left"></i>
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                1
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                2
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                3
              </button>
              <button className="rounded-r relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <i className="fas fa-chevron-right"></i>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTable;