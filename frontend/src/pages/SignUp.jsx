import { useState } from "react";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validate user input
  const validateForm = () => {
    const { username, email, password } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!username.trim()) {
      toast.error("Username is required!", { position: "top-center" });
      return false;
    }
    if (!email.trim() || !emailRegex.test(email)) {
      toast.error("Please enter a valid email!", { position: "top-center" });
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters!", {
        position: "top-center",
      });
      return false;
    }
    return true;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm() || loading) return;

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Signup failed. Try again.");
      }

      toast.success("Account created successfully!", { position: "top-center" });

      setTimeout(() => navigate("/sign-in"), 2000);
    } catch (error) {
      toast.error(error.message || "Something went wrong!", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <ToastContainer />
      <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full mx-4 border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-indigo-700 mb-2">
            Join Our Community
          </h2>
          <p className="text-gray-500">Create your account in seconds</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Username</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
              <FaUser className="text-indigo-500 mr-2" />
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                className="w-full p-1 focus:outline-none bg-transparent"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
              <FaEnvelope className="text-indigo-500 mr-2" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full p-1 focus:outline-none bg-transparent"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
              <FaLock className="text-indigo-500 mr-2" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a password (min 6 chars)"
                className="w-full p-1 focus:outline-none bg-transparent"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-indigo-600 transition-colors"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            disabled={loading}
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center my-6">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="mx-4 text-gray-400 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {/* Already have an account? */}
        <p className="text-center text-gray-600 text-sm">
          Already have an account?{" "}
          <Link
            to="/sign-in"
            className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}