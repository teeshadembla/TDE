import { useEffect, useState } from "react";

export default function Step2({ formData, formFunction, setStepValid }) {
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState({});

  const validateField = (name, value) => {
    let error = "";
    let isValid = true;

    if (["twitter", "LinkedIn", "Instagram"].includes(name)) {
      const patterns = {
        twitter: /^https:\/\/(www\.)?twitter\.com\/[A-Za-z0-9_]{1,15}$/,
        LinkedIn: /^https:\/\/(www\.)?linkedin\.com\/in\/[A-Za-z0-9_-]+\/?$/,
        Instagram: /^https:\/\/(www\.)?instagram\.com\/[A-Za-z0-9_.]+\/?$/
      };

      if (value && !patterns[name].test(value)) {
        error = `Invalid ${name} URL`;
        isValid = false;
      }
    } else {
      if (value.length > 25) {
        error = `${name} must be 25 characters or less`;
        isValid = false;
      }
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    setSuccess((prev) => ({ ...prev, [name]: isValid && value ? "Valid" : "" }));

    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    formFunction((prev) => {
      if (["twitter", "LinkedIn", "Instagram"].includes(name)) {
        return {
          ...prev,
          socialLinks: {
            ...prev.socialLinks,
            [name]: value
          }
        };
      } else {
        return {
          ...prev,
          [name]: value
        };
      }
    });

    validateField(name, value);
  };

  useEffect(() => {
    const allFieldsValid = ["twitter", "LinkedIn", "Instagram", "location", "title", "department", "company"]
      .every((field) => {
        const value =
          ["twitter", "LinkedIn", "Instagram"].includes(field)
            ? formData.socialLinks[field]
            : formData[field];
        return validateField(field, value);
      });

    setStepValid(allFieldsValid);
  }, [formData]);

  return (
    <div className="text-white bg-black space-y-6 p-4 rounded-md">
      {/* Social Links */}
      {["twitter", "LinkedIn", "Instagram"].map((field) => (
        <div key={field}>
          <label className="block mb-1 font-medium capitalize">
            {field} Link
          </label>
          <input
            type="url"
            name={field}
            value={formData.socialLinks?.[field] || ""}
            onChange={handleChange}
            placeholder={`https://${field.toLowerCase()}.com/yourprofile`}
            className="w-full p-2 rounded bg-black border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
          />
          {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
          {success[field] && <p className="text-green-500 text-sm mt-1">{success[field]}</p>}
        </div>
      ))}

      {/* Text Fields */}
      {["location", "title", "department", "company"].map((field) => (
        <div key={field}>
          <label className="block mb-1 font-medium capitalize">
            {field}
          </label>
          <input
            type="text"
            name={field}
            value={formData[field]}
            onChange={handleChange}
            placeholder={`Enter your ${field}`}
            className="w-full p-2 rounded bg-black border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
          />
          {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
          {success[field] && <p className="text-green-500 text-sm mt-1">{success[field]}</p>}
        </div>
      ))}
    </div>
  );
}
