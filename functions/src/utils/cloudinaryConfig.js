const cloudinary = require('cloudinary');
const { cloudinaryConfig } = require('../config/index');
const { cloud_name, api_key, api_secret } = cloudinaryConfig;

cloudinary.config({
    api_key,
    api_secret,
    cloud_name,
});
const uploads = file => new Promise(resolve => {
    cloudinary.uploader.upload(
        file,
        result => {
            resolve({ id: result.public_id, url: result.secure_url });
        },
        { resource_type: 'video' },
    );
});

module.exports = uploads;
