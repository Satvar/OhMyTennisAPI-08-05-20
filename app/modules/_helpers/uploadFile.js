const multer = require("multer");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    //console.log("filessss", file)
    cb(null, "./upload");
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  //console.log("ffdfdsf", file)
  if (
    (file.fieldname === "Coach_Image" ||
      file.fieldname === "User_profileimage" ||
      file.fieldname === "Course_Image") &&
    (file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/png")
  ) {
    cb(null, true);
  } else if (
    file.fieldname === "Coach_Resume" &&
    (file.mimetype === "application/pdf" ||
      file.mimetype === "application/doc" ||
      file.mimetype === "application/docx")
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

module.exports = upload;
