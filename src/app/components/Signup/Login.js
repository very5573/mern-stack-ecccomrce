"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import API from "../../../utils/axiosInstance";
import AppButton from "../../components/UI/Button";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { fetchUser } from "@/redux/slices/authSlice";

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputFields = [
    { name: "email", label: "Email", type: "email" },
    { name: "password", label: "Password", type: "password" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  const validateForm = () => {
    const { email, password } = formData;
    if (!email || !password) {
      toast.error("All fields are required!");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email format!");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters!");
      return false;
    }
    return true;
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await API.post("/login", formData);
      dispatch(fetchUser());
      toast.success("✅ Logged in successfully!");
      router.push("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" flex justify-center items-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl border border-gray-100">
        <h2 className="text-4xl font-extrabold mb-8 text-gray-900 text-center">
          Welcome Back
        </h2>

        <form onSubmit={loginHandler} className="space-y-6">
          {inputFields.map((field) => (
            <div key={field.name} className="relative">
              <label className="block mb-2 font-semibold text-gray-700">
                {field.label}
              </label>

              {field.type === "password" ? (
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  />
                  <button
                    type="button"
                    onClick={handleTogglePassword}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-500 transition"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </button>
                </div>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                />
              )}
            </div>
          ))}

          <div className="flex justify-center">
            <AppButton
              type="submit"
              disabled={loading}
              variant="auto"
              color="primary"
              className="py-3 text-lg font-semibold rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transition"
            >
              {loading ? "Loading..." : "Login"}
            </AppButton>
          </div>

          <p
            className="text-sm text-purple-600 mt-4 text-center cursor-pointer hover:underline hover:text-purple-800 transition"
            onClick={() => router.push("/password/forgot")}
          >
            Forgot Password?
          </p>
        </form>
      </div>
    </div>
  );
}
