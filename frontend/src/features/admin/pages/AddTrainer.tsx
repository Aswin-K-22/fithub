import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { addTrainer } from "../../../lib/api/authApi";
import Select from "react-select";

const AddTrainer: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    specialties: [] as string[],
    experienceLevel: "",
    bio: "",
    phone: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    specialties: "",
    experienceLevel: "",
    bio: "",
    phone: "",
  });

  // Validation function
  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: "",
      email: "",
      password: "",
      specialties: "",
      experienceLevel: "",
      bio: "",
      phone: "",
    };

    if (!formData.name) {
      newErrors.name = "Full name is required";
      valid = false;
    }
    if (!formData.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      valid = false;
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }
    if (formData.specialties.length === 0) {
      newErrors.specialties = "At least one specialty is required";
      valid = false;
    }
    if (!formData.experienceLevel) {
      newErrors.experienceLevel = "Experience level is required";
      valid = false;
    }
    if (formData.phone && !/^\+?[1-9]\d{1,14}$/.test(formData.phone)) {
      newErrors.phone = "Phone number is invalid";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Backend API submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix form errors", { position: "top-right" });
      return;
    }

    try {
      const { name, email, password, specialties, experienceLevel, bio, phone } = formData;
      await addTrainer({
        name,
        email,
        password,
        specialties, // Already an array, passed as-is
        experienceLevel,
        bio,
        phone,
      });
      toast.success("Trainer added successfully!", { position: "top-right" });
      navigate("/admin/trainers");
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      toast.error(axiosError.response?.data?.message || "Failed to add trainer", {
        position: "top-right",
      });
      console.error("Add trainer failed:", axiosError);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (e.target instanceof HTMLSelectElement && e.target.multiple) {
      const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
      setFormData((prev) => ({ ...prev, specialties: selectedOptions }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleClear = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      specialties: [],
      experienceLevel: "",
      bio: "",
      phone: "",
    });
    setErrors({
      name: "",
      email: "",
      password: "",
      specialties: "",
      experienceLevel: "",
      bio: "",
      phone: "",
    });
  };


  const specialtyOptions = [
    { value: "strength", label: "Strength Training" },
    { value: "cardio", label: "Cardio" },
    { value: "yoga", label: "Yoga" },
    { value: "pilates", label: "Pilates" },
    { value: "crossfit", label: "CrossFit" },
    { value: "boxing", label: "Boxing" },
  ];
  const inputStyle = "block w-full pl-10 h-9 border border-gray-300 shadow-sm focus:ring-custom focus:border-custom sm:text-sm rounded-md";

  return (
    <main className="max-w-8xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 sm:px-0">
        <div className="mb-8">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Add New Trainer
          </h2>
          <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <a href="/admin/dashboard" className="hover:text-custom">Dashboard</a>
              <span className="mx-2">/</span>
              <a href="/admin/trainers" className="hover:text-custom">Trainers</a>
              <span className="mx-2">/</span>
              <span className="text-gray-700">Add New</span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white shadow-lg rounded-lg">
        <form className="px-8 py-6 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <i className="fas fa-user"></i>
              </span>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g., Sarah Johnson"
                className={inputStyle}
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <i className="fas fa-envelope"></i>
              </span>
              <input
                type="email"
                name="email"
                required
                placeholder="e.g., sarah.j@fithub.com"
                className={inputStyle}
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <i className="fas fa-lock"></i>
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="Enter temporary password"
                className={`${inputStyle} pr-10`}
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Specialties <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <i className="fas fa-dumbbell"></i>
              </span>
              <Select
                isMulti
                name="specialties"
                options={specialtyOptions}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={(selected) => setFormData((prev) => ({
                  ...prev,
                  specialties: selected ? selected.map((opt) => opt.value) : [],
                }))}
                value={specialtyOptions.filter((opt) => formData.specialties.includes(opt.value))}
              />
              <div className="mt-2">
                {formData.specialties.length > 0 && (
                  <p className="text-sm text-gray-600">
                    Selected: {formData.specialties.join(", ")}
                  </p>
                )}
              </div>

              {errors.specialties && <p className="text-red-500 text-sm mt-1">{errors.specialties}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Experience Level <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <i className="fas fa-star"></i>
              </span>
              <select
                name="experienceLevel"
                required
                className={inputStyle}
                value={formData.experienceLevel}
                onChange={handleChange}
              >
                <option value="">Select experience level</option>
                <option value="junior">Junior</option>
                <option value="senior">Senior</option>
                <option value="expert">Expert</option>
              </select>
              {errors.experienceLevel && <p className="text-red-500 text-sm mt-1">{errors.experienceLevel}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <div className="relative">
              <span className="absolute top-3 left-3 text-gray-400">
                <i className="fas fa-pen"></i>
              </span>
              <textarea
                rows={4}
                name="bio"
                placeholder="e.g., Certified yoga instructor..."
                className="block w-full pl-10 border border-gray-300 shadow-sm focus:ring-custom focus:border-custom sm:text-sm rounded-md"
                value={formData.bio}
                onChange={handleChange}
              />
              {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <i className="fas fa-phone"></i>
              </span>
              <input
                type="tel"
                name="phone"
                placeholder="e.g., +91 9876543210"
                className={inputStyle}
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              className="rounded-md px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom"
              onClick={handleClear}
            >
              Clear Form
            </button>
            <button
              type="button"
              className="rounded-md px-4 py-2 border border-transparent text-sm font-medium text-custom bg-white border-custom hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom"
              onClick={() => navigate("/admin/trainers")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md px-4 py-2 border border-transparent text-sm font-medium text-white bg-custom hover:bg-custom-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom"
            >
              Save Trainer
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default AddTrainer;