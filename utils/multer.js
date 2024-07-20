const multer = require("multer");
const path = require("path");
const ALLOW_FILE_TYPES = [
  ".jpg",
  ".jpeg",
  ".png",
  ".pdf",
  ".webp",
  ".mp3",
  ".xlsx",
  ".csv",
  ".ico",
  ".svg",
  ".mp4"
];
// Multer config
const uploadDisk = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (
      ext !== ".jpg" &&
      ext !== ".jpeg" &&
      ext !== ".png" &&
      ext !== ".pdf" &&
      ext !== ".xlsx" &&
      ext !== ".ico" &&
      ext !== ".svg" &&
      ext !== ".mp3" &&
      ext !== ".csv" &&
      ext !== ".mp4"
    ) {
      cb(new Error("Unsupported file type!"), false);
      return;
    }
    cb(null, true);
  },
});

const uploadBuffer = multer({
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (!ALLOW_FILE_TYPES.includes(ext)) {
      cb(new Error("Unsupported file type!"), false);
      return;
    }
    cb(null, true);
  },
});
const upload = multer();
const acceptFormData = upload.any();

const getArrayFile = (files, field) => {
  return files.filter((file) => file.fieldname.startsWith(field + "["));
};

const getSingleFileFromArray = async (files, field) => {
  const files2 = files.filter((file) => file.fieldname.startsWith(field + "["));

  return files2.length == 0 ? null : files2[0];
};

module.exports = {
  uploadDisk,
  uploadBuffer,
  acceptFormData,
  getArrayFile,
  getSingleFileFromArray,
};
