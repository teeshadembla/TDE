import { 
  Users, Clock, CheckCircle, AlertCircle, Eye, MessageSquare, 
  Send, X, Filter, Search, Calendar, Mail
} from 'lucide-react';

const FilterBar = ({ filters, setFilters, stats }) => {
  return (
    <div className='bg-neutral-900 border border-neutral-800 rounded-lg p-4 mb-6'>
      <div className='flex flex-col lg:flex-row gap-4'>
        {/* Search */}
        <div className='flex-1'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500' />
            <input
              type='text'
              placeholder='Search by name or email...'
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className='w-full bg-neutral-800 border border-neutral-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500'
            />
          </div>
        </div>
        
        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          className='bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500'
        >
          <option value='all'>All Statuses ({stats.total})</option>
          <option value='SUBMITTED'>Pending Review ({stats.submitted})</option>
          <option value='REVISION_NEEDED'>Needs Revision ({stats.revision})</option>
          <option value='APPROVED'>Approved ({stats.approved})</option>
        </select>
        
        {/* Cohort Filter */}
        <select
          value={filters.cohort}
          onChange={(e) => setFilters(prev => ({ ...prev, cohort: e.target.value }))}
          className='bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500'
        >
          <option value='all'>All Cohorts</option>
          <option value='summer'>Summer</option>
          <option value='winter'>Winter</option>
          <option value='spring'>Spring</option>
          <option value='fall'>Fall</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;