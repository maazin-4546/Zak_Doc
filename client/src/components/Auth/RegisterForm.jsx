import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const RegisterForm = () => {

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      toast.success("Registered successfully");
      setFormData({ firstName: "", lastName: "", email: "", password: "", phone: "" });
      setTimeout(() => navigate("/login"), 2000);

    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <ToastContainer />
      <div className="bg-white backdrop-blur-lg shadow-xl rounded-lg p-10">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Create an Account</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* First & Last Name Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* First Name */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-600 mb-1">First Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                  <FaUser />
                </span>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 text-black bg-gray-100 shadow-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300"
                  required
                />
              </div>
            </div>

            {/* Last Name */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-600 mb-1">Last Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                  <FaUser />
                </span>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 text-black bg-gray-100 shadow-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300"
                  required
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-600 mb-1">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <FaEnvelope />
              </span>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 text-black bg-gray-100 shadow-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-600 mb-1">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <FaLock />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-3 text-black bg-gray-100 shadow-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300"
                required
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="cursor-pointer absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition duration-200"
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
          </div>

          {/* Phone Number */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-600 mb-1">Phone Number</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <FaPhone />
              </span>
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 text-black bg-gray-100 shadow-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-4 bg-indigo-500 text-white cursor-pointer py-3 px-4 rounded-lg hover:bg-indigo-400 transition duration-200"
          >
            Register
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-500 mt-6">
          Already have an account?
          <Link to="/login" className="text-indigo-500 hover:text-indigo-400 transition-all ml-1 font-semibold">
            Login here
          </Link>
        </p>
      </div>
    </div>


  );
};

export default RegisterForm;