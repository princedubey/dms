import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const awsS3 = async (file) => {  
  if (!file) {
    throw new Error('No file uploaded!');
  }

  if (!process.env.AWS_S3_BUCKET_NAME || !process.env.AWS_REGION) {
    throw new Error('S3 configuration is missing in environment variables.');
  }

  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `${Date.now()}_${file.name}`, // Use file.name instead of originalname
      Body: file, // Directly use the File object from FormData
      ContentType: file.type, // Use file.type instead of mimetype
    },
  });

  try {
    const data = await upload.done(); // Wait for the upload to complete
    const url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${data.Key}`;
    return { Location: url }; // Return the URL of the uploaded file
  } catch (error) {
    console.error('Error uploading to S3:', error.message);
    throw new Error('Failed to upload file to S3.');
  }
};

export default awsS3;
