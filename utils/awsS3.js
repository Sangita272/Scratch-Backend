const AWS = require("aws-sdk");
const s3 = new AWS.S3();

AWS.config.setPromisesDependency(require("bluebird"));
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

exports.awsS3BucketUpload = async (params) => {
  try {
    let r = (Math.random() + 1).toString(36).substring(7);
    const s3KeyId =
      "storage/" + params.folder + "/" + r + params.file.originalname;
    const paramsData = {
      Bucket: process.env.AWS_S3_BUCKET_OPEN,
      Key: `${s3KeyId}`,
      Body: params.file.buffer,
     // ACL: "public-read",
      ContentType: params.file.mimetype,
    };
    let upload = await s3.upload(paramsData).promise();
    const headObjectOutput = await s3.headObject({
        Bucket: process.env.AWS_S3_BUCKET_OPEN,
        Key: `${s3KeyId}`,
      }).promise();
      const fileSizeInBytes = headObjectOutput.ContentLength;
    let { Location: location, Key: key } = upload;
    if (key.includes("/")) {
      key = key.split("/")[1];
    }
    return { status: 200, location, key, size: fileSizeInBytes, data: upload };
  } catch (err) {
    return { status: 400, message: err.message };
  }
};
