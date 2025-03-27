// src/features/admin/pages/UserManagement.tsx
import React, { useState, useEffect } from "react";
import UserTable from "../components/UserTable";
import { fetchUsers } from "../../../useCases/fetchUsers";
import { userApiRepository } from "../../../adapters/api/userApi";
import { User } from "../../../entities/User";

const UserManagement: React.FC = () => {

    const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const loadUsers = async () => {
      try {
        const fetchedUsers = await fetchUsers(userApiRepository);
        setUsers(fetchedUsers);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch users");
        setLoading(false);
        console.error("Error fetching users:", err);
      }
    };
    loadUsers();
  }, []);



if (loading) {
    return <main className="p-6">Loading...</main>;
  }

  if (error) {
    return <main className="p-6">{error}</main>;
  }
  return (
    <main className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
        <p className="mt-2 text-sm text-gray-700">Manage and monitor all registered users in the FitHub platform</p>
      </div>
      <UserTable users={users} />
    </main>
  );
};
 
export default UserManagement;