import { 
  Users, Clock, CheckCircle, AlertCircle, Eye, MessageSquare, 
  Send, X, Filter, Search, Calendar, Mail
} from 'lucide-react';

const StatsCards = ({ stats }) => {
  const cards = [
    { label: 'Pending Review', count: stats.submitted, color: 'text-blue-400', icon: Clock },
    { label: 'Not Started', count: stats.notStarted, color: 'text-neutral-400', icon: AlertCircle },
    { label: 'Needs Revision', count: stats.revision, color: 'text-orange-400', icon: MessageSquare },
    { label: 'Approved', count: stats.approved, color: 'text-green-400', icon: CheckCircle }
  ];
  
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className='bg-neutral-900 border border-neutral-800 rounded-lg p-4 hover:border-neutral-700 transition-colors'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-neutral-400 text-sm mb-1'>{card.label}</p>
                <p className={`text-2xl font-bold ${card.color}`}>{card.count}</p>
              </div>
              <Icon className={`w-8 h-8 ${card.color}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;