const multer = require('multer');
const fs = require('fs-extra');
const { uuid } = require('uuidv4'); // 13fj11j=1f1ff2fh2ef9 - f22u239u32jnvsj8wv

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let path = './backend/src/public/uploads/' + file.fieldname;  // .../products
        if(!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
        req.imgUrl = path;
        cb(null, path);
    },
    filename: (req, file, cb) => { // image.png -> ext = png, jpg, etc ...
        let ext = file.originalname.substring(file.originalname.lastIndexOf('.'));
        cb(null, uuid().substring(0,8) + ext); // 23f2ejf5.png
    }
})

const upload = multer({
    storage: storage,
    limits: { fields:  2 * 1024 * 1024 }
})

module.exports = upload;

// ./backend/src/resrouces/middlewares = __dirname

// CKEDITOR