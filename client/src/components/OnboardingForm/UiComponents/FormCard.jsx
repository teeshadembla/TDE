// Card Container Component
const FormCard = ({ title, description, required, children }) => (
  <div className='bg-neutral-900 border border-neutral-800 rounded-lg p-4 sm:p-6 hover:border-neutral-700 transition-colors'>
    <div className='mb-4'>
      <h3 className='text-lg font-medium text-white'>
        {title} {required && <span className='text-red-500'>*</span>}
      </h3>
      {description && (
        <p className='text-sm text-neutral-500 mt-1'>{description}</p>
      )}
    </div>
    {children}
  </div>
);

export default FormCard;