const multer = require('multer');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            return cb(null, './files/images/');
        }
        else if (file.mimetype === 'video/mp4') {
            return cb(null, './files/videos/');
        }
        else {
            return cb({ message: 'this file is neither a video or image file' }, false);
        }
    },
    filename(req, file, cb) {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage });

module.exports = upload;
