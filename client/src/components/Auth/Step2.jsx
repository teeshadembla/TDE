import { useEffect, useState } from "react";

export default function Step2({ formData, formFunction, setStepValid }) {
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState({});

  // Local state for city & country
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  // Country list (can be moved to constants file if needed)
  const countries = [
    "Afghanistan","Albania","Algeria","Argentina","Australia","Austria","Bangladesh","Belgium","Brazil","Canada",
    "China","Denmark","Egypt","Finland","France","Germany","Greece","Hong Kong","India","Indonesia","Ireland",
    "Israel","Italy","Japan","Kenya","Malaysia","Mexico","Netherlands","New Zealand","Nigeria","Norway","Pakistan",
    "Philippines","Poland","Portugal","Qatar","Russia","Saudi Arabia","Singapore","South Africa","South Korea",
    "Spain","Sri Lanka","Sweden","Switzerland","Thailand","Turkey","UAE","UK","USA","Vietnam"
  ];

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
      if (value && value.length > 50) {
        error = `${name} must be 50 characters or less`;
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

  // Handle city input
  const handleCityChange = (e) => {
    const value = e.target.value;
    setCity(value);
    validateField("city", value);
  };

  // Handle country dropdown
  const handleCountryChange = (e) => {
    const value = e.target.value;
    setCountry(value);
    validateField("country", value);
  };

  // Combine city + country → location string
  useEffect(() => {
    const combinedLocation =
      city && country ? `${city}, ${country}` : city || country || "";

    formFunction((prev) => ({
      ...prev,
      location: combinedLocation
    }));

    validateField("location", combinedLocation);
  }, [city, country]);

  useEffect(() => {
    const allFieldsValid = [
      "twitter",
      "LinkedIn",
      "Instagram",
      "title",
      "department",
      "company",
      "location"
    ].every((field) => {
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

      {/* City */}
      <div>
        <label className="block mb-1 font-medium">City</label>
        <input
          type="text"
          value={city}
          onChange={handleCityChange}
          placeholder="Enter your city"
          className="w-full p-2 rounded bg-black border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
        />
        {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
      </div>

      {/* Country Dropdown */}
      <div>
        <label className="block mb-1 font-medium">Country</label>
        <select
          value={country}
          onChange={handleCountryChange}
          className="w-full p-2 rounded bg-black border border-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-white"
        >
          <option value="">Select your country</option>
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
      </div>

      {/* Text Fields */}
      {["title", "department", "company"].map((field) => (
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
