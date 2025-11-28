/* import { useState, useEffect } from "react";

export default function Step1({ formData, formFunction, setStepValid }) {
  const [errors, setErrors] = useState({
    FullName: "",
    email: "",
    password: "",
    role: "",
  });
  const [imagePreview, setImagePreview] = useState(null);

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      // Store the file in formData
      formFunction((prev) => ({
        ...prev,
        profilePicture: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    formFunction((prev) => ({
      ...prev,
      profilePicture: null,
    }));
    setImagePreview(null);
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
      
      <div>
        <label htmlFor="profilePicture" className="block mb-1 font-medium">
          Profile Picture <span className="text-gray-400 text-sm">(Optional)</span>
        </label>
        
        {imagePreview ? (
          <div className="flex items-center gap-4">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-500"
            />
            <button
              type="button"
              onClick={removeImage}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white transition"
            >
              Remove
            </button>
          </div>
        ) : (
          <div>
            <input
              type="file"
              id="profilePicture"
              name="profilePicture"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="profilePicture"
              className="inline-block px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded cursor-pointer transition"
            >
              Choose Image
            </label>
            <p className="text-sm text-gray-400 mt-2">Max size: 5MB (JPG, PNG, GIF)</p>
          </div>
        )}
      </div>

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
          <option value="chair">Chair</option>
        </select>
        {errors.role && (
          <p className={`text-sm mt-1 ${isValid(errors.role) ? "text-green-500" : "text-red-500"}`}>
            {errors.role}
          </p>
        )}
      </div>
    </div>
  );
} */

  // ============================================
// Step1Clerk.jsx - Step 1 with Clerk Integration
// ============================================
import { useState, useEffect } from "react";

export default function Step1Clerk({ formData, formFunction, setStepValid }) {
  const [errors, setErrors] = useState({
    FullName: "",
    email: "",
    password: "",
    role: "",
  });
  const [imagePreview, setImagePreview] = useState(null);

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
        // Clerk requires at least 8 characters
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
    msg === "Looks good!" || 
    msg === "Valid email!" || 
    msg === "Strong password!" || 
    msg === "Role selected!";

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      // Store the file in formData
      formFunction((prev) => ({
        ...prev,
        profilePicture: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    formFunction((prev) => ({
      ...prev,
      profilePicture: null,
    }));
    setImagePreview(null);
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
      {/* Profile Picture */}
      <div>
        <label htmlFor="profilePicture" className="block mb-1 font-medium">
          Profile Picture <span className="text-gray-400 text-sm">(Optional)</span>
        </label>
        
        {imagePreview ? (
          <div className="flex items-center gap-4">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-500"
            />
            <button
              type="button"
              onClick={removeImage}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white transition"
            >
              Remove
            </button>
          </div>
        ) : (
          <div>
            <input
              type="file"
              id="profilePicture"
              name="profilePicture"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="profilePicture"
              className="inline-block px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded cursor-pointer transition"
            >
              Choose Image
            </label>
            <p className="text-sm text-gray-400 mt-2">Max size: 5MB (JPG, PNG, GIF)</p>
          </div>
        )}
      </div>

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
          <option value="chair">Chair</option>
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