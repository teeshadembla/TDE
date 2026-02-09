// In your routes file
import express from 'express';
import { 
  getPresignedUrl, 
  confirmUpload, 
  getUserDocuments, 
  getDocument,
  getViewUrl,      
  getDownloadUrl,  
  deleteDocument, 
  markUploadFailed,
  getAllPapers,
  findSimilarPapers,
} from '../Controllers/researchPaperController.js';
import {uploadLimiter} from '../utils/Production/rateLimiter.js';
import authenticateToken from '../Controllers/tokenControllers.js';

const researchPaperRouter = express.Router();

researchPaperRouter.post('/presigned-url', uploadLimiter,authenticateToken, getPresignedUrl);
researchPaperRouter.post('/confirm-upload', authenticateToken, confirmUpload);
researchPaperRouter.get('/getPapers', getAllPapers);
researchPaperRouter.get('/', authenticateToken, getUserDocuments);
researchPaperRouter.get('/getPaperById/:id', authenticateToken, getDocument);
researchPaperRouter.get('/:id/view-url', authenticateToken, getViewUrl);       
researchPaperRouter.get('/:id/download-url', authenticateToken, getDownloadUrl); 
researchPaperRouter.delete('/:id', authenticateToken, deleteDocument);
researchPaperRouter.post('/mark-failed', authenticateToken, markUploadFailed);
researchPaperRouter.get("/:id/similar", authenticateToken, findSimilarPapers );


export default researchPaperRouter;