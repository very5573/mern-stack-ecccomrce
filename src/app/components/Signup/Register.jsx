"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import API from "../../../utils/axiosInstance";
import AppButton from "../../components/UI/Button";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const initialFormData = {
  name: "",
  email: "",
  password: "",
  avatar: null,
};

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState(initialFormData);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const inputFields = [
    { name: "name", label: "Name", type: "text" },
    { name: "email", label: "Email", type: "email" },
    { name: "password", label: "Password", type: "password" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      toast.warn("Only JPG/PNG allowed");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.warn("File size must be < 10MB");
      return;
    }

    setFormData((prev) => ({ ...prev, avatar: file }));
    setPreview(URL.createObjectURL(file));
  };

  const isPasswordStrong = (pwd) =>
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(pwd);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { name, email, password, avatar } = formData;

    if (!name || !email || !password) {
      toast.warn("All fields are required");
      setLoading(false);
      return;
    }

    if (!isPasswordStrong(password)) {
      toast.warn(
        "Password must contain uppercase, lowercase, number & special character"
      );
      setLoading(false);
      return;
    }

    try {
      let avatarData = null;
      if (avatar) {
        const { signature, timestamp, folder, cloudName, apiKey } =
          await API.get("/get-signature").then((res) => res.data);

        const fd = new FormData();
        fd.append("file", avatar);
        fd.append("api_key", apiKey);
        fd.append("folder", folder);
        fd.append("timestamp", timestamp);
        fd.append("signature", signature);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          { method: "POST", body: fd }
        );
        const data = await res.json();
        avatarData = { url: data.secure_url, public_id: data.public_id };
      }

      const { data } = await API.post("/register", {
        name,
        email,
        password,
        avatar: avatarData,
      });

      toast.success(data.message || "Registration successful!");
      setFormData(initialFormData);
      setPreview(null);
      setTimeout(() => router.push("/"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center
      bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500
      relative overflow-hidden px-4">

      {/* Optional geometric shapes for dashing style */}
      <div className="absolute w-72 h-72 bg-white/10 rounded-full top-[-5rem] left-[-5rem] blur-3xl"></div>
      <div className="absolute w-96 h-96 bg-white/5 rounded-full bottom-[-10rem] right-[-10rem] blur-3xl"></div>

      <div className="w-full max-w-md bg-white/90 dark:bg-gray-900/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl z-10">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white text-center">
          Create an Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {inputFields.map((field) => (
            <div key={field.name} className="relative">
              <label
                htmlFor={field.name}
                className="block text-gray-700 dark:text-gray-200 font-medium mb-1"
              >
                {field.label}
              </label>
              {field.type === "password" ? (
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name={field.name}
                    id={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                  <button
                    type="button"
                    onClick={handleTogglePassword}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </button>
                </div>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  id={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              )}
            </div>
          ))}

          {/* Avatar Upload */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-300">
              <CloudUploadIcon /> Upload Avatar (optional)
              <input
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <div className="mt-2 h-20 w-20 flex items-center justify-center">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-20 h-20 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                />
              ) : (
                <div className="w-20 h-20 rounded-full border-dashed border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-400 text-xs">
                  Preview
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <AppButton
              type="submit"
              disabled={loading}
              variant="auto"
              color="primary"
            >
              {loading ? "Loading..." : "Register"}
            </AppButton>
          </div>
        </form>
      </div>
    </div>
  );
}
