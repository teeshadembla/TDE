import { 
  Users, Clock, CheckCircle, AlertCircle, Eye, MessageSquare, 
  Send, X, Filter, Search, Calendar, Mail
} from 'lucide-react';
// Days Counter Component
const DaysCounter = ({ date, label }) => {
  const daysPassed = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24));
  const isOverdue = daysPassed > 7;
  
  return (
    <div className={`flex items-center gap-2 text-sm ${isOverdue ? 'text-red-400' : 'text-neutral-400'}`}>
      <Clock className='w-4 h-4' />
      <span>{daysPassed} days {label}</span>
    </div>
  );
};


export default DaysCounter;