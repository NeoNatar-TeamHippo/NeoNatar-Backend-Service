const { functions } = require('./firebase');
const cloudinary = require('cloudinary');
const { cloudinaryConfig } = require('../config/index');
const { cloud_name, api_key, api_secret } = cloudinaryConfig;

const { apikey, apisecret, cloudname } = functions.config().cloudinary;
cloudinary.config({
    api_key: apikey,
    api_secret: apisecret,
    cloud_name: cloudname,
});
// cloudinary.config({
//     api_key,
//     api_secret,
//     cloud_name,
// });
const uploads = file => new Promise(resolve => {
    cloudinary.uploader.upload(
        file,
        result => {
            resolve({ id: result.public_id, url: result.secure_url });
        },
        { resource_type: 'video' },
    );
});
const deleteUpload = id => cloudinary.uploader.destroy(
    id, result => { console.log(result, `Deleted ${id} successfully`); },
    { resource_type: 'video' }
);

module.exports = { deleteUpload, uploads };
