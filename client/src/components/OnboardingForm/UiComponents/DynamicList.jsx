import { Upload, X, Plus, Save, Send, Loader2, CheckCircle } from 'lucide-react';

// Dynamic List Component
const DynamicList = ({ items, onChange, onAdd, onRemove, placeholder, minItems = 0, error }) => (
  <div>
    <div className='space-y-3'>
      {items.map((item, index) => (
        <div key={index} className='flex gap-2'>
          <input
            type='text'
            value={item}
            onChange={(e) => onChange(index, e.target.value)}
            placeholder={`${placeholder} ${index + 1}`}
            className='flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-colors'
          />
          {items.length > minItems && (
            <button
              type='button'
              onClick={() => onRemove(index)}
              className='px-3 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-500 hover:bg-neutral-700 hover:text-red-500 transition-colors'
            >
              <X className='w-5 h-5' />
            </button>
          )}
        </div>
      ))}
    </div>
    <button
      type='button'
      onClick={onAdd}
      className='mt-3 flex items-center gap-2 text-blue-500 hover:text-blue-400 text-sm transition-colors'
    >
      <Plus className='w-4 h-4' /> Add another
    </button>
    {error && <p className='text-red-500 text-sm mt-2'>{error}</p>}
  </div>
);

export default DynamicList;