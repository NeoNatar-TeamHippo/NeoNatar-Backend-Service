const { firebaseConfig } = require('../config/index');
// eslint-disable-next-line max-len
const getFirebaseLink = filename => `https://firebaseestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${filename}?alt=media`;
const createUserData = (avatar, email, firstName, lastName, userId) => ({
    avatar,
    createdAt: new Date().toISOString(),
    email,
    firstName,
    isAdmin: false,
    lastName,
    role: '',
    status: 'active',
    userId,
});
module.exports = {
    createUserData, getFirebaseLink,
};
