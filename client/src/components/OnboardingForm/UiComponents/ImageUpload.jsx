import { Upload, X, Plus, Save, Send, Loader2, CheckCircle } from 'lucide-react';

// Image Upload Component
const ImageUpload = ({ preview, onUpload, onRemove, error }) => (
  <div className='flex items-start gap-4 sm:gap-6'>
    <div className='relative flex-shrink-0'>
      {preview ? (
        <div className='relative'>
          <img 
            src={preview} 
            alt='Preview' 
            className='w-24 h-24 sm:w-32 sm:h-32 rounded-lg object-cover border-2 border-neutral-700'
          />
          <button
            type='button'
            onClick={onRemove}
            className='absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors'
          >
            <X className='w-4 h-4' />
          </button>
        </div>
      ) : (
        <label className='w-24 h-24 sm:w-32 sm:h-32 border-2 border-dashed border-neutral-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors'>
          <Upload className='w-6 h-6 sm:w-8 sm:h-8 text-neutral-500 mb-2' />
          <span className='text-xs text-neutral-500'>Upload</span>
          <input
            type='file'
            accept='image/*'
            onChange={onUpload}
            className='hidden'
          />
        </label>
      )}
    </div>
    <div className='flex-1'>
      <p className='text-sm text-neutral-400 mb-2'>
        Upload a professional photo
      </p>
      <ul className='text-xs text-neutral-500 space-y-1'>
        <li>• Square aspect ratio recommended</li>
        <li>• Minimum 500x500px</li>
        <li>• Maximum 5MB file size</li>
      </ul>
      {error && <p className='text-red-500 text-sm mt-2'>{error}</p>}
    </div>
  </div>
);

export default ImageUpload;