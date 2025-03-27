// src/features/admin/pages/AdminDashboard.tsx (Updated)
import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../lib/redux/store";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { logout as logoutAction } from "../../../lib/redux/slices/authSlice";
import { logout as logoutApi } from "../../../lib/api/authApi";
import { toast } from "react-toastify";

const AdminDashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      if (user?.email) {
        await logoutApi(user.email);
        dispatch(logoutAction());
        toast.success("Logged out successfully!", { position: "top-right" });
        navigate("/admin/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed—try again!", { position: "top-right" });
    }
    setIsOpen(false);
  };

  return (
    <div className="min-h-screen flex bg-gray-50 font-[Inter]">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header user={user} isOpen={isOpen} setIsOpen={setIsOpen} handleLogout={handleLogout} />
        <Outlet /> 
      </div>
    </div>
  );
};

export default AdminDashboard;