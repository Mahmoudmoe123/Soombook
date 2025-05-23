import { useEffect, useState } from "react";
import Header from "../components/Header";

export default function userProfile() {
  const [user, setUser] = useState({});
  const [editMode, setEditMode] = useState(false);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl mb-8 font-bold text-gray-800 text-center">
          User Profile
        </h1>
        {editMode ? (
          <div className="space-y-6">
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Name:</label>
              <input
                type="text"
                name="name"
                value={user.name || ""}
                onChange={handleChange}
                className="border border-gray-300 mt-1 px-4 py-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Email:</label>
              <input
                type="email"
                name="email"
                value={user.email || ""}
                onChange={handleChange}
                className="border border-gray-300 mt-1 px-4 py-3 w-full rounded-md bg-gray-50 cursor-not-allowed"
                disabled
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Phone:</label>
              <input
                type="text"
                name="phoneNumber"
                value={user.phoneNumber || ""}
                onChange={handleChange}
                className="border border-gray-300 mt-1 px-4 py-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <button
              onClick={handleSave}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 transition-colors"
            >
              Save Changes
            </button>
          </div>
        ) : (
          <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
            <p className="mb-4">
              <span className="font-semibold text-gray-700 w-24 inline-block">Name:</span>
              <span className="text-gray-800">{user.name}</span>
            </p>
            <p className="mb-4">
              <span className="font-semibold text-gray-700 w-24 inline-block">Email:</span>
              <span className="text-gray-800">{user.email}</span>
            </p>
            <p className="mb-6">
              <span className="font-semibold text-gray-700 w-24 inline-block">Phone:</span>
              <span className="text-gray-800">{user.phoneNumber}</span>
            </p>
            <button
              onClick={handleEdit}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 transition-colors"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
  
}
