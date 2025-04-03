// frontend/src/features/admin/pages/UserManagement.tsx
import React, { useState, useEffect } from "react";
import UserTable from "../components/UserTable";
import { fetchUsers } from "../../../useCases/admin/fetchUsers";
import { userApiRepository } from "../../../adapters/api/admin/userApi";
import { User } from "../../../entities/User";

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 3;

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const fetchedUsers = await fetchUsers(userApiRepository, page, limit);
        setUsers(fetchedUsers);
        const response = await userApiRepository.getUsers(page, limit);
        setTotalPages(response.totalPages);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch users");
        setLoading(false);
        console.error("Error fetching users:", err);
      }
    };
    loadUsers();
  }, [page]);

  const handleUserUpdate = (updatedUser: User) => {
    setUsers(users.map(user => (user.id === updatedUser.id ? updatedUser : user)));
  };

  if (loading) return <main className="p-6">Loading...</main>;
  if (error) return <main className="p-6">{error}</main>;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  const renderPagination = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    const startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`mx-1 px-3 py-1 rounded-full text-sm font-medium ${
            page === i
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="mt-4 flex justify-center items-center space-x-2">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="px-3 py-1 rounded-full bg-gray-200 text-gray-700 disabled:opacity-50 hover:bg-gray-300"
        >
          <i className="fas fa-chevron-left"></i>
        </button>
        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="mx-1 px-3 py-1 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              1
            </button>
            {startPage > 2 && <span className="text-gray-500">...</span>}
          </>
        )}
        {pageNumbers}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="text-gray-500">...</span>}
            <button
              onClick={() => handlePageChange(totalPages)}
              className="mx-1 px-3 py-1 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              {totalPages}
            </button>
          </>
        )}
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className="px-3 py-1 rounded-full bg-gray-200 text-gray-700 disabled:opacity-50 hover:bg-gray-300"
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    );
  };

  return (
    <main className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
        <p className="mt-2 text-sm text-gray-700">Manage and monitor all registered users in the FitHub platform</p>
      </div>
      <UserTable users={users} onUserUpdate={handleUserUpdate} />
      {renderPagination()}
    </main>
  );
};

export default UserManagement;