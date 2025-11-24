import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
dotenv.config();

const s3Client = new S3Client({
  region: process.env.AWS_REGION_PP,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_PP,
    secretAccessKey: process.env.AWS_SECRET_KEY_PP,
  },
});

/**
 * Generate presigned URL for uploading files to S3
 * @param {string} userId - User ID
 * @param {string} fileName - Original file name
 * @param {string} fileType - MIME type
 * @param {string} folder - Folder name (e.g., 'pdfs', 'thumbnails')
 * @param {boolean} isPublic - Whether file should be publicly accessible
 * @returns {Promise<{presignedUrl: string, fileUrl: string, key: string}>}
 */
const generatePresignedUrl = async (
  bucketName,
  userId,
  fileName,
  fileType,
  folder = 'pdfs',
  isPublic = false
) => {
  try {
    // Generate unique file key
    const fileExtension = fileName.split('.').pop();
    const uniqueFileName = `${uuidv4()}.${fileExtension}`;
    const key = `${folder}/${userId}/${uniqueFileName}`;

    // Create S3 command parameters
    const commandParams = {
      Bucket: bucketName,
      Key: key,
      ContentType: fileType,
    };

    // Note: We don't use ACL here because bucket has ACLs disabled
    // Instead, we rely on bucket policy to make thumbnails public

    const command = new PutObjectCommand(commandParams);

    // Generate presigned URL (valid for 5 minutes)
    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 300,
    });

    // Construct the file URL
    const fileUrl = `https://${bucketName}.s3.${process.env.AWS_REGION_PP}.amazonaws.com/${key}`;

    return {
      presignedUrl,
      fileUrl,
      key,
    };
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    throw new Error('Failed to generate presigned URL');
  }
};

export default generatePresignedUrl;