"use client";

import GetUser from "../components/Signup/GetUser";
import UpdatePassword from "../components/Signup/UpdatePassword";
import UpdateProfile from "../components/Signup/UpdateProfile";

function Profile() {
  return (
    <div className="min-h-screen -mt-16 bg-gradient-to-br bg-gray-100 py-12 px-4">
      {/* Page Wrapper */}
      <div className="max-w-2xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Account Settings
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Manage your profile, password & personal information
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-12">
          {/* User Info */}
          <section className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6">
            <GetUser />
          </section>

          {/* Update Profile */}
          <section className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6">
            <UpdateProfile />
          </section>

          {/* Update Password */}
          <section className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6">
            <UpdatePassword />
          </section>
        </div>
      </div>
    </div>
  );
}

export default Profile;
