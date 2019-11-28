const { firebaseConfig } = require('../config/index');
const getFirebaseLink = filename => `https://firebaseestorage.googleapis.com/v0/b/
    ${firebaseConfig.storageBucket}/o/
    ${filename}?alt=media`;
module.exports = {
    getFirebaseLink,
};
