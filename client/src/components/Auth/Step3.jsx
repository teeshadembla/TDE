import { useState, useEffect } from "react";
import TagCombobox, { EXPERTISE_OPTIONS, INTEREST_OPTIONS } from "./TagCombobox.jsx";

export default function Step3({ formData, formFunction, setStepValid }) {
  const [discoveryError, setDiscoveryError] = useState("");

  // ── helpers ────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      formFunction((prev) => ({ ...prev, [name]: checked }));
    } else {
      formFunction((prev) => ({ ...prev, [name]: value }));
    }

    if (name === "discoverySource") {
      setDiscoveryError(value === "" ? "This field is required." : "");
    }
  };

  // Called by TagCombobox for expertise tags
  const handleExpertiseChange = (tags) => {
    formFunction((prev) => ({
      ...prev,
      expertise: tags.join(", "),      // keep comma-string for back-compat
      expertiseArray: tags,
    }));
  };

  // Called by TagCombobox for followed-topics tags
  const handleTopicsChange = (tags) => {
    formFunction((prev) => ({
      ...prev,
      followedTopics: tags.join(", "),
      followedTopicsArray: tags,
    }));
  };

  // ── validation ─────────────────────────────────────────────
  useEffect(() => {
    setStepValid(formData.discoverySource !== "");
  }, [formData.discoverySource, setStepValid]);

  useEffect(() => {
    if (formData.discoverySource) setDiscoveryError("");
  }, [formData.discoverySource]);

  // Derive tag arrays from stored comma-string (handles pre-filled state)
  const expertiseTags = formData.expertiseArray ??
    (formData.expertise
      ? formData.expertise.split(",").map((s) => s.trim()).filter(Boolean)
      : []);

  const topicTags = formData.followedTopicsArray ??
    (formData.followedTopics
      ? formData.followedTopics.split(",").map((s) => s.trim()).filter(Boolean)
      : []);

  // ── render ─────────────────────────────────────────────────
  return (
    <div className="space-y-4">

      {/* Followed Topics */}
      <div>
        <label htmlFor="followedTopics" className="block mb-1 font-medium">
          Followed Topics{" "}
          <span className="text-gray-400 font-normal text-sm">(up to 3)</span>
        </label>
        <TagCombobox
          id="followedTopics"
          name="followedTopics"
          options={INTEREST_OPTIONS}
          value={topicTags}
          onChange={handleTopicsChange}
          max={3}
          placeholder="e.g. AI Safety, Climate & Tech…"
        />
      </div>

      {/* Area of Expertise */}
      <div>
        <label htmlFor="expertise" className="block mb-1 font-medium">
          Area of Expertise{" "}
          <span className="text-gray-400 font-normal text-sm">(up to 3)</span>
        </label>
        <TagCombobox
          id="expertise"
          name="expertise"
          options={EXPERTISE_OPTIONS}
          value={expertiseTags}
          onChange={handleExpertiseChange}
          max={3}
          placeholder="e.g. Data Science, Policy…"
        />
      </div>

      {/* Newsletter Subscription */}
      <div>
        <label
          htmlFor="isSubscribedToNewsletter"
          className="flex items-center gap-2"
        >
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
        {discoveryError && (
          <p className="text-red-500 text-sm mt-1">{discoveryError}</p>
        )}
      </div>
    </div>
  );
}