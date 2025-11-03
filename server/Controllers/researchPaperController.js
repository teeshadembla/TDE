import generatePresignedUrl from '../utils/s3presigned.js';
import researchPaperModel from '../Models/researchPaperModel.js';

// Step 1: Get presigned URLs (for both PDF and thumbnail)
export const getPresignedUrl = async (req, res) => {
  try {
    const { fileName, fileType, fileSize, thumbnailType } = req.body;

    // Validation
    if (!fileName || !fileType || !fileSize || !thumbnailType) {
      return res.status(400).json({
        success: false,
        message: 'fileName, fileType, fileSize, and thumbnailType are required',
      });
    }

    // Check PDF file type
    if (fileType !== 'application/pdf') {
      return res.status(400).json({
        success: false,
        message: 'Only PDF files are allowed',
      });
    }

    // Check thumbnail file type
    if (!thumbnailType.startsWith('image/')) {
      return res.status(400).json({
        success: false,
        message: 'Thumbnail must be an image file',
      });
    }

    // Check file size (100MB limit for PDF)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (fileSize > maxSize) {
      return res.status(400).json({
        success: false,
        message: 'File size exceeds 100MB limit',
      });
    }

    // Generate presigned URL for PDF
    const { presignedUrl: pdfPresignedUrl, fileUrl: pdfFileUrl, key: pdfKey } = 
      await generatePresignedUrl(
        req.user._id,
        fileName,
        fileType,
        'pdfs' // folder name
      );

    // Generate presigned URL for thumbnail
    const thumbnailFileName = fileName.replace('.pdf', '.jpg');
    const { presignedUrl: thumbnailPresignedUrl, fileUrl: thumbnailFileUrl, key: thumbnailKey } = 
      await generatePresignedUrl(
        req.user._id,
        thumbnailFileName,
        thumbnailType,
        'thumbnails' // folder name - bucket policy makes this public
      );

    // Create document record in pending state
    const document = new researchPaperModel({
      userId: req.user._id,
      fileName: fileName,
      originalName: fileName,
      s3Url: pdfFileUrl,
      s3Key: pdfKey,
      thumbnailUrl: thumbnailFileUrl, // Store public thumbnail URL
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
    console.error('Error generating presigned URL:', error);
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
    const { documentId } = req.body;

    if (!documentId) {
      return res.status(400).json({
        success: false,
        message: 'documentId is required',
      });
    }

    const document = await researchPaperModel.findOne({
      _id: documentId,
      userId: req.user._id,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }

    // Update upload status
    document.uploadStatus = 'completed';
    await document.save();

    res.status(200).json({
      success: true,
      message: 'Upload confirmed successfully',
      data: document,
    });
  } catch (error) {
    console.error('Error confirming upload:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm upload',
      error: error.message,
    });
  }
};


export const getUserDocuments = async (req, res) => {
  try {
    const { status } = req.query;
    
    const query = { userId: req.user._id };
    
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

    res.status(200).json({
      success: true,
      count: documentsWithUrls.length,
      data: documentsWithUrls,
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
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
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }

    res.status(200).json({
      success: true,
      data: document,
    });
  } catch (error) {
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

    res.status(200).json({
      success: true,
      data: {
        url: viewUrl,
        fileName: document.fileName,
      },
    });
  } catch (error) {
    console.error('Error generating view URL:', error);
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

    res.status(200).json({
      success: true,
      data: {
        url: downloadUrl,
        fileName: document.fileName,
      },
    });
  } catch (error) {
    console.error('Error generating download URL:', error);
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
      userId: req.user._id,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }

    // Optional: Delete from S3 as well (both PDF and thumbnail)
    // const { DeleteObjectCommand, S3Client } = require('@aws-sdk/client-s3');
    // const s3Client = new S3Client({ region: process.env.AWS_REGION });
    // 
    // // Delete PDF
    // await s3Client.send(new DeleteObjectCommand({
    //   Bucket: process.env.AWS_S3_PDF_BUCKET_NAME,
    //   Key: document.s3Key,
    // }));
    // 
    // // Delete thumbnail
    // await s3Client.send(new DeleteObjectCommand({
    //   Bucket: process.env.AWS_S3_PDF_BUCKET_NAME,
    //   Key: document.thumbnailKey,
    // }));

    await researchPaperModel.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting document:', error);
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
    const { documentId } = req.body;

    const document = await researchPaperModel.findOne({
      _id: documentId,
      userId: req.user._id,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }

    document.uploadStatus = 'failed';
    await document.save();

    res.status(200).json({
      success: true,
      message: 'Upload marked as failed',
    });
  } catch (error) {
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

    return res.status(200).json({msg: "Successfully retrieved all papers", data: researchPapers});
  }catch(err){
    console.log("This error occurred in the backend while trying to fetch research papers from the database.--->",err);
    return res.status(500).json({msg: "Internal Server Error"});
  }
}

export const findSimilarPapers = async (req, res) => {
  try {
    const paper = await researchPaperModel.findById(req.params.id);
    if (!paper) return res.status(404).json({ message: "Paper not found" });

    const similarPapers = await researchPaperModel.find({
      _id: { $ne: paper._id }, // exclude current paper
      tags: { $in: paper.tags }, // match at least one tag
    }).limit(5).populate('Authors', 'FullName');

    res.json(similarPapers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}