const { getVideoDurationInSeconds } = require('get-video-duration');
const { firebaseConfig } = require('../config/index');
const { input } = require('../config/constant');
const { db, admin } = require('../utils/firebase');
const { deleteUpload, uploads } = require('../utils/cloudinaryConfig');
const { adminImage, author, content1, content2 } = input;
const url = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}`;
const amt = 'alt=media&token=';
/**
    * returns a firebase image url link
    * @function
    * @param {String} filename - the image filename
    * @param {String} token - token to give access
    * @return  {String} url
    */
const getFirebaseLink = (filename, token) => `${url}/o/${filename}?${amt}${token}`;
/**
    * returns a user object created
    * @function
    * @param {String} avatar - the image url
    * @param {String} email - user's email
    * @param {String} firstName - user's firstname
    * @param {String} lastName - user's lastname
    * @param {String} userId - user's id
    * @param {Boolean} isAdmin - user admin status
    * @return  {Object} user object
    */
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
/**
    * returns a ticket created
    * @function
    * @param {String} title - ticket's title
    * @param {String} priority - ticket's priority
    * @param {String} userId - user's id
    * @return  {Object} ticket's object
    */
const createTicketData = (title, priority, userId, userData) => {
    const { avatar, firstName, lastName } = userData.docs[0].data();
    return({
        avatar,
        createdAt: new Date().toISOString(),
        createdBy: userId,
        customerName: `${firstName} ${lastName}`,
        messages: [
            {
                author: author,
                avatar: adminImage,
                content: `${content1} ${content2}`,
                createdAt: new Date().toISOString(),
                isAdmin: true,
            },
        ], priority,
        resolvedBy: '',
        status: 'new', title,
    });
};
/**
    * returns a ticket created
    * @function
    * @param {String} title - ticket's title
    * @param {String} priority - ticket's priority
    * @param {String} userId - user's id
    * @return  {Object} ticket's object
    */
const createCommercialResponseData = doc => {
    const { url, title, description, duration } = doc.data();
    return ({
        description,
        duration,
        id: doc.id,
        title,
        url,
    });
};
/**
    * returns a ticket created
    * @function
    * @param {String} title - ticket's title
    * @param {String} priority - ticket's priority
    * @param {String} userId - user's id
    * @return  {Object} ticket's object
    */
const createTicketResponseData = (doc, userData) => {
    const { status, createdAt, title, priority, messages } = doc.data();
    const { avatar, firstName, lastName } = userData.docs[0].data();
    return ({
        avatar,
        customerName: `${firstName} ${lastName}`,
        date: (new Date(createdAt)).toDateString(),
        messages,
        priority,
        status,
        ticketId: doc.id,
        title,
    });
};
/**
    * returns a ticket created
    * @function
    * @param {String} title - ticket's title
    * @param {String} priority - ticket's priority
    * @param {String} userId - user's id
    * @return  {Object} ticket's object
    */
const camapignResponseData = (doc, userData) => {
    const { status, 
        createdAt, createdBy, numberOfLocations, 
        title, amount, locationsSelected, duration, commerercialId } = doc.data();
    const { firstName, lastName } = userData.docs[0].data();
    return ({
        amount,
        camapaignId: doc.id,
        commerercialId,
        createdAt,
        createdBy,
        customerName: `${firstName} ${lastName}`,
        duration,
        locationsSelected,
        numberOfLocations,
        status,
        title,
    });
};
/**
    * returns a message object created
    * @function
    * @param {String} body - message body
    * @param {Boolean} isAdmin - user admin status
    * @param {String} userId - user's id
    * @return  {Object} message's object
    */
const createMessageData = (body, isAdmin, userData) => {
    if(isAdmin) {
        return ({
            author: 'Neonatar Admin',
            avatar: adminImage,
            content: body,
            createdAt: new Date().toISOString(),
            isAdmin,
        });
    }
    if(!isAdmin) {
        const { avatar, firstName, lastName } = userData.docs[0].data();
        return ({
            author: `${firstName} ${lastName}`,
            avatar,
            content: body,
            createdAt: new Date().toISOString(),isAdmin,
        });
    }
};
/**
    * returns a a boolean to check if a user is a super admin or not
    * @function
    * @param {String} role - user's role
    * @param {Boolean} isAdmin - user admin status
    * @param {String} status - user's status
    * @return  {Boolean} result
    */
const superAdmin = (isAdmin, role, status) => {
    if (isAdmin && role === 'superAdmin' && status === 'active') {
        return true;
    }
    else return false;
};
/**
    * function to handle image upload
    * @function
    * @param {Object} - image object
    * @param {String} token - token to handle image authorization
    * @return  {Boolean} result
    */
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
/**
    * function to handle video upload
    * @function
    * @param {String} videoId - video id gotten from cloudinary
    * @param {String} filePath - video file path gotten from busboy
    * @param {Object} - description and title
    * @param {String} token - token to handle image authorization
    * @return  {Boolean} result
    */
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
    const promises = images.map(image => uploadRequest(image, token));
    return await Promise.all(promises);
};
const getMultipleFirebaseLink = async (images, token) => {
    const promises = images.map(image => getFirebaseLink(image.originalname, token));
    return await Promise.all(promises);
}; 
module.exports = {
    camapignResponseData,
    createCommercialResponseData,
    createMessageData,
    createTicketData,
    createTicketResponseData,
    createUserData,
    getFirebaseLink,
    getLocationsAmount,
    getMultipleFirebaseLink,
    superAdmin,
    updateVideo,
    uploadMultipleImages,
    uploadRequest,
};
