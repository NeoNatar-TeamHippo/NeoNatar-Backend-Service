const cloudinary = require('cloudinary');
const { cloudinaryConfig } = require('../config/index');
const { cloud_name, api_key, api_secret } = cloudinaryConfig;

cloudinary.config({
    api_key,
    api_secret,
    cloud_name,
});
const uploads = file => new Promise(resolve => {
    cloudinary.v2.uploader.upload(
        file,
        result => {
            resolve({ id: result.public_id, url: result.secure_url });
        },
        { resource_type: 'video' },
    );
});
const deleteUpload = async id => {
    try {
        const result = await cloudinary.v2.uploader.destroy(id);
        if (result) return true;
    } catch (error) {
        console.error(error);
    }
};

module.exports = { deleteUpload, uploads };
