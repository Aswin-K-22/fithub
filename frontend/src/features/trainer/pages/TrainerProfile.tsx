/* eslint-disable @typescript-eslint/no-explicit-any */
// frontend/src/features/trainer/pages/TrainerProfile.tsx
import React, { useState, useEffect, ChangeEvent } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../lib/redux/store";
import Navbar from "../../trainer/components/Navbar";
import { getTrainerProfile, updateTrainerProfile } from "../../../lib/api/authApi";
import { TrainerProfileData } from "../../../entities/Trainer";
import { toast } from "react-toastify";
import { login } from "../../../lib/redux/slices/authSlice";


const backendUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
// const defaultProfilePic = "/images/user.jpg";


const TrainerProfile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [profileData, setProfileData] = useState<TrainerProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    name: "",
    bio: "",
    specialties: [] as string[],
    profilePic: null as File | null,
    upiId: "",
    bankAccount: "",
    ifscCode: "",
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getTrainerProfile();
        setProfileData(response.trainer);
        setEditedData({
          name: response.trainer.name || "",
          bio: response.trainer.bio || "",
          specialties: response.trainer.specialties || [],
          profilePic: null,
          upiId: response.trainer.paymentDetails?.upiId || "",
          bankAccount: response.trainer.paymentDetails?.bankAccount || "",
          ifscCode: response.trainer.paymentDetails?.ifscCode || "",
        });
      } catch (error) {
        console.error("Failed to fetch trainer profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditedData((prev) => ({ ...prev, profilePic: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSpecialtyChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value && !editedData.specialties.includes(value)) {
      setEditedData((prev) => ({
        ...prev,
        specialties: [...prev.specialties, value],
      }));
    }
  };

  const removeSpecialty = (specialty: string) => {
    setEditedData((prev) => ({
      ...prev,
      specialties: prev.specialties.filter((s) => s !== specialty),
    }));
  };

  const handleSave = async () => {
    try {
      const updateData: any = {};
      if (editedData.name !== profileData?.name) updateData.name = editedData.name;
      if (editedData.bio !== profileData?.bio) updateData.bio = editedData.bio;
      if (JSON.stringify(editedData.specialties) !== JSON.stringify(profileData?.specialties))
        updateData.specialties = editedData.specialties;
      if (editedData.profilePic) updateData.profilePic = editedData.profilePic;
      if (editedData.upiId !== profileData?.paymentDetails?.upiId) updateData.upiId = editedData.upiId;
      if (editedData.bankAccount !== profileData?.paymentDetails?.bankAccount)
        updateData.bankAccount = editedData.bankAccount;
      if (editedData.ifscCode !== profileData?.paymentDetails?.ifscCode)
        updateData.ifscCode = editedData.ifscCode;

      if (Object.keys(updateData).length > 0) {
        const response = await updateTrainerProfile(updateData);
        setProfileData(response.trainer);
        dispatch(login({ ...user!, name: response.trainer.name }));
        toast.success("Profile updated successfully");
      }
      setIsEditing(false);
      setPreviewUrl(null);
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!profileData) return <div className="text-center py-10">Profile not found</div>;


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
                  src={previewUrl || (profileData.profilePic ? `${backendUrl}${profileData.profilePic}` : "/images/user.jpg")}
                  alt="Profile"
                  onError={(e) => (e.currentTarget.src = "/images/user.jpg")}
                />
                {isEditing && (
                  <label className="absolute bottom-2 right-2 rounded-full bg-indigo-600 text-white p-2 shadow-md hover:bg-indigo-700 cursor-pointer">
                    <i className="fas fa-camera text-sm"></i>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </label>
                )}
              </div>
              <div className="flex-1 min-w-0 mb-6">
                {isEditing ? (
                  <input
                    type="text"
                    value={editedData.name}
                    onChange={(e) => setEditedData((prev) => ({ ...prev, name: e.target.value }))}
                    className="text-2xl font-bold text-gray-900 mb-2 border rounded px-2 py-1"
                  />
                ) : (
                  <div className="flex items-center space-x-3">
                    <h2 className="text-2xl font-bold text-gray-900">{profileData.name || "N/A"}</h2>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <i className="fas fa-check-circle mr-1"></i>Verified
                    </span>
                  </div>
                )}
                <p className="text-gray-500">{profileData.experienceLevel || "N/A"}</p>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="rounded-md bg-gray-100 hover:bg-gray-200 px-4 py-2 text-gray-700"
              >
                <i className="fas fa-pen mr-2"></i>{isEditing ? "Cancel" : "Edit Profile"}
              </button>
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
                {isEditing ? (
                  <textarea
                    rows={4}
                    value={editedData.bio}
                    onChange={(e) => setEditedData((prev) => ({ ...prev, bio: e.target.value }))}
                    className="mt-4 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Write your bio here..."
                  />
                ) : (
                  <p className="mt-4 text-gray-900">{profileData.bio || "N/A"}</p>
                )}
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
                    {(isEditing ? editedData.specialties : profileData.specialties || []).map((specialty) => (
                      <span
                        key={specialty}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                      >
                        {specialty}
                        {isEditing && (
                          <button
                            onClick={() => removeSpecialty(specialty)}
                            className="ml-1 text-green-600 hover:text-green-800"
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        )}
                      </span>
                    ))}
                    {(isEditing ? editedData.specialties : profileData.specialties || []).length === 0 && (
                      <p className="text-gray-500">N/A</p>
                    )}
                  </div>
                  {isEditing && (
                    <select
                      onChange={handleSpecialtyChange}
                      className="w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="">Add specialty...</option>
                      <option value="Strength Training">Strength Training</option>
                      <option value="Cardio">Cardio</option>
                      <option value="Yoga">Yoga</option>
                      <option value="Pilates">Pilates</option>
                      <option value="CrossFit">CrossFit</option>
                    </select>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Payment Details</h3>
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Rate (Admin Set)</label>
                    <p className="mt-1 text-gray-900">
                      {profileData.paymentDetails?.rate
                        ? `${profileData.paymentDetails.rate} ${profileData.paymentDetails.currency || "N/A"}`
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Payment Method (Admin Set)</label>
                    <p className="mt-1 text-gray-900">{profileData.paymentDetails?.method || "N/A"}</p>
                  </div>
                  {isEditing ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">UPI ID</label>
                        <input
                          type="text"
                          value={editedData.upiId}
                          onChange={(e) => setEditedData((prev) => ({ ...prev, upiId: e.target.value }))}
                          className="mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                          placeholder="e.g., trainer@upi"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Bank Account Number</label>
                        <input
                          type="text"
                          value={editedData.bankAccount}
                          onChange={(e) => setEditedData((prev) => ({ ...prev, bankAccount: e.target.value }))}
                          className="mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                          placeholder="e.g., 1234567890"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">IFSC Code</label>
                        <input
                          type="text"
                          value={editedData.ifscCode}
                          onChange={(e) => setEditedData((prev) => ({ ...prev, ifscCode: e.target.value }))}
                          className="mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                          placeholder="e.g., SBIN0001234"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">UPI ID</label>
                        <p className="mt-1 text-gray-900">{profileData.paymentDetails?.upiId || "N/A"}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Bank Account Number</label>
                        <p className="mt-1 text-gray-900">{profileData.paymentDetails?.bankAccount || "N/A"}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">IFSC Code</label>
                        <p className="mt-1 text-gray-900">{profileData.paymentDetails?.ifscCode || "N/A"}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {isEditing && (
        <div className="fixed bottom-0 inset-x-0 bg-white border-t z-50">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="text-sm text-gray-500">Editing profile</div>
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setPreviewUrl(null);
                  setEditedData({
                    name: profileData.name || "",
                    bio: profileData.bio || "",
                    specialties: profileData.specialties || [],
                    profilePic: null,
                    upiId: profileData.paymentDetails?.upiId || "",
                    bankAccount: profileData.paymentDetails?.bankAccount || "",
                    ifscCode: profileData.paymentDetails?.ifscCode || "",
                  });
                }}
                className="rounded-md px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerProfile;