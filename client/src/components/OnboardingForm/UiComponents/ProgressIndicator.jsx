import react from 'react';
// Progress Indicator Component
const ProgressIndicator = ({ completed, total }) => {
  const percentage = Math.round((completed / total) * 100);
  return (
    <div className='mb-6'>
      <div className='flex justify-between items-center mb-2'>
        <span className='text-sm text-neutral-400'>Profile Completion</span>
        <span className='text-sm font-medium text-blue-500'>{percentage}%</span>
      </div>
      <div className='w-full bg-neutral-800 rounded-full h-2'>
        <div 
          className='bg-blue-600 h-2 rounded-full transition-all duration-500'
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressIndicator;