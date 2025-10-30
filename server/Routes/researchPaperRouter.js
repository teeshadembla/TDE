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
  markUploadFailed 
} from '../Controllers/researchPaperController.js';
import authenticateToken from '../Controllers/tokenControllers.js';

const researchPaperRouter = express.Router();

researchPaperRouter.post('/presigned-url', authenticateToken, getPresignedUrl);
researchPaperRouter.post('/confirm-upload', authenticateToken, confirmUpload);
researchPaperRouter.get('/', authenticateToken, getUserDocuments);
researchPaperRouter.get('/:id', authenticateToken, getDocument);
researchPaperRouter.get('/:id/view-url', authenticateToken, getViewUrl);       
researchPaperRouter.get('/:id/download-url', authenticateToken, getDownloadUrl); 
researchPaperRouter.delete('/:id', authenticateToken, deleteDocument);
researchPaperRouter.post('/mark-failed', authenticateToken, markUploadFailed);

export default researchPaperRouter;