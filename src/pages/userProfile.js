import { useEffect, useState } from "react";
import Header from "../components/Header";

export default function userProfile() {
  const [user, setUser] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch("/api/getUserProfileInfo");
      const data = await res.json();
      setUser(data);
    }
    fetchUser();
  }, []);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = () => {
    // Implement the API call to update the user's data
    console.log("Save changes:", user);
    setEditMode(false);
    updateUser();
  };

  async function updateUser() {
    const res = await fetch("/api/updateUserProfileInfo", {
      method: "PUT",
      // headers: {
      //   "Content-Type": "application/json",
      // },
      body: JSON.stringify(user),
    });
    // const data = await res.json();
    // setUser(data);
  }

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const defaultAvatar = "https://ui-avatars.com/api/?name=" + (user.name || "User") + "&background=0D8ABC&color=fff";

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Header />
      <div className="max-w-5xl mx-auto mt-16 px-4 sm:px-6 lg:px-8">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="relative h-48 bg-gradient-to-r from-blue-600 to-blue-700">
            <div className="absolute bottom-0 left-0 right-0 px-8 pb-8">
              <div className="flex items-end">
                <div className="relative h-24 w-24 rounded-full border-4 border-white bg-gray-200 overflow-hidden">
                  <img
                    src={imageError ? defaultAvatar : (user.avatar || defaultAvatar)}
                    alt={user.name || "Profile"}
                    className="h-full w-full object-cover transition-opacity duration-300"
                    onError={handleImageError}
                  />
                </div>
                <div className="ml-6 pb-2">
                  <h1 className="text-3xl font-bold text-white">{user.name || "Your Profile"}</h1>
                  <p className="text-blue-100 mt-1">{user.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="px-8 py-6">
            {editMode ? (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={user.name || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={user.email || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                      disabled
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">Phone Number</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={user.phoneNumber || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <button
                    onClick={() => setEditMode(false)}
                    className="px-6 py-2.5 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 transition-colors font-medium"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-100">
                    <p className="text-sm font-medium text-gray-500">Full Name</p>
                    <p className="mt-2 text-xl font-semibold text-gray-900">{user.name || "Not set"}</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-100">
                    <p className="text-sm font-medium text-gray-500">Email Address</p>
                    <p className="mt-2 text-xl font-semibold text-gray-900">{user.email || "Not set"}</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-100">
                    <p className="text-sm font-medium text-gray-500">Phone Number</p>
                    <p className="mt-2 text-xl font-semibold text-gray-900">{user.phoneNumber || "Not set"}</p>
                  </div>
                </div>
                
                <div className="flex justify-end pt-6 border-t">
                  <button
                    onClick={handleEdit}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 transition-colors font-medium inline-flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
