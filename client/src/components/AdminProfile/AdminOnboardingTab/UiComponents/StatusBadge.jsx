
// Status Badge Component
const StatusBadge = ({ status }) => {
  const configs = {
    'PENDING': { bg: 'bg-neutral-800', text: 'text-neutral-400', label: 'Not Started' },
    'IN_PROGRESS': { bg: 'bg-yellow-900/30', text: 'text-yellow-400', label: 'Draft Saved' },
    'SUBMITTED': { bg: 'bg-blue-900/30', text: 'text-blue-400', label: 'Pending Review' },
    'UNDER_REVIEW': { bg: 'bg-purple-900/30', text: 'text-purple-400', label: 'Under Review' },
    'REVISION_NEEDED': { bg: 'bg-orange-900/30', text: 'text-orange-400', label: 'Needs Revision' },
    'APPROVED': { bg: 'bg-green-900/30', text: 'text-green-400', label: 'Approved' }
  };
  
  const config = configs[status] || configs['PENDING'];
  
  return (
    <span className={`${config.bg} ${config.text} px-3 py-1 rounded-full text-xs font-medium`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;