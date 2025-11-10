import mongoose from 'mongoose';

const researchPaperSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  s3Url: {
    type: String,
    required: true,
  },
  s3Key: {
    type: String,
    required: true,
    unique: true,
  },
  thumbnailUrl: {
    type: String,
    required: true,
  },
  thumbnailKey: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  mimeType: {
    type: String,
    required: true,
    default: 'application/pdf',
  },
  uploadStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
    index: true,
  },
  title:{
    type: String,
    required: true,
  },
  subtitle:{
    type: String,
    required: true,
  },
  publishingDate: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  workgroupId :{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workgroup',
  },
  Authors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }],
  documentType:{
    type: String,
    enum: ['Report','Opinion Piece','Policy Paper','Position Paper','Industry Insight','Research Article'],
    required: true
  },
  tags:[{
    type: String,
  }],
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Index for faster queries
researchPaperSchema.index({ userId: 1, uploadStatus: 1 });
researchPaperSchema.index({ uploadedAt: -1 });

const researchPaperModel = mongoose.model('research-paper', researchPaperSchema);

export default researchPaperModel;