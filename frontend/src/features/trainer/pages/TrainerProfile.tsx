// src/components/TrainerProfile.tsx
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../lib/redux/store";

interface Trainer {
  name: string;
  email: string;
  bio: string;
  experience: string;
  activeClients: number;
  workoutPlans: number;
  rating: number;
  role: string;
}

const TrainerProfile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [selectedRole, setSelectedRole] = useState(user?.role || "Expert Trainer");

  const trainerData: Trainer = {
    name: user?.name || "Sarah Johnson",
    email: user?.email || "",
    bio: "Passionate fitness trainer with 8+ years of experience specializing in strength training and functional fitness. Certified in multiple disciplines with a proven track record of helping clients achieve their fitness goals.",
    experience: "8 years",
    activeClients: 42,
    workoutPlans: 15,
    rating: 4.9,
    role: selectedRole,
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="relative rounded-lg bg-white shadow overflow-hidden mb-8">
          <div className="h-48 w-full bg-gradient-to-r from-indigo-600 to-green-400"></div>
          <div className="relative -mt-24 px-6 pb-6">
            <div className="flex items-end space-x-5">
              <div className="relative">
                <img
                  className="h-40 w-40 rounded-full border-4 border-white bg-white object-cover"
                  src="https://creatie.ai/ai/api/search-image?query=A professional fitness trainer portrait photo with a friendly smile, wearing athletic attire, shot against a neutral studio background. The lighting is soft and flattering, creating a welcoming and approachable appearance&width=400&height=400&orientation=squarish&flag=4664860f-3344-4644-99d8-0ce908ba08e3"
                  alt="Profile"
                />
                <button className="absolute bottom-2 right-2 rounded-full bg-white shadow-sm p-2 text-gray-600 hover:text-indigo-600">
                  <i className="fas fa-camera"></i>
                </button>
              </div>
              <div className="flex-1 min-w-0 mb-6">
                <div className="flex items-center space-x-3">
                  <h2 className="text-2xl font-bold text-gray-900">{trainerData.name}</h2>
                  <button className="text-gray-400 hover:text-indigo-600">
                    <i className="fas fa-pen"></i>
                  </button>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <i className="fas fa-check-circle mr-1"></i>
                    Verified
                  </span>
                </div>
                <select
                  className="mt-2 rounded-md border-gray-300 text-sm"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <option>Expert Trainer</option>
                  <option>Senior Trainer</option>
                  <option>Junior Trainer</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Active Clients</div>
            <div className="mt-2 text-2xl font-semibold text-gray-900">{trainerData.activeClients}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Workout Plans</div>
            <div className="mt-2 text-2xl font-semibold text-gray-900">{trainerData.workoutPlans}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Average Rating</div>
            <div className="mt-2 flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">{trainerData.rating}</div>
              <div className="ml-2 text-indigo-600">
                <i className="fas fa-star"></i>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Experience</div>
            <div className="mt-2 text-2xl font-semibold text-gray-900">{trainerData.experience}</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Bio */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Bio</h3>
                <textarea
                  rows={4}
                  className="mt-4 block w-full rounded-md border-gray-300"
                  placeholder="Write your bio here..."
                  defaultValue={trainerData.bio}
                />
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Certifications</h3>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border rounded-md p-4 relative group">
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-gray-400 hover:text-indigo-600 mr-2">
                        <i className="fas fa-pen"></i>
                      </button>
                      <button className="text-gray-400 hover:text-red-500">
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                    <h4 className="font-medium">NASM Certified Personal Trainer</h4>
                    <p className="text-sm text-gray-500 mt-1">National Academy of Sports Medicine</p>
                    <p className="text-sm text-gray-500 mt-1">Earned: Jan 2020</p>
                  </div>
                  <button className="border border-dashed rounded-md p-4 text-center text-gray-500 hover:text-indigo-600 hover:border-indigo-600">
                    <i className="fas fa-plus"></i>
                    <span className="ml-2">Add Certification</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Active Clients */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Active Clients</h3>
                <div className="mt-4 divide-y">
                  <div className="py-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        className="h-10 w-10 rounded-full"
                        src="https://creatie.ai/ai/api/search-image?query=A professional headshot of a fitness enthusiast in workout attire, showing a determined and motivated expression, captured against a clean studio background with soft lighting&width=100&height=100&orientation=squarish&flag=7051d085-9f1d-4c74-aa12-334e0819586a"
                        alt="Client"
                      />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">Alex Thompson</p>
                        <p className="text-sm text-gray-500">Member since Oct 2023</p>
                      </div>
                    </div>
                    <button className="rounded-md bg-gray-100 px-3 py-1 text-sm text-gray-700">
                      View Plan
                    </button>
                  </div>
                  {/* Add more clients as needed */}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Specialties */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Specialties</h3>
                <div className="mt-4 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {["Strength Training", "HIIT", "Functional Fitness"].map((specialty) => (
                      <span
                        key={specialty}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                      >
                        {specialty}
                        <button className="ml-1 text-green-600 hover:text-green-800">
                          <i className="fas fa-times"></i>
                        </button>
                      </span>
                    ))}
                  </div>
                  <select className="w-full rounded-md border-gray-300">
                    <option value="">Add specialty...</option>
                    <option>Weight Loss</option>
                    <option>Muscle Gain</option>
                    <option>Yoga</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Availability</h3>
                <div className="mt-4 space-y-4">
                  {["Monday", "Wednesday", "Friday"].map((day) => (
                    <div
                      key={day}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                    >
                      <div>
                        <p className="font-medium">{day}</p>
                        <p className="text-sm text-gray-500">9:00 AM - 5:00 PM</p>
                      </div>
                      <button className="text-gray-400 hover:text-indigo-600">
                        <i className="fas fa-pen"></i>
                      </button>
                    </div>
                  ))}
                  <button className="w-full rounded-md border border-dashed p-3 text-center text-gray-500 hover:text-indigo-600 hover:border-indigo-600">
                    <i className="fas fa-plus"></i>
                    <span className="ml-2">Add Time Slot</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Payment Details</h3>
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Rate</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="text"
                        className="rounded-md block w-full pl-7 pr-12 border-gray-300"
                        placeholder="0.00"
                        defaultValue="75.00"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center">
                        <select className="h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md">
                          <option>USD</option>
                          <option>EUR</option>
                          <option>GBP</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                    <select className="mt-1 block w-full rounded-md border-gray-300">
                      <option>Direct Deposit</option>
                      <option>PayPal</option>
                      <option>Stripe</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <div className="fixed bottom-0 inset-x-0 bg-white border-t">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">Last saved 2 minutes ago</div>
          <div className="flex space-x-4">
            <button className="rounded-md px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerProfile;