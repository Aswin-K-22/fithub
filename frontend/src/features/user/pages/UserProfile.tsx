// frontend/src/features/user/pages/UserProfile.tsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../../lib/redux/store";
import * as echarts from "echarts";
import Navbar from "../../../components/Navbar";
import { getUserProfile } from "../../../lib/api/authApi";
import { UserProfileData } from "../../../entities/User";


const UserProfile: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getUserProfile(); // response is { user: UserProfileData }
        setProfileData(response.user); // Extract the user object
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        // Fallback to default flat data (no 'user' wrapper)
        setProfileData({
          id: user?.id || "default-id",
          email: user?.email || "user@example.com",
          name: user?.name || "Sarah Johnson",
          role: user?.role || "user",
          createdAt: new Date().toISOString(),
          fitnessProfile: {},
          progress: [],
          weeklySummary: [],
          profilePic: undefined, // Optional
          workoutPlanId: undefined, // Optional
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  useEffect(() => {
    if (!profileData) return;
    const chart = echarts.init(document.getElementById("weeklyChart") as HTMLDivElement);
    const weeklyCalories = profileData.weeklySummary.length
      ? profileData.weeklySummary.map((summary) => summary.totalCaloriesBurned || 0).slice(-7)
      : [320, 450, 380, 420, 350, 300, 230];
    const option = {
      animation: false,
      tooltip: { trigger: "axis" },
      xAxis: { type: "category", data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
      yAxis: { type: "value", name: "Calories" },
      series: [
        {
          data: weeklyCalories,
          type: "line",
          smooth: true,
          lineStyle: { color: "#4F46E5" },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(79, 70, 229, 0.3)" },
              { offset: 1, color: "rgba(79, 70, 229, 0.1)" },
            ]),
          },
        },
      ],
    };
    chart.setOption(option);
    window.addEventListener("resize", () => chart.resize());
    return () => {
      chart.dispose();
      window.removeEventListener("resize", () => chart.resize());
    };
  }, [profileData]);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  const defaultProfilePic = "/images/user.jpg";

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Profile Header */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 relative">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100">
                    <img
                      src={profileData?.profilePic || defaultProfilePic}
                      alt="Profile picture"
                      className="h-full w-full object-cover"
                      onError={(e) => (e.currentTarget.src = defaultProfilePic)}
                    />
                  </div>
                  <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full shadow-lg">
                    <i className="fas fa-camera text-sm"></i>
                  </button>
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h1 className="text-2xl font-bold text-gray-900 mr-3">{profileData?.name || "Unknown User"}</h1>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                      <i className="fas fa-check-circle mr-1"></i>Verified
                    </span>
                  </div>
                  <p className="text-gray-500">
                    Member since{" "}
                    {new Date(profileData?.createdAt || Date.now()).toLocaleString("default", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <button className="rounded-md bg-gray-100 hover:bg-gray-200 px-4 py-2 text-gray-700">
                  <i className="fas fa-pen mr-2"></i>Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-8">
            {/* Fitness Profile */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Fitness Profile</h2>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Goals</label>
                    <select
                      multiple
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={profileData?.fitnessProfile.goals || ["Weight Loss", "Muscle Gain"]}
                    >
                      {["Weight Loss", "Muscle Gain", "Endurance", "Flexibility"].map((goal) => (
                        <option key={goal} value={goal}>
                          {goal}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fitness Level</label>
                    <select
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={profileData?.fitnessProfile.level || "Intermediate"}
                    >
                      {["Beginner", "Intermediate", "Advanced"].map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                    <input
                      type="number"
                      value={profileData?.fitnessProfile.weight || 65}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                    <input
                      type="number"
                      value={profileData?.fitnessProfile.height || 170}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Daily Calorie Goal</label>
                    <input
                      type="number"
                      value={profileData?.fitnessProfile.calorieGoal || 2000}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      readOnly
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  Last updated:{" "}
                  {profileData?.fitnessProfile.updatedAt
                    ? new Date(profileData.fitnessProfile.updatedAt).toLocaleDateString()
                    : "Not set"}
                </p>
              </div>
            </div>

            {/* Recent Progress */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Progress</h2>
                  <button className="rounded-md bg-blue-500 px-4 py-2 text-white text-sm font-medium">
                    <i className="fas fa-plus mr-2"></i>Add Progress
                  </button>
                </div>
                <div className="space-y-4">
                  {profileData?.progress.length ? (
                    profileData.progress.slice(0, 1).map((entry, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {new Date(entry.workoutDate).toLocaleDateString()}
                            </h3>
                            <p className="text-sm text-gray-500">Workout</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">{entry.totalCaloriesBurned || 0} kcal</p>
                            <div className="flex items-center">
                              <i className="fas fa-fire text-orange-500 mr-1"></i>
                              <span className="text-sm text-gray-500">{entry.dailyDifficulty || "Medium"}</span>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          {entry.exercisesCompleted.map((exercise) => (
                            <div key={exercise.exerciseId} className="bg-gray-50 p-3 rounded">
                              <p className="font-medium">{exercise.name}</p>
                              <p className="text-gray-500">
                                {exercise.sets && exercise.reps
                                  ? `${exercise.sets} x ${exercise.reps} reps @ ${exercise.weight || 0}kg`
                                  : "Not specified"}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="border rounded-lg p-4">
                      <p className="text-gray-500">No progress recorded yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Weekly Summary */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Weekly Summary</h2>
                <div id="weeklyChart" className="h-64"></div>
                <div className="mt-6 space-y-4">
                  {profileData?.weeklySummary.length ? (
                    profileData.weeklySummary.slice(0, 2).map((summary, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="text-sm text-gray-500">
                            {new Date(summary.weekStart).toLocaleDateString()} -{" "}
                            {new Date(summary.weekEnd).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Total Calories</p>
                          <p className="font-medium">{summary.totalCaloriesBurned || 0} kcal</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-500">No data</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Total Calories</p>
                        <p className="font-medium">0 kcal</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Current Workout Plan */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Current Workout Plan</h2>
                <div className="text-center p-6 border rounded-lg">
                  <h3 className="font-medium text-lg mb-2">
                    {profileData?.workoutPlanId ? "Custom Plan" : "No Plan Assigned"}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {profileData?.workoutPlanId
                      ? "Focus on your goals"
                      : "Assign a plan to get started"}
                  </p>
                  <button className="rounded-md w-full bg-blue-500 text-white py-2 px-4">
                    View Full Plan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <div className="fixed bottom-0 inset-x-0 bg-white border-t shadow-lg">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">Last saved 2 minutes ago</p>
            <div className="space-x-4">
              <button onClick={()=>{navigate('/')}} className="rounded-md bg-gray-100 hover:bg-gray-200 px-4 py-2 text-gray-700">
                Cancel
              </button>
              <button className="rounded-md bg-blue-500 px-4 py-2 text-white">Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;