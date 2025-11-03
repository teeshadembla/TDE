// ResearchPaperUploadForm.jsx
import React, { useState, useEffect } from 'react';
import { X, Upload, FileText, Image, Plus, Check, AlertCircle, CheckCircle } from 'lucide-react';
import SingleSelect from './SingleSelect.jsx';
import MultiSelect from './MultiSelect.jsx';
import FileUploadField from './FileUploadField.jsx';
import TagsInput from './TagsInput.jsx';
import DocumentTypeSelect from './DocumentTypeSelect.jsx';
import TextInputField from './TextInputField.jsx';
import DateInputField from './DateInputField.jsx';
import axios from 'axios';
import axiosInstance from '../../config/apiConfig';

// API Functions
const fetchWorkgroups = async () => {
  return axiosInstance.get('/api/fellowship/getWorkgroups');
};

const fetchUsersByWorkgroup = async (workgroupId) => {
  return axiosInstance.get(`/api/user/workgroup/${workgroupId}`);
};

// Alert Component
const Alert = ({ type, message }) => {
  const styles = {
    success: 'bg-green-900 border-green-700 text-green-200',
    error: 'bg-red-900 border-red-700 text-red-200',
  };
  
  const Icon = type === 'success' ? CheckCircle : AlertCircle;
  
  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border-2 ${styles[type]} mb-4`}>
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <p className="text-sm">{message}</p>
    </div>
  );
};

// Progress Bar Component
const ProgressBar = ({ label, progress }) => {
  return (
    <div className="w-full">
      <div className="flex justify-between mb-2">
        <span className="text-sm text-neutral-300">{label}</span>
        <span className="text-sm text-[#004AAD] font-semibold">{progress}%</span>
      </div>
      <div className="w-full h-2 bg-neutral-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#004AAD] transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

// Main Component
const ResearchPaperUploadForm = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [publishingDate, setPublishingDate] = useState('');
  const [description, setDescription] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [selectedWorkgroup, setSelectedWorkgroup] = useState('');
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [tags, setTags] = useState([]);
  const [workgroups, setWorkgroups] = useState([]);
  const [availableAuthors, setAvailableAuthors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pdfUploadProgress, setPdfUploadProgress] = useState(0);
  const [thumbnailUploadProgress, setThumbnailUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loadingWorkgroups, setLoadingWorkgroups] = useState(false);
  const [loadingAuthors, setLoadingAuthors] = useState(false);

  // Fetch workgroups on mount
  useEffect(() => {
    const loadWorkgroups = async () => {
      setLoadingWorkgroups(true);
      try {
        const response = await fetchWorkgroups();
        setWorkgroups(response.data.data || response.data);
      } catch (err) {
        setError('Failed to load workgroups');
        console.log(err);
      } finally {
        setLoadingWorkgroups(false);
      }
    };
    loadWorkgroups();
  }, []);

  // Fetch authors when workgroup changes
  useEffect(() => {
    const loadAuthors = async () => {
      if (selectedWorkgroup) {
        setLoadingAuthors(true);
        try {
          const response = await fetchUsersByWorkgroup(selectedWorkgroup);
          setAvailableAuthors(response.data.data || response.data);
          setSelectedAuthors([]);
        } catch (err) {
          setError('Failed to load authors');
          console.error(err);
        } finally {
          setLoadingAuthors(false);
        }
      } else {
        setAvailableAuthors([]);
        setSelectedAuthors([]);
      }
    };
    loadAuthors();
  }, [selectedWorkgroup]);

  useEffect(() => {
    console.log("Available authors updated:", availableAuthors);
  }, [availableAuthors]);

  const handlePdfChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setError('Please select a PDF file');
        return;
      }
      
      if (selectedFile.size > 100 * 1024 * 1024) {
        setError('PDF file size must be less than 100MB');
        return;
      }
      
      setPdfFile(selectedFile);
      setError('');
    }
  };

  const handleThumbnailChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please select an image file (JPG, PNG, etc.)');
        return;
      }
      
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('Thumbnail size must be less than 5MB');
        return;
      }
      
      setThumbnailFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async () => {
    // Updated validation to include title and publishingDate
    if (!pdfFile || !thumbnailFile || !title || !publishingDate || !selectedWorkgroup || selectedAuthors.length === 0 || !documentType) {
      setError('Please fill all required fields');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');
    setPdfUploadProgress(0);
    setThumbnailUploadProgress(0);

    try {
      // Step 1: Get presigned URLs from backend
      const presignedResponse = await axiosInstance.post(
        '/api/documents/presigned-url',
        {
          fileName: pdfFile.name,
          fileType: pdfFile.type,
          fileSize: pdfFile.size,
          thumbnailType: thumbnailFile.type,
          title: title,
          subtitle: subtitle,
          publishingDate: publishingDate,
          description: description,
          documentType: documentType,
          workgroupId: selectedWorkgroup,
          authors: selectedAuthors,
          tags: tags,
        }
      );

      const { 
        pdfPresignedUrl, 
        thumbnailPresignedUrl, 
        documentId 
      } = presignedResponse.data.data;

      console.log("Presigned URLs received, uploading to S3...");

      // Step 2a: Upload PDF to S3 using presigned URL
      await axios.put(pdfPresignedUrl, pdfFile, {
        headers: {
          'Content-Type': pdfFile.type,
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setPdfUploadProgress(progress);
        },
      });

      console.log("PDF upload completed");

      // Step 2b: Upload thumbnail to S3 using presigned URL
      await axios.put(thumbnailPresignedUrl, thumbnailFile, {
        headers: {
          'Content-Type': thumbnailFile.type,
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setThumbnailUploadProgress(progress);
        },
      });

      console.log("Thumbnail upload completed. Confirming with backend...");

      // Step 3: Confirm upload with backend
      await axiosInstance.post(
        '/api/documents/confirm-upload',
        { documentId }
      );

      setSuccess('Research paper uploaded successfully!');
      
      // Reset form
      setPdfFile(null);
      setThumbnailFile(null);
      setTitle('');
      setSubtitle('');
      setPublishingDate('');
      setDescription('');
      setDocumentType('');
      setSelectedWorkgroup('');
      setSelectedAuthors([]);
      setTags([]);
      setPdfUploadProgress(0);
      setThumbnailUploadProgress(0);

      // Reset file inputs
      const pdfInput = document.getElementById('file-pdf-document');
      const thumbnailInput = document.getElementById('file-thumbnail-image');
      if (pdfInput) pdfInput.value = '';
      if (thumbnailInput) thumbnailInput.value = '';

    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
      
      // Mark upload as failed in backend
      if (err.response?.data?.data?.documentId) {
        try {
          await axiosInstance.post(
            '/api/documents/mark-failed',
            { documentId: err.response.data.data.documentId }
          );
        } catch (markFailedErr) {
          console.error('Error marking upload as failed:', markFailedErr);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Updated form validation to include title and publishingDate
  const isFormValid = pdfFile && thumbnailFile && title && publishingDate && selectedWorkgroup && selectedAuthors.length > 0 && documentType;

  // Get today's date in YYYY-MM-DD format for max date validation
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-black py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Upload Research Paper
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base">
            Share your research with the digital economics community
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-2xl">
          {error && <Alert type="error" message={error} />}
          {success && <Alert type="success" message={success} />}

          <div className="space-y-6">
            {/* Title */}
            <TextInputField
              label="Title"
              value={title}
              onChange={setTitle}
              placeholder="Enter the research paper title..."
              required
              disabled={isSubmitting}
              maxLength={200}
            />

            {/* Subtitle */}
            <TextInputField
              label="Subtitle"
              value={subtitle}
              onChange={setSubtitle}
              placeholder="Enter subtitle (optional)..."
              disabled={isSubmitting}
              maxLength={300}
            />

            {/* Publishing Date */}
            <DateInputField
              label="Publishing Date"
              value={publishingDate}
              onChange={setPublishingDate}
              required
              disabled={isSubmitting}
              max={today}
            />

            {/* PDF Upload */}
            <FileUploadField
              label="PDF Document"
              accept=".pdf,application/pdf"
              icon={FileText}
              file={pdfFile}
              onFileChange={handlePdfChange}
              required
              disabled={isSubmitting}
            />

            {/* Thumbnail Upload */}
            <FileUploadField
              label="Thumbnail Image"
              accept="image/*"
              icon={Image}
              file={thumbnailFile}
              onFileChange={handleThumbnailChange}
              required
              disabled={isSubmitting}
              preview
            />

            {/* Upload Progress */}
            {isSubmitting && (pdfUploadProgress > 0 || thumbnailUploadProgress > 0) && (
              <div className="space-y-4 p-4 bg-neutral-900 rounded-lg border border-neutral-700">
                <ProgressBar label="PDF Upload Progress" progress={pdfUploadProgress} />
                <ProgressBar label="Thumbnail Upload Progress" progress={thumbnailUploadProgress} />
              </div>
            )}

            {/* Document Type Selection */}
            <DocumentTypeSelect
              label="Document Type"
              selectedType={documentType}
              onChange={setDocumentType}
              required
              disabled={isSubmitting}
            />

            {/* Description */}
            <div className="w-full">
              <label className="block text-white text-sm font-semibold mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide a brief description of your research paper..."
                rows={4}
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-neutral-900 border-2 border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:border-[#004AAD] focus:outline-none transition-all duration-200 resize-none disabled:opacity-50"
              />
            </div>

            {/* Workgroup Selection */}
            <SingleSelect
              label="Workgroup"
              options={workgroups}
              selectedId={selectedWorkgroup}
              onChange={setSelectedWorkgroup}
              required
              loading={loadingWorkgroups}
            />

            {/* Authors Selection */}
            <MultiSelect
              label="Authors"
              options={availableAuthors}
              selectedIds={selectedAuthors}
              onChange={setSelectedAuthors}
              required
              disabled={!selectedWorkgroup}
              loading={loadingAuthors}
            />

            {/* Tags Input */}
            <TagsInput tags={tags} setTags={setTags} />

            {/* Submit Button */}
            <div className="pt-6">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !isFormValid}
                className="w-full bg-[#004AAD] hover:bg-[#062c65] disabled:bg-neutral-700 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Upload Document
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center">
          <p className="text-neutral-500 text-xs sm:text-sm">
            Supported formats: PDF (max 100MB) • Images: JPG, PNG, WebP (max 5MB)
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResearchPaperUploadForm;