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

//   const users = [
//     {
//       name: "Sarah Johnson",
//       email: "sarah.j@example.com",
//       membership: "Premium",
//       status: "Active",
//       lastLogin: "2 hours ago",
//       avatar: "https://creatie.ai/ai/api/search-image?query=A professional headshot of a young business woman with a confident smile, wearing business attire, against a clean background. The lighting should be soft and flattering.&width=40&height=40&orientation=squarish&flag=a591fad6-618b-4f48-a001-da0d57fe4367&flag=0aab2f7f-5683-4b6f-a057-d865fc98c6aa&flag=e6a0b9cc-0f99-437c-b322-501b8290ceaf&flag=0755ed8b-625a-4965-96d2-4b802bd59277",
//     },
//     {
//       name: "Michael Chen",
//       email: "m.chen@example.com",
//       membership: "Elite",
//       status: "Expiring Soon",
//       lastLogin: "1 day ago",
//       avatar: "https://creatie.ai/ai/api/search-image?query=A professional headshot of a middle-aged business man wearing a suit and tie, with a warm and approachable expression, against a neutral background.&width=40&height=40&orientation=squarish&flag=4a99c940-339a-41d0-9cd0-b2f5d93f4e95&flag=6c6f8718-fb29-4aac-9a70-d1f1ed42ce66&flag=916bd8bd-c4aa-4eba-8950-65df34e0dbfc&flag=2313b6c7-1d07-424d-9759-bba349b00bc3",
//     },
//   ];


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