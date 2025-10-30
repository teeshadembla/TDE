// MembershipTypeToggle Component
const MembershipTypeToggle = ({ activeType, onTypeChange }) => {
  return (
    <div className="flex justify-center mb-12">
      <div className="inline-flex bg-gray-100 rounded-full p-1">
        <button
          onClick={() => onTypeChange('individual')}
          className={`px-8 py-3 rounded-full font-medium transition-all ${
            activeType === 'individual'
              ? 'bg-white text-gray-900 shadow-md'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Join as individual
        </button>
        <button
          onClick={() => onTypeChange('organization')}
          className={`px-8 py-3 rounded-full font-medium transition-all ${
            activeType === 'organization'
              ? 'bg-white text-gray-900 shadow-md'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Join as organization
        </button>
      </div>
    </div>
  );
};

export default MembershipTypeToggle;