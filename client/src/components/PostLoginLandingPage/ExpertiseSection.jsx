import { useState, useEffect, useRef } from "react";
import TagCombobox, { EXPERTISE_OPTIONS, INTEREST_OPTIONS } from "../../components/Auth/TagCombobox.jsx";

// ─── Modal ────────────────────────────────────────────────────────────────────
function ExpertiseModal({ onClose, onSave, initialData = {}, userId, token }) {
  const [expertiseTags, setExpertiseTags] = useState(
    initialData.expertiseArray || []
  );
  const [topicTags, setTopicTags] = useState(
    initialData.followedTopicsArray || []
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const overlayRef = useRef(null);

  // Close on overlay click
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/users/update/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          expertise: expertiseTags,
          followedTopics: topicTags,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to save. Please try again.");
      }

      onSave({
        expertiseArray: expertiseTags,
        expertise: expertiseTags.join(", "),
        followedTopicsArray: topicTags,
        followedTopics: topicTags.join(", "),
      });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Top accent bar */}
        <div className="h-[3px] w-full bg-gradient-to-r from-[#004AAD] via-blue-400 to-transparent" />

        <div className="p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2
                id="modal-title"
                className="text-white text-xl font-medium tracking-tight"
              >
                Tailor your expertise
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Select up to 3 per field, or type your own.
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-white transition-colors text-xl leading-none mt-0.5"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-4 px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Fields */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">
                Areas of Expertise
                <span className="ml-2 text-gray-500 font-normal">
                  (up to 3)
                </span>
              </label>
              <TagCombobox
                id="modal-expertise"
                name="expertise"
                options={EXPERTISE_OPTIONS}
                value={expertiseTags}
                onChange={setExpertiseTags}
                max={3}
                placeholder="e.g. Data Science, AI Governance…"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1.5">
                Topics of Interest
                <span className="ml-2 text-gray-500 font-normal">
                  (up to 3)
                </span>
              </label>
              <TagCombobox
                id="modal-topics"
                name="followedTopics"
                options={INTEREST_OPTIONS}
                value={topicTags}
                onChange={setTopicTags}
                max={3}
                placeholder="e.g. AI Safety, Tech Policy…"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex gap-3 justify-end">
            <button
              onClick={onClose}
              disabled={isSaving}
              className="px-5 py-2 text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2 text-sm font-medium text-white bg-[#004AAD] hover:bg-blue-600 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Saving…
                </>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tag Pill (display only) ──────────────────────────────────────────────────
function TagPill({ label }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-600/20 border border-blue-500/30 text-blue-200">
      {label}
    </span>
  );
}

// ─── ExpertiseSection ─────────────────────────────────────────────────────────
// Props:
//   userId  – the MongoDB _id of the currently logged-in user  (required)
//   token   – the JWT auth token for the Authorization header  (required)
//   initialExpertise     – string[] pre-loaded from user profile (optional)
//   initialFollowedTopics – string[] pre-loaded from user profile (optional)
const ExpertiseSection = ({
  userId,
  token,
  initialExpertise = [],
  initialFollowedTopics = [],
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [savedData, setSavedData] = useState({
    expertiseArray: initialExpertise,
    followedTopicsArray: initialFollowedTopics,
  });

  const hasSaved =
    savedData.expertiseArray.length > 0 ||
    savedData.followedTopicsArray.length > 0;

  return (
    <section className="relative w-full bg-black overflow-hidden">

      {/* GLOW SYSTEM */}
      <div className="absolute top-1/2 left-[55%] -translate-x-1/2 -translate-y-1/2 w-[1417px] h-[917px] pointer-events-none z-0 opacity-80">
        <div className="absolute inset-0 bg-[radial-gradient(35%_35%_at_50%_50%,#004AAD_0%,rgba(0,74,173,0.5)_35%,#000000_80%)] opacity-60" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0)_51.21%,#000000_79.58%)]" />
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-24 grid lg:grid-cols-2 gap-12 items-center">

        {/* LEFT */}
        <div className="text-white max-w-xl z-10">
          <h1 className="text-[36px] sm:text-[44px] lg:text-[50px] leading-tight font-light">
            Tailor your <span className="font-medium">expertise</span>
          </h1>

          <p className="mt-6 text-[18px] sm:text-[20px] lg:text-[25px] font-extralight text-white/80">
            Get personalized insights curated for your specific practice areas.
          </p>

          {/* Saved tags preview */}
          {hasSaved && (
            <div className="mt-5 space-y-3">
              {savedData.expertiseArray.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">
                    Expertise
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {savedData.expertiseArray.map((t) => (
                      <TagPill key={t} label={t} />
                    ))}
                  </div>
                </div>
              )}
              {savedData.followedTopicsArray.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">
                    Interests
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {savedData.followedTopicsArray.map((t) => (
                      <TagPill key={t} label={t} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => setModalOpen(true)}
            className="mt-6 bg-[#004AAD] text-white text-[15px] font-medium px-5 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            {hasSaved ? "Edit your areas" : "Pick your areas"}
          </button>
        </div>

        {/* RIGHT */}
        <div className="relative flex justify-center items-center">
          <div className="relative w-[90%] max-w-[700px] aspect-[4/3] rounded-[28px] border border-white/20 overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1557804506-669a67965ba0"
              alt="preview"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/80" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
            <div className="relative z-10 p-6 text-white">
              <p className="text-xs text-white/60 mb-2">
                Tech Policy and Governance
              </p>
              <h3 className="text-lg sm:text-xl font-medium">
                Designing Inclusive Policy for the Digital Economy
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <ExpertiseModal
          onClose={() => setModalOpen(false)}
          onSave={setSavedData}
          initialData={savedData}
          userId={userId}
          token={token}
        />
      )}
    </section>
  );
};

export default ExpertiseSection;