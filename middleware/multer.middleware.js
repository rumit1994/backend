import multer from 'multer';
import path from 'path'
 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './upload')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
 function checkFileType(file, cb, allowedTypes){
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
 
  if (mimetype && extname) {
    return cb(null, true)
  } else{
    cb(`Error: Invalid file type. Allowed types are: ${allowedTypes}`)
  }
}
 
const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    if (file.fieldname === "ProfileImage") {
      const allowedTypes = /jpeg|jpg|png|gif/;
      checkFileType(file, cb, allowedTypes);
    } else if (file.fieldname === "videoUploads") {
      const allowedTypes = /mp4/;
      checkFileType(file, cb, allowedTypes);
    } else {
      cb(new Error("Error: Unsupported file"));
    }
  }
})

export default upload