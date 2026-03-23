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
  getFeaturedPublication,
  trackView,
  trackShare,
  getAnalytics,
} from '../Controllers/researchPaperController.js';
import {uploadLimiter} from '../utils/Production/rateLimiter.js';
import authenticateToken from '../Controllers/tokenControllers.js';
import requirePermission from '../middleware/requirePermission.js';

const researchPaperRouter = express.Router();

researchPaperRouter.post('/presigned-url', uploadLimiter,authenticateToken, requirePermission("manage_publications"), getPresignedUrl);
researchPaperRouter.post('/confirm-upload', authenticateToken, confirmUpload);
researchPaperRouter.get('/getPapers', getAllPapers);
researchPaperRouter.get('/', authenticateToken, getUserDocuments);
researchPaperRouter.get('/getPaperById/:id', getDocument);
researchPaperRouter.post('/:id/track-view',  trackView);
researchPaperRouter.post('/:id/track-share', authenticateToken, trackShare);
researchPaperRouter.get(
  '/:id/analytics',
  authenticateToken,
  requirePermission('view_publication_analytics'),
  getAnalytics
);
researchPaperRouter.get('/:id/view-url' ,getViewUrl);       
researchPaperRouter.get('/:id/download-url', authenticateToken, requirePermission("download_publication"), getDownloadUrl); 
researchPaperRouter.delete('/:id', authenticateToken, requirePermission("manage_publications"), deleteDocument);
researchPaperRouter.post('/mark-failed', authenticateToken, markUploadFailed);
researchPaperRouter.get("/:id/similar", findSimilarPapers );

researchPaperRouter.get("/getFeaturedPublication", getFeaturedPublication)


export default researchPaperRouter;