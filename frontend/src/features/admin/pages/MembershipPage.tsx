// src/features/admin/pages/MembershipPlans.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMembershipPlans } from "../../../lib/api/authApi"; // Import API method
import { toast } from "react-toastify";

interface MembershipPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  features: string[];
}

const MembershipPlans: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPlans, setTotalPlans] = useState(0);
  const [loading, setLoading] = useState(false);

  const limit = 2; // Set limit to 2 per page

  // Dummy stats (replace with real data later if needed)
  const stats = [
    { title: "Total Active Plans", value: `${totalPlans} Plans`, icon: "fa-clipboard-list" },
    { title: "Most Popular Plan", value: "Premium Annual", icon: "fa-crown" }, // Placeholder
    { title: "Monthly Revenue", value: "$24,500", icon: "fa-dollar-sign" }, // Placeholder
  ];

  useEffect(() => {
    const loadPlans = async () => {
      setLoading(true);
      try {
        const data = await fetchMembershipPlans(page, limit);
        setPlans(data.plans);
        setTotalPages(data.pages);
        setTotalPlans(data.total);
      } catch (error) {
        toast.error("Failed to load membership plans");
        console.error("Error fetching plans:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPlans();
  }, [page]);

  const filteredPlans = plans.filter(
    (plan) =>
      plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <main className="py-6 px-4 sm:px-6 lg:px-8 max-w-8xl mx-auto">
      {/* Stats Section */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white overflow-hidden shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-100 rounded-full p-3">
                <i className={`fas ${stat.icon} text-indigo-600 text-xl`}></i>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <h3 className="text-lg font-semibold text-gray-900">{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Plans Table Section */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <div className="w-full sm:w-64 mb-4 sm:mb-0">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search plans..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-600 focus:border-indigo-600"
                />
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
            </div>
            <button
              onClick={() => navigate("/admin/subscriptions/add")}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center justify-center"
            >
              <i className="fas fa-plus mr-2"></i>
              Add New Plan
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {["Name", "Description", "Price", "Duration", "Features", "Actions"].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPlans.length > 0 ? (
                  filteredPlans.map((plan) => (
                    <tr key={plan.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{plan.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">{plan.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${plan.price.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{plan.duration} Month{plan.duration > 1 ? "s" : ""}</div>
                      </td>
                      <td className="px-6 py-4">
                        <ul className="list-disc list-inside text-sm text-gray-500">
                          {plan.features.map((feature, idx) => (
                            <li key={idx}>
                              {feature
                                .split("-")
                                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                .join(" ")}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-indigo-600 hover:text-indigo-800 mr-3">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      No plans found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{" "}
                <span className="font-medium">{Math.min(page * limit, totalPlans)}</span> of{" "}
                <span className="font-medium">{totalPlans}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-200"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                      page === pageNum ? "text-indigo-600 bg-indigo-50" : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-200"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MembershipPlans;