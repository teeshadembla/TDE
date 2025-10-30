import React, { useState, useEffect } from 'react';
import { X, Upload, FileText, Image, Plus, Check, AlertCircle, CheckCircle } from 'lucide-react';

// File Upload Field Component
const FileUploadField = ({ label, accept, icon: Icon, file, onFileChange, required, disabled, preview }) => {
  const inputId = `file-${label.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div className="w-full">
      <label className="block text-white text-sm font-semibold mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        <input
          type="file"
          accept={accept}
          onChange={onFileChange}
          className="hidden"
          id={inputId}
          disabled={disabled}
        />
        <label
          htmlFor={inputId}
          className={`flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-neutral-600 rounded-lg cursor-pointer bg-neutral-900 hover:bg-neutral-800 hover:border-[#004AAD] transition-all duration-200 ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Icon className="w-5 h-5 text-neutral-400 mr-2" />
          <span className="text-neutral-300 text-sm">
            {file ? file.name : `Choose ${label}`}
          </span>
        </label>
      </div>
      {file && (
        <div className="mt-3 space-y-2">
          <p className="text-xs text-[#004AAD]">
            ✓ {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
          {preview && file.type.startsWith('image/') && (
            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              className="w-40 h-40 object-cover rounded-lg border-2 border-neutral-700"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default FileUploadField;