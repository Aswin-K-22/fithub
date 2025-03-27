// frontend/src/features/trainer/pages/TrainerProfile.tsx
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../lib/redux/store";
import Navbar from "../../trainer/components/Navbar";
import { getTrainerProfile } from "../../../lib/api/authApi";
import { TrainerProfileData } from "../../../entities/Trainer";



const TrainerProfile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [profileData, setProfileData] = useState<TrainerProfileData | null>(null);
  const [selectedRole, setSelectedRole] = useState(user?.role || "Expert Trainer");
  const [loading, setLoading] = useState(true);

  const defaultProfilePic = "/images/user.jpg";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getTrainerProfile();
        setProfileData(response.trainer);
        setSelectedRole(response.trainer.experienceLevel || "Expert Trainer");
      } catch (error) {
        console.error("Failed to fetch trainer profile:", error);
        setProfileData({
          id: user?.id || "default-id",
          name: user?.name || "Sarah Johnson",
          email: user?.email || "sarah@example.com",
          role: user?.role || "trainer",
          profilePic: defaultProfilePic,
          bio: "Passionate fitness trainer with 8+ years of experience specializing in strength training and functional fitness.",
          specialties: ["Strength Training", "HIIT", "Functional Fitness"],
          experienceLevel: "expert",
          certifications: [
            { name: "NASM Certified Personal Trainer", issuer: "National Academy of Sports Medicine", dateEarned: "2020-01-01", certificateId: "12345" },
          ],
          clients: [
            { userId: "client1", startDate: new Date().toISOString(), active: true },
          ],
          paymentDetails: { method: "hourly", rate: 75.0, currency: "USD", paymentHistory: [] },
          availability: [
            { day: "Monday", startTime: "09:00", endTime: "17:00" },
            { day: "Wednesday", startTime: "09:00", endTime: "17:00" },
            { day: "Friday", startTime: "09:00", endTime: "17:00" },
          ],
          gyms: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 pb-20">
        {/* Profile Header */}
        <div className="relative rounded-lg bg-white shadow overflow-hidden mb-8">
          <div className="h-48 w-full bg-gradient-to-r from-indigo-600 to-green-400"></div>
          <div className="relative -mt-24 px-6 pb-6">
            <div className="flex items-end space-x-5">
              <div className="relative">
                <img
                  className="h-40 w-40 rounded-full border-4 border-white bg-white object-cover"
                  src={profileData?.profilePic || defaultProfilePic}
                  alt="Profile"
                  onError={(e) => (e.currentTarget.src = defaultProfilePic)}
                />
                <button
                  className="absolute bottom-2 right-2 rounded-full bg-indigo-600 text-white p-2 shadow-md hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  title="Change Profile Picture"
                >
                  <i className="fas fa-camera text-sm"></i>
                </button>
              </div>
              <div className="flex-1 min-w-0 mb-6">
                <div className="flex items-center space-x-3">
                  <h2 className="text-2xl font-bold text-gray-900">{profileData?.name || "Unknown Trainer"}</h2>
                  <button className="text-gray-400 hover:text-indigo-600">
                    <i className="fas fa-pen"></i>
                  </button>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <i className="fas fa-check-circle mr-1"></i>
                    Verified
                  </span>
                </div>
                <select
                  className="mt-2 rounded-md border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <option value="junior">Junior Trainer</option>
                  <option value="senior">Senior Trainer</option>
                  <option value="expert">Expert Trainer</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Active Clients</div>
            <div className="mt-2 text-2xl font-semibold text-gray-900">
              {(profileData?.clients || []).filter((c) => c.active).length || 0}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Certifications</div>
            <div className="mt-2 text-2xl font-semibold text-gray-900">
              {(profileData?.certifications || []).length || 0}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Experience Level</div>
            <div className="mt-2 text-2xl font-semibold text-gray-900 capitalize">
              {profileData?.experienceLevel || "N/A"}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Gyms</div>
            <div className="mt-2 text-2xl font-semibold text-gray-900">
              {(profileData?.gyms || []).length || 0}
            </div>
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
                  className="mt-4 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Write your bio here..."
                  defaultValue={profileData?.bio || ""}
                />
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Certifications</h3>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(profileData?.certifications || []).map((cert) => (
                    <div key={cert.certificateId} className="border rounded-md p-4 relative group">
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-gray-400 hover:text-indigo-600 mr-2">
                          <i className="fas fa-pen"></i>
                        </button>
                        <button className="text-gray-400 hover:text-red-500">
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                      <h4 className="font-medium">{cert.name}</h4>
                      <p className="text-sm text-gray-500 mt-1">{cert.issuer}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Earned: {new Date(cert.dateEarned).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
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
                  {(profileData?.clients || []).filter((c) => c.active).slice(0, 1).map((client) => (
                    <div key={client.userId} className="py-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <img
                          className="h-10 w-10 rounded-full"
                          src="https://creatie.ai/ai/api/search-image?query=A professional headshot of a fitness enthusiast in workout attire, showing a determined and motivated expression, captured against a clean studio background with soft lighting&width=100&height=100&orientation=squarish&flag=7051d085-9f1d-4c74-aa12-334e0819586a"
                          alt="Client"
                        />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">Client ID: {client.userId.slice(0, 8)}</p>
                          <p className="text-sm text-gray-500">
                            Since: {new Date(client.startDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <button className="rounded-md bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200">
                        View Plan
                      </button>
                    </div>
                  ))}
                  {(profileData?.clients || []).filter((c) => c.active).length === 0 && (
                    <div className="py-4 text-gray-500">No active clients yet.</div>
                  )}
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
                    {(profileData?.specialties || []).map((specialty) => (
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
                  <select className="w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                    <option value="">Add specialty...</option>
                    <option>Strength</option>
                    <option>Cardio</option>
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
                  {(profileData?.availability || []).map((slot, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                    >
                      <div>
                        <p className="font-medium">{slot.day}</p>
                        <p className="text-sm text-gray-500">{`${slot.startTime} - ${slot.endTime}`}</p>
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
                        className="rounded-md block w-full pl-7 pr-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="0.00"
                        defaultValue={profileData?.paymentDetails?.rate || "0.00"}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center">
                        <select className="h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md">
                          <option>{profileData?.paymentDetails?.currency || "USD"}</option>
                          <option>INR</option>
                          <option>EUR</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                    <select className="mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                      <option>{profileData?.paymentDetails?.method || "N/A"}</option>
                      <option>per_client</option>
                      <option>monthly_fixed</option>
                      <option>hourly</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 inset-x-0 bg-white border-t z-50">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">Last saved 2 minutes ago</div>
          <div className="flex space-x-4">
            <button className="rounded-md px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerProfile;