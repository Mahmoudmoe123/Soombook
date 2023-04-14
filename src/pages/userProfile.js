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
    <div className=" mx-auto  px-4">
         <Header />

      <div className="w-full max-w-2xl mx-auto">
        <h1 className="text-2xl mb-6 font-semibold text-center md:text-left">
          User Profile
        </h1>
        {editMode ? (
          <div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium">Name:</label>
              <input
                type="text"
                name="name"
                value={user.name || ""}
                onChange={handleChange}
                className="border border-gray-300 mt-1 px-3 py-2 w-full rounded focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium">Email:</label>
              <input
                type="email"
                name="email"
                value={user.email || ""}
                onChange={handleChange}
                className="border border-gray-300 mt-1 px-3 py-2 w-full rounded focus:outline-none focus:border-blue-500"
                disabled
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium">Phone:</label>
              <input
                type="text"
                name="phoneNumber"
                value={user.phoneNumber || ""}
                onChange={handleChange}
                className="border border-gray-300 mt-1 px-3 py-2 w-full rounded focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50"
            >
              Save
            </button>
          </div>
        ) : (
          <div>
            <p className="mb-2">
              <span className="font-semibold text-gray-700">Name:</span>{" "}
              {user.name}
            </p>
            <p className="mb-2">
              <span className="font-semibold text-gray-700">Email:</span>{" "}
              {user.email}
            </p>
            <p className="mb-6">
              <span className="font-semibold text-gray-700">Phone:</span>{" "}
              {user.phoneNumber}
            </p>
            <button
              onClick={handleEdit}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50"
            >
              Edit
            </button>
          </div>
        )}
      </div>
    </div>
  );
  
}
