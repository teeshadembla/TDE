// Input Field Component
export const InputField = ({ label, required, error, ...props }) => (
  <div>
    <label className='block text-sm font-medium mb-2 text-neutral-400'>
      {label} {required && <span className='text-red-500'>*</span>}
    </label>
    <input
      {...props}
      className='w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-colors'
    />
    {error && <p className='text-red-500 text-sm mt-2'>{error}</p>}
  </div>
);

// Textarea Component
export const TextArea = ({ label, required, error, charCount, maxLength, ...props }) => (
  <div>
    <label className='block text-sm font-medium mb-2 text-neutral-400'>
      {label} {required && <span className='text-red-500'>*</span>}
    </label>
    <textarea
      {...props}
      maxLength={maxLength}
      className='w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 resize-none transition-colors'
    />
    {charCount !== undefined && (
      <p className='text-xs text-neutral-500 mt-2'>{charCount}/{maxLength}</p>
    )}
    {error && <p className='text-red-500 text-sm mt-2'>{error}</p>}
  </div>
);

