import { useState, useEffect } from "react";

export default function Step3({ formData, formFunction, setStepValid }) {
  const [discoveryError, setDiscoveryError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      formFunction((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } 
    else if (name === "followedTopics" || name === "expertise") {
      // Update raw input value
      formFunction((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Convert to array
      const arrayValue = value
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item !== "");

      // Always update array form
      formFunction((prev) => ({
        ...prev,
        [`${name}Array`]: arrayValue,
      }));
    } 
    else {
      formFunction((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Validate discoverySource
    if (name === "discoverySource") {
      if (value === "") {
        setDiscoveryError("This field is required.");
      } else {
        setDiscoveryError("");
      }
    }
  };

  useEffect(() => {
    const isValid = formData.discoverySource !== "";
    setStepValid(isValid);
  }, [formData.discoverySource, setStepValid]);

  useEffect(() => {
    // Trigger initial validation on mount if already filled
    if (formData.discoverySource) {
      setDiscoveryError("");
    }
  }, [formData.discoverySource]);

  return (
    <div className="space-y-4">
      {/* Followed Topics */}
      <div>
        <label htmlFor="followedTopics" className="block mb-1 font-medium">
          Followed Topics (comma separated)
        </label>
        <input
          name="followedTopics"
          id="followedTopics"
          type="text"
          value={formData.followedTopics || ""}
          placeholder="Artificial Intelligence, Blockchain, etc"
          className="w-full px-4 py-2 bg-transparent border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          onChange={handleChange}
        />
      </div>

      {/* Area of Expertise */}
      <div>
        <label htmlFor="expertise" className="block mb-1 font-medium">
          Area of Expertise (comma separated)
        </label>
        <input
          name="expertise"
          id="expertise"
          value={formData.expertise || ""}
          placeholder="e.g. Data Science, Policy, Climate"
          className="w-full px-4 py-2 bg-transparent border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          onChange={handleChange}
        />
      </div>

      {/* Newsletter Subscription */}
      <div>
        <label htmlFor="isSubscribedToNewsletter" className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isSubscribedToNewsletter"
            id="isSubscribedToNewsletter"
            checked={formData.isSubscribedToNewsletter || false}
            onChange={handleChange}
          />
          <span>Subscribe to newsletter</span>
        </label>
      </div>

      {/* Discovery Source */}
      <div>
        <label htmlFor="discoverySource" className="block mb-1 font-medium">
          How did you find us? <span className="text-red-500">*</span>
        </label>
        <select
          name="discoverySource"
          id="discoverySource"
          value={formData.discoverySource || ""}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-transparent border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded [&_option]:!text-white [&_option]:!bg-gray-800"
          required
        >
          <option value="">Select an option</option>
          <option value="LinkedIn">LinkedIn</option>
          <option value="Twitter/X">Twitter/X</option>
          <option value="Instagram">Instagram</option>
          <option value="Email Newsletter">Email Newsletter</option>
          <option value="College/University">College/University</option>
          <option value="Company/Organization">Company/Organization</option>
          <option value="Hackathon or Event">Hackathon or Event</option>
          <option value="Friend">Friend</option>
          <option value="Family">Family</option>
          <option value="Colleague">Colleague</option>
          <option value="Google Search">Google Search</option>
          <option value="News Article or Blog">News Article or Blog</option>
          <option value="Other">Other</option>
        </select>
        {discoveryError && <p className="text-red-500 text-sm mt-1">{discoveryError}</p>}
      </div>
    </div>
  );
}
