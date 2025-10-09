import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

// Configure AWS SDK
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

/**
 * Upload file to S3
 * @param {Buffer} fileBuffer - The file buffer from multer
 * @param {String} fileName - Original filename
 * @param {String} mimetype - File mimetype
 * @param {String} folder - Folder path in S3 (e.g., 'profile-pictures' or 'research-papers')
 * @returns {Promise<String>} - Returns the S3 file URL
 */
export const uploadToS3 = async (fileBuffer, fileName, mimetype, folder = 'profile-pictures') => {
    const timestamp = Date.now();
    const key = `${folder}/${timestamp}-${fileName}`;

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME_PP,
        Key: key,
        Body: fileBuffer,
        ContentType: mimetype,
        // ACL: 'public-read' // Removed as we're using bucket policy for public access
    };

    try {
        const result = await s3.upload(params).promise();
        return result.Location; // Returns the full URL
    } catch (error) {
        console.error('Error uploading to S3:', error);
        throw new Error('Failed to upload file to S3');
    }
};

/**
 * Delete file from S3
 * @param {String} fileUrl - The full S3 URL of the file
 * @returns {Promise<Boolean>}
 */
export const deleteFromS3 = async (fileUrl) => {
    // Extract the key from the full URL
    const url = new URL(fileUrl);
    const key = url.pathname.substring(1); // Remove leading '/'

    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key
    };

    try {
        await s3.deleteObject(params).promise();
        return true;
    } catch (error) {
        console.error('Error deleting from S3:', error);
        throw new Error('Failed to delete file from S3');
    }
};

/**
 * Get presigned URL for temporary access to private files
 * @param {String} key - The S3 object key
 * @param {Number} expiresIn - Expiration time in seconds (default 1 hour)
 * @returns {String} - Presigned URL
 */
export const getPresignedUrl = (key, expiresIn = 3600) => {
    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
        Expires: expiresIn
    };

    return s3.getSignedUrl('getObject', params);
};