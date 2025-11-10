// Portfolio Item Component
const PortfolioItem = ({ item, index, onUpdate, onRemove }) => (
  <div className='mb-4 p-4 bg-neutral-800 rounded-lg border border-neutral-700'>
    <div className='flex justify-between items-start mb-4'>
      <span className='text-sm font-medium text-neutral-400'>Item {index + 1}</span>
      <button
        type='button'
        onClick={onRemove}
        className='text-neutral-500 hover:text-red-500 transition-colors'
      >
        <X className='w-5 h-5' />
      </button>
    </div>
    <div className='space-y-3'>
      <select
        value={item.type}
        onChange={(e) => onUpdate('type', e.target.value)}
        className='w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors'
      >
        <option value='project'>Project</option>
        <option value='publication'>Publication</option>
        <option value='talk'>Talk</option>
        <option value='other'>Other</option>
      </select>
      <input
        type='text'
        value={item.title}
        onChange={(e) => onUpdate('title', e.target.value)}
        placeholder='Title'
        className='w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-colors'
      />
      <textarea
        value={item.description}
        onChange={(e) => onUpdate('description', e.target.value)}
        placeholder='Brief description'
        rows={2}
        className='w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 resize-none transition-colors'
      />
      <input
        type='url'
        value={item.url}
        onChange={(e) => onUpdate('url', e.target.value)}
        placeholder='URL (optional)'
        className='w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-colors'
      />
    </div>
  </div>
);

export default PortfolioItem.jsx
