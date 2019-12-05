const Busboy = require('busboy');
const path = require('path');
const os = require('os');
const fs = require('fs');
const { getVideoDurationInSeconds } = require('get-video-duration');
const { validationError, tryCatchError } = require('../utils/errorHandler');
//TODO: fix refactor code to async await and check for limits size for image or video mimetype
/**
 * File Uploader middleware handle multipart data upload to server
 * @function
 * @param {object} req - request object
 * @param {object} res - response object
 * @param {object} next - next function
 * @return  {Object} req.body and req.files
 */
// eslint-disable-next-line max-lines-per-function
exports.filesUpload = function (req, res, next) {
    const busboy = new Busboy({
        headers: req.headers,
        limits: { fileSize: 10 * 1024 * 1024 },
    });
    const fields = {}, files = [], fileWrites = [];
    busboy.on('field', (key, value) => { fields[key] = value; });
    // eslint-disable-next-line max-lines-per-function
    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        const imageExtension = filename.split('.')[filename.split('.').length - 1];
        const imageFileName = `${Math.round(Math.random() * 10000000000)}.${imageExtension}`;
        const filepath = path.join(os.tmpdir(), imageFileName);
        const writeStream = fs.createWriteStream(filepath);
        file.pipe(writeStream);
        fileWrites.push(new Promise((resolve, reject) => {
            file.on('end', () => writeStream.end());
            writeStream.on('finish', () => {
                fs.readFile(filepath, (err, buffer) => {
                    const size = Buffer.byteLength(buffer);
                    if (err) return reject(err);
                    files.push({
                        buffer, encoding,
                        fieldname, filepath, mimetype, originalname: imageFileName, size,
                    });
                    try {
                        console.log(filepath);
                    } catch (error) {
                        return reject(error);
                    }
                    resolve();
                });
            });
            writeStream.on('error', reject);
        }));
    });
    busboy.on('finish', () => {
        Promise.all(fileWrites)
            .then(() => {
                req.body = fields; req.files = files;
                next(); return true;
            })
            .catch(next);
    });
    busboy.end(req.rawBody);
};
