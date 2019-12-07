const { getVideoDurationInSeconds } = require('get-video-duration');
const { firebaseConfig } = require('../config/index');
const { db, admin } = require('../utils/firebase');
const { deleteUpload, uploads } = require('../utils/cloudinaryConfig');
const url = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}`;
const amt = 'alt=media&token=';
const getFirebaseLink = (filename, token) => `${url}/o/${filename}?${amt}${token}`;
const createUserData = (avatar, email, firstName, lastName, userId, isAdmin) => ({
    avatar,
    createdAt: new Date().toISOString(),
    email,
    firstName,
    isAdmin,
    lastName,
    role: isAdmin ? 'manager' : '',
    status: 'active',
    userId,
});
const superAdmin = (isAdmin, role, status) => {
    if (isAdmin && role === 'superAdmin' && status === 'active') {
        return true;
    }
    else return false;
};
const uploadRequest = async ({ filepath, mimetype }, token) => {
    try {
        return await admin.storage().bucket().upload(filepath, {
            metadata: {
                metadata: {
                    contentType: mimetype,
                    firebaseStorageDownloadTokens: token,
                },
            },
            resumable: false,
        });
    } catch (error) {
        console.error(error);
    }
};
const updateVideo = async (videoId, filePath, { description, title }) => {
    try {
        const { url, id } = await uploads(filePath);
        const duration = await getVideoDurationInSeconds(filePath);
        await deleteUpload(videoId);
        const updatedObj = {
            description, duration: Math.round(duration), title, updatedAt: new Date().toISOString(),
            url, videoId: id,
        };
        return updatedObj;
    } catch (error) {
        console.error(error);
    }
};
const getLocationdata = async location => {
    const amount = await db.collection('locations').doc(location);
    const documentData = await amount.get();
    const data = documentData.data().price;
    return Number(data);
};
const getLocationsAmount = async locationarray => {
    const price = [];
    locationarray.forEach(location => {
        price.push(getLocationdata(location));
    });
    return await Promise.all(price);
};
const uploadMultipleImages = async (images, token) => {
    const promises = [];
    images.forEach(image => {
        promises.push(uploadRequest(image, token));

    });
    return await Promise.all(promises);
};
const getMultipleFirebaseLink = async (images, token) => {
    const promises = [];
    images.forEach(image => {
        promises.push(getFirebaseLink(image.originalname, token));
    });
    return await Promise.all(promises);
}; 
module.exports = {
    createUserData, getFirebaseLink, getLocationsAmount, getMultipleFirebaseLink, superAdmin, 
    updateVideo, uploadMultipleImages, uploadRequest,
};
