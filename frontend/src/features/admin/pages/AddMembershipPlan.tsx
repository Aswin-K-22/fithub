// src/features/admin/pages/AddMembershipPlan.tsx
import React, { useState, FormEvent } from "react";
import {  addMembershipPlan } from "../../../lib/api/authApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface MembershipPlanForm {
  planName: "Premium" | "Basic" | "Diamond";
  description: string;
  price: string;
  duration: string;
  features: string[];
}

const AddMembershipPlan: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<MembershipPlanForm>({
    planName: "Basic",
    description: "",
    price: "",
    duration: "",
    features: [],
  });
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);



  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      features: checked
        ? [...prev.features, value]
        : prev.features.filter((feature) => feature !== value),
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setShowConfirmModal(true); // Show modal instead of confirm
  };

  const confirmSubmit = async () => {
    setShowConfirmModal(false);
    setLoading(true);
    try {
      await addMembershipPlan(
        formData.planName,
        formData.description,
        formData.price,
        formData.duration,
        formData.features
      );
      toast.success("Membership plan created successfully!", { position: "top-right" });
      navigate("/admin/subscriptions");
    } catch (error) {
      console.error("Error creating membership plan:", error);
      toast.error("Failed to create membership plan");
    } finally {
      setLoading(false);
    }
  };

  const featureOptions = [
    { value: "24/7-access", label: "24/7 Access" },
    { value: "personal-trainer", label: "Personal Trainer" },
    { value: "group-classes", label: "Group Classes" },
    { value: "spa-access", label: "Spa Access" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-[Inter]">
      <div className="flex-grow py-6">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <i className="fas fa-home"></i>
                </a>
              </li>
              <li>
                <div className="flex items-center">
                  <i className="fas fa-chevron-right text-gray-400 text-sm"></i>
                  <a
                    href="#"
                    className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                    onClick={() => navigate("/admin/subscriptions")}
                  >
                    Membership Plans
                  </a>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <i className="fas fa-chevron-right text-gray-400 text-sm"></i>
                  <span className="ml-4 text-sm font-medium text-gray-500">Add New Plan</span>
                </div>
              </li>
            </ol>
          </nav>

          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-2">
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                    Add New Membership Plan
                  </h3>
                  <form id="planForm" onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Plan Name</label>
                      <select
                        name="planName"
                        value={formData.planName}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md focus:ring-indigo-600 focus:border-indigo-600"
                        required
                      >
                        <option value="Basic">Basic</option>
                        <option value="Premium">Premium</option>
                        <option value="Diamond">Diamond</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        name="description"
                        rows={3}
                        value={formData.description}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md focus:ring-indigo-600 focus:border-indigo-600"
                        placeholder="Describe the benefits of this plan"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Price</label>
                      <div className="mt-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          className="mt-1 block w-full pl-7 border border-gray-300 rounded-md focus:ring-indigo-600 focus:border-indigo-600"
                          placeholder="0.00"
                          required
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Duration (Months)</label>
                      <select
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md focus:ring-indigo-600 focus:border-indigo-600"
                        required
                      >
                        <option value="">Select duration</option>
                        <option value="1">1 Month</option>
                        <option value="3">3 Months</option>
                        <option value="6">6 Months</option>
                        <option value="12">12 Months</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Features</label>
                      <div className="mt-2 space-y-2">
                        {featureOptions.map((feature) => (
                          <div key={feature.value} className="flex items-start">
                            <input
                              type="checkbox"
                              name="features"
                              value={feature.value}
                              checked={formData.features.includes(feature.value)}
                              onChange={handleCheckboxChange}
                              className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-600 rounded"
                            />
                            <label className="ml-3 text-sm text-gray-700">{feature.label}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="mt-5 md:mt-0">
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Preview</h3>
                  <div className="border rounded-lg p-4">
                    <h4 className="text-xl font-semibold text-gray-900">
                      {formData.planName || "Basic"}
                    </h4>
                    <p className="mt-2 text-3xl font-bold text-indigo-600">
                      ${parseFloat(formData.price || "0").toFixed(2)}
                      <span className="text-base font-normal text-gray-500">/month</span>
                    </p>
                    <p className="mt-4 text-gray-500">
                      {formData.description || "Access to premium facilities and services"}
                    </p>
                    <ul className="mt-6 space-y-4">
                      {formData.features.length > 0 ? (
                        formData.features.map((feature) => (
                          <li key={feature} className="flex items-start">
                            <i className="fas fa-check text-green-500 mt-1"></i>
                            <span className="ml-3 text-gray-700">
                              {feature
                                .split("-")
                                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                .join(" ")}
                            </span>
                          </li>
                        ))
                      ) : (
                        <li className="flex items-start">
                          <i className="fas fa-check text-green-500 mt-1"></i>
                          <span className="ml-3 text-gray-700">No features selected</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/admin/subscriptions")}
              className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="planForm"
              disabled={loading}
              className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 disabled:bg-gray-400"
            >
              {loading ? "Saving..." : "Save Plan"}
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Plan Creation</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to create the <span className="font-semibold">{formData.planName}</span> plan?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmSubmit}
                disabled={loading}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400"
              >
                {loading ? "Saving..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddMembershipPlan;