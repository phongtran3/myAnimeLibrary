const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const User = require("../models/user");

async function uploadToS3(req, res, next) {
  if (!req.file) {
    return res.status(400).send("File missing");
  }
  const { id } = req.params;

  const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: Date.now().toString() + "-" + req.file.originalname,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  };

  try {
    const user = await User.findById(id);
    const imageName = user.picturePath.split("/").pop();
    //If user exist, delete the existing object in s3
    if (user && user.picturePath) {
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imageName,
      };
      const command = new DeleteObjectCommand(params);
      await s3.send(command);
    }

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
