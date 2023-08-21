const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

async function uploadToS3(req, res, next) {
  console.log("upload to s3");
  if (!req.file) {
    return res.status(400).send("File missing");
  }

  const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID_LOCAL,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_LOCAL,
    },
  });

  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: Date.now().toString() + "-" + req.file.originalname,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  };

  try {
    await s3.send(new PutObjectCommand(uploadParams));
    req.file.location = `https://${uploadParams.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`;
    next();
  } catch (error) {
    res.status(500).send(`Failed to upload file to S3: ${error.message}`);
  }
}

module.exports = {
  uploadToS3,
};
