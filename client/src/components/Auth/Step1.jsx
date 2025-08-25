import { useState, useEffect } from "react";

export default function Step1({ formData, formFunction, setStepValid }) {
  const [errors, setErrors] = useState({
    FullName: "",
    email: "",
    password: "",
    role: "",
  });

  const validateField = (name, value) => {
    switch (name) {
      case "FullName":
        if (!value) return "Full Name is required";
        if (value.length > 35) return "Must be 35 characters or less";
        return "Looks good!";
      case "email":
        if (!value) return "Email is required";
        const emailRegex = /^[\w.-]+@(?:gmail|yahoo|outlook|[\w-]+)\.com$/i;
        return emailRegex.test(value) ? "Valid email!" : "Invalid email address";
      case "password":
        if (!value) return "Password is required";
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
        return passwordRegex.test(value)
          ? "Strong password!"
          : "Must be 8+ chars, include letters, numbers & symbols";
      case "role":
        return value ? "Role selected!" : "Please select a role";
      default:
        return "";
    }
  };

  const isValid = (msg) =>
    msg === "Looks good!" || msg === "Valid email!" || msg === "Strong password!" || msg === "Role selected!";

  const handleChange = (e) => {
    const { name, value } = e.target;

    formFunction((prev) => ({
      ...prev,
      [name]: value,
    }));

    const validationMessage = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: validationMessage,
    }));
  };

  useEffect(() => {
    const allValid =
      Object.values(errors).every((msg) => isValid(msg)) &&
      formData.FullName &&
      formData.email &&
      formData.password &&
      formData.role;

    if (setStepValid) {
      setStepValid(allValid);
    }
  }, [errors, formData, setStepValid]);

  return (
    <div className="text-white bg-black space-y-6 p-4 rounded-md">
      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="block mb-1 font-medium">
          Full Name <span className="text-red-600">*</span>
        </label>
        <input
          value={formData.FullName}
          id="fullName"
          name="FullName"
          placeholder="Full Name"
          onChange={handleChange}
          required
          className="w-full p-2 rounded bg-black border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
        />
        {errors.FullName && (
          <p className={`text-sm mt-1 ${isValid(errors.FullName) ? "text-green-500" : "text-red-500"}`}>
            {errors.FullName}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block mb-1 font-medium">
          Email <span className="text-red-600">*</span>
        </label>
        <input
          value={formData.email}
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="w-full p-2 rounded bg-black border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
        />
        {errors.email && (
          <p className={`text-sm mt-1 ${isValid(errors.email) ? "text-green-500" : "text-red-500"}`}>
            {errors.email}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block mb-1 font-medium">
          Password <span className="text-red-600">*</span>
        </label>
        <input
          value={formData.password}
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
          className="w-full p-2 rounded bg-black border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
        />
        {errors.password && (
          <p className={`text-sm mt-1 ${isValid(errors.password) ? "text-green-500" : "text-red-500"}`}>
            {errors.password}
          </p>
        )}
      </div>

      {/* Role */}
      <div>
        <label htmlFor="role" className="block mb-1 font-medium">
          Role <span className="text-red-600">*</span>
        </label>
        <select
          value={formData.role}
          name="role"
          onChange={handleChange}
          required
          className="w-full p-2 rounded bg-black border border-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-white"
        >
          <option value="">Select Role</option>
          <option value="core">Core Member</option>
          <option value="user">User</option>
        </select>
        {errors.role && (
          <p className={`text-sm mt-1 ${isValid(errors.role) ? "text-green-500" : "text-red-500"}`}>
            {errors.role}
          </p>
        )}
      </div>
    </div>
  );
}
