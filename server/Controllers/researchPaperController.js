import generatePresignedUrl from '../utils/s3presigned.js';
import researchPaperModel from '../Models/researchPaperModel.js';
import logger from '../utils/logger.js';
import dotenv from 'dotenv';
dotenv.config();

// Step 1: Get presigned URLs (for both PDF and thumbnail)
export const getPresignedUrl = async (req, res) => {
  try {
    const { fileName, fileType, fileSize, thumbnailType, user_id } = req.body;

    // Add this validation FIRST
    if (!user_id) {
      logger.warn({user_id}, "Presigned URL generation failed: user_id missing");
      return res.status(400).json({
        success: false,
        message: 'user_id is required',
      });
    }
    
    // Validation
    if (!fileName || !fileType || !fileSize || !thumbnailType) {
      logger.warn({fileName, fileType, fileSize, thumbnailType}, "Presigned URL generation failed: Missing required fields");
      return res.status(400).json({
        success: false,
        message: 'fileName, fileType, fileSize, and thumbnailType are required',
      });
    }

    
    // Check PDF file type
    if (fileType !== 'application/pdf') {
      logger.warn({fileType}, "Presigned URL generation failed: Invalid file type");
      return res.status(400).json({
        success: false,
        message: 'Only PDF files are allowed',
      });
    }

    // Check thumbnail file type
    if (!thumbnailType.startsWith('image/')) {
      logger.warn({thumbnailType}, "Presigned URL generation failed: Invalid thumbnail type");
      return res.status(400).json({
        success: false,
        message: 'Thumbnail must be an image file',
      });
    }

    // Check file size (100MB limit for PDF)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (fileSize > maxSize) {
      logger.warn({fileSize, maxSize}, "Presigned URL generation failed: File too large");
      return res.status(400).json({
        success: false,
        message: 'File size exceeds 100MB limit',
      });
    }

    // Generate presigned URL for PDF
    const { presignedUrl: pdfPresignedUrl, fileUrl: pdfFileUrl, key: pdfKey } = 
      await generatePresignedUrl(
        process.env.AWS_BUCKET_NAME_PDF,
        user_id,
        fileName,
        fileType,
        'pdfs' // folder name
      );

    // Generate presigned URL for thumbnail
    const thumbnailFileName = fileName.replace('.pdf', '.jpg');
    const { presignedUrl: thumbnailPresignedUrl, fileUrl: thumbnailFileUrl, key: thumbnailKey } = 
      await generatePresignedUrl(
        process.env.AWS_BUCKET_NAME_PDF,
        user_id,
        thumbnailFileName,
        thumbnailType,
        'thumbnails' // folder name - bucket policy makes this public
      );

    // Create document record in pending state
    const document = new researchPaperModel({
      userId: user_id,
      fileName: fileName,
      originalName: fileName,
      s3Url: pdfFileUrl,
      s3Key: pdfKey,
      thumbnailUrl: thumbnailFileUrl, 
      thumbnailKey: thumbnailKey,
      workgroupId: req.body.workgroupId,
      documentType: req.body.documentType ,
      publishingDate: req.body.publishingDate || null,
      title: req.body.title || '',
      subtitle: req.body.subtitle || '',
      tags: req.body.tags || [],
      Authors: req.body.authors || [],
      fileSize: fileSize,
      mimeType: fileType,
      uploadStatus: 'pending',
      description: req.body.description || '',
    });

    await document.save();

    logger.info({user_id, documentId: document._id, fileName}, "Presigned URLs generated successfully");
    res.status(200).json({
      success: true,
      message: 'Presigned URLs generated successfully',
      data: {
        pdfPresignedUrl,
        thumbnailPresignedUrl,
        pdfFileUrl,
        thumbnailFileUrl,
        pdfKey,
        thumbnailKey,
        documentId: document._id,
      },
    });
  } catch (error) {
    logger.error({errorMsg: error.message, stack: error.stack}, "Error generating presigned URL");
    res.status(500).json({
      success: false,
      message: 'Failed to generate presigned URL',
      error: error.message,
    });
  }
};


// Step 2: Confirm upload completion
export const confirmUpload = async (req, res) => {
  try {
    const { documentId, user_id } = req.body;

    if (!documentId) {
      return res.status(400).json({
        success: false,
        message: 'documentId is required',
      });
    }

    const document = await researchPaperModel.findOne({
      _id: documentId,
      userId: user_id,
    });

    if (!document) {
      logger.warn({documentId, user_id}, "Upload confirmation failed: Document not found");
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }

    // Update upload status
    document.uploadStatus = 'completed';
    await document.save();

    logger.info({documentId, user_id}, "Upload confirmed successfully");
    res.status(200).json({
      success: true,
      message: 'Upload confirmed successfully',
      data: document,
    });
  } catch (error) {
    logger.error({documentId: req.body.documentId, errorMsg: error.message, stack: error.stack}, "Error confirming upload");
    res.status(500).json({
      success: false,
      message: 'Failed to confirm upload',
      error: error.message,
    });
  }
};


export const getUserDocuments = async (req, res) => {
  try {
    const { status, user_id } = req.query;
    
    const query = { userId: user_id };
    
    // Filter by status if provided
    if (status) {
      query.uploadStatus = status;
    } else {
      // By default, only show completed uploads
      query.uploadStatus = 'completed';
    }

    const documents = await researchPaperModel.find(query)
      .sort({ uploadedAt: -1 })
      .select('-__v');

    // Return documents with public thumbnail URLs (no presigned URLs needed!)
    const documentsWithUrls = documents.map(doc => ({
      ...doc.toObject(),
      thumbnailUrl: doc.thumbnailUrl, // Already public, can be used directly
    }));

    logger.debug({user_id, documentCount: documentsWithUrls.length, status}, "User documents retrieved successfully");
    res.status(200).json({
      success: true,
      count: documentsWithUrls.length,
      data: documentsWithUrls,
    });
  } catch (error) {
    logger.error({user_id, errorMsg: error.message, stack: error.stack}, "Error fetching user documents");
    res.status(500).json({
      success: false,
      message: 'Failed to fetch documents',
      error: error.message,
    });
  }
};

// Get single document with presigned URL for viewing
export const getDocument = async (req, res) => {
  try {
    const document = await researchPaperModel.findOne({
      _id: req.params.id,
    })
    .populate('Authors', 'FullName');

    if (!document) {
      logger.debug({documentId: req.params.id}, "Document not found");
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }

    logger.debug({documentId: req.params.id}, "Document retrieved successfully");
    res.status(200).json({
      success: true,
      data: document,
    });
  } catch (error) {
    logger.error({documentId: req.params.id, errorMsg: error.message, stack: error.stack}, "Error fetching document");
    res.status(500).json({
      success: false,
      message: 'Failed to fetch document',
      error: error.message,
    });
  }
};

export const getViewUrl = async (req, res) => {
  try {
    const document = await researchPaperModel.findOne({
      _id: req.params.id,
    });

    if (!document) {
      logger.debug({documentId: req.params.id}, "Document not found for view URL");
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }

    // Generate presigned URL for viewing (valid for 1 hour)
    const { getSignedUrl } = await import('@aws-sdk/s3-request-presigner');
    const { GetObjectCommand, S3Client } = await import('@aws-sdk/client-s3');
    
    const s3Client = new S3Client({
      region: process.env.AWS_REGION_PP,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_PP,
        secretAccessKey: process.env.AWS_SECRET_KEY_PP,
      },
    });

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME_PDF,
      Key: document.s3Key,
      ResponseContentDisposition: 'inline',
      ResponseContentType: 'application/pdf',
    });

    const viewUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 hour

    logger.debug({documentId: req.params.id}, "View URL generated successfully");
    res.status(200).json({
      success: true,
      data: {
        url: viewUrl,
        fileName: document.fileName,
      },
    });
  } catch (error) {
    logger.error({documentId: req.params.id, errorMsg: error.message, stack: error.stack}, "Error generating view URL");
    res.status(500).json({
      success: false,
      message: 'Failed to generate view URL',
      error: error.message,
    });
  }
};


// Get presigned URL for downloading PDF
export const getDownloadUrl = async (req, res) => {
  try {
    const document = await researchPaperModel.findOne({
      _id: req.params.id,
    });

    if (!document) {
      logger.debug({documentId: req.params.id}, "Document not found for download URL");
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }

    // Generate presigned URL for downloading (valid for 5 minutes)
    const { getSignedUrl } = await import('@aws-sdk/s3-request-presigner');
    const { GetObjectCommand, S3Client } = await import('@aws-sdk/client-s3');
    
    const s3Client = new S3Client({
      region: process.env.AWS_REGION_PP,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_PP,
        secretAccessKey: process.env.AWS_SECRET_KEY_PP,
      },
    });

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME_PDF,
      Key: document.s3Key,
      ResponseContentDisposition: `attachment; filename="${document.fileName}"`,
      ResponseContentType: 'application/pdf',
    });

    const downloadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 }); // 5 minutes

    logger.debug({documentId: req.params.id}, "Download URL generated successfully");
    res.status(200).json({
      success: true,
      data: {
        url: downloadUrl,
        fileName: document.fileName,
      },
    });
  } catch (error) {
    logger.error({documentId: req.params.id, errorMsg: error.message, stack: error.stack}, "Error generating download URL");
    res.status(500).json({
      success: false,
      message: 'Failed to generate download URL',
      error: error.message,
    });
  }
};

// Delete document
export const deleteDocument = async (req, res) => {
  try {
    const document = await researchPaperModel.findOne({
      _id: req.params.id,
      userId: req.body.user_id,
    });

    if (!document) {
      logger.warn({documentId: req.params.id, userId: req.body.user_id}, "Document deletion failed: Document not found");
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }

    await researchPaperModel.deleteOne({ _id: req.params.id });

    logger.info({documentId: req.params.id, userId: req.body.user_id}, "Document deleted successfully");
    res.status(200).json({
      success: true,
      message: 'Document deleted successfully',
    });
  } catch (error) {
    logger.error({documentId: req.params.id, errorMsg: error.message, stack: error.stack}, "Error deleting document");
    res.status(500).json({
      success: false,
      message: 'Failed to delete document',
      error: error.message,
    });
  }
};


// Mark upload as failed
export const markUploadFailed = async (req, res) => {
  try {
    const { documentId , user_id} = req.body;

    const document = await researchPaperModel.findOne({
      _id: documentId,
      userId: user_id,
    });

    if (!document) {
      logger.warn({documentId, user_id}, "Upload failure marking failed: Document not found");
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }

    document.uploadStatus = 'failed';
    await document.save();

    logger.info({documentId, user_id}, "Upload marked as failed successfully");
    res.status(200).json({
      success: true,
      message: 'Upload marked as failed',
    });
  } catch (error) {
    logger.error({documentId: req.body.documentId, errorMsg: error.message, stack: error.stack}, "Error marking upload as failed");
    res.status(500).json({
      success: false,
      message: 'Failed to update upload status',
      error: error.message,
    });
  }
};

export const getAllPapers = async(req, res)=> {
  try{
    const researchPapers = await researchPaperModel.find().populate('Authors', 'FullName');

    logger.debug({paperCount: researchPapers.length}, "All research papers retrieved successfully");
    return res.status(200).json({msg: "Successfully retrieved all papers", data: researchPapers});
  }catch(err){
    logger.error({errorMsg: err.message, stack: err.stack}, "Error fetching research papers");
    return res.status(500).json({msg: "Internal Server Error"});
  }
}

export const findSimilarPapers = async (req, res) => {
  try {
    const paper = await researchPaperModel.findById(req.params.id);
    if (!paper) {
      logger.debug({paperId: req.params.id}, "Paper not found for similarity search");
      return res.status(404).json({ message: "Paper not found" });
    }

    const similarPapers = await researchPaperModel.find({
      _id: { $ne: paper._id }, // exclude current paper
      tags: { $in: paper.tags }, // match at least one tag
    }).limit(5).populate('Authors', 'FullName');

    logger.debug({paperId: req.params.id, similarCount: similarPapers.length}, "Similar papers retrieved successfully");
    res.json(similarPapers);
  } catch (err) {
    logger.error({paperId: req.params.id, errorMsg: err.message, stack: err.stack}, "Error finding similar papers");
    res.status(500).json({ message: err.message });
  }
}