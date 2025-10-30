// Frontend - DocumentUpload.jsx
import React, { useState } from 'react';
import axios from 'axios';
import axiosInstance from '../../config/apiConfig';

const DocumentUpload = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [pdfUploadProgress, setPdfUploadProgress] = useState(0);
  const [thumbnailUploadProgress, setThumbnailUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePdfChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (selectedFile) {
      // Validate file type
      if (selectedFile.type !== 'application/pdf') {
        setError('Please select a PDF file');
        return;
      }
      
      // Validate file size (100MB)
      if (selectedFile.size > 100 * 1024 * 1024) {
        setError('File size must be less than 100MB');
        return;
      }
      
      setPdfFile(selectedFile);
      setError('');
    }
  };

  const handleThumbnailChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please select an image file (JPG, PNG, etc.)');
        return;
      }
      
      // Validate file size (5MB for thumbnail)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('Thumbnail size must be less than 5MB');
        return;
      }
      
      setThumbnailFile(selectedFile);
      setError('');
    }
  };

  const uploadDocument = async () => {
    if (!pdfFile) {
      setError('Please select a PDF file');
      return;
    }

    if (!thumbnailFile) {
      setError('Please select a thumbnail image');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');
    setPdfUploadProgress(0);
    setThumbnailUploadProgress(0);

    try {
      // Step 1: Get presigned URLs from backend (for both PDF and thumbnail)
      const presignedResponse = await axiosInstance.post(
        '/api/documents/presigned-url',
        {
          fileName: pdfFile.name,
          fileType: pdfFile.type,
          fileSize: pdfFile.size,
          thumbnailType: thumbnailFile.type,
          description: 'My PDF document', // Optional
        },
      );

      const { 
        pdfPresignedUrl, 
        thumbnailPresignedUrl, 
        documentId 
      } = presignedResponse.data.data;

      console.log("Presigned URLs received, now uploading to S3 directly");

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

      console.log("Thumbnail upload completed. Now confirming upload to backend");

      // Step 3: Confirm upload with backend
      await axiosInstance.post(
        '/api/documents/confirm-upload',
        { documentId },
      );

      setSuccess('Document and thumbnail uploaded successfully!');
      setPdfFile(null);
      setThumbnailFile(null);
      setPdfUploadProgress(0);
      setThumbnailUploadProgress(0);
      
      // Reset file inputs
      document.getElementById('pdfInput').value = '';
      document.getElementById('thumbnailInput').value = '';

    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
      
      // Optionally mark upload as failed in backend
      if (err.response?.data?.data?.documentId) {
        try {
          await axiosInstance.post(
            '/api/documents/mark-failed',
            { documentId: err.response.data.data.documentId },
          );
        } catch (markFailedErr) {
          console.error('Error marking upload as failed:', markFailedErr);
        }
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="document-upload text-black">
      <h2>Upload PDF Document</h2>
      
      <div className="upload-area">
        {/* PDF File Input */}
        <div className="file-input-section">
          <label htmlFor="pdfInput">PDF Document:</label>
          <input
            id="pdfInput"
            type="file"
            accept=".pdf,application/pdf"
            onChange={handlePdfChange}
            disabled={uploading}
          />
          
          {pdfFile && (
            <div className="file-info">
              <p>Selected: {pdfFile.name}</p>
              <p>Size: {(pdfFile.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          )}
        </div>

        {/* Thumbnail File Input */}
        <div className="file-input-section">
          <label htmlFor="thumbnailInput">Thumbnail Image:</label>
          <input
            id="thumbnailInput"
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            disabled={uploading}
          />
          
          {thumbnailFile && (
            <div className="file-info">
              <p>Selected: {thumbnailFile.name}</p>
              <p>Size: {(thumbnailFile.size / 1024).toFixed(2)} KB</p>
              {/* Preview thumbnail */}
              <img 
                src={URL.createObjectURL(thumbnailFile)} 
                alt="Thumbnail preview" 
                style={{ maxWidth: '200px', marginTop: '10px' }}
              />
            </div>
          )}
        </div>
        
        <button
          onClick={uploadDocument}
          disabled={!pdfFile || !thumbnailFile || uploading}
        >
          {uploading ? 'Uploading...' : 'Upload Document'}
        </button>
      </div>

      {/* Progress Bars */}
      {uploading && (
        <div className="progress-section">
          <div className="progress-item">
            <label>PDF Upload: {pdfUploadProgress}%</label>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${pdfUploadProgress}%` }}
              />
            </div>
          </div>

          <div className="progress-item">
            <label>Thumbnail Upload: {thumbnailUploadProgress}%</label>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${thumbnailUploadProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
    </div>
  );
};

export default DocumentUpload;