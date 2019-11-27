const functions = require('firebase-functions');
const admin = require('firebase-admin');
const firebase = require('firebase');
const { firebaseConfig } = require('../config/index');
const { apiKey, appId, authDomain, databaseURL, measurementId,
    messagingSenderId, projectId, storageBucket } = firebaseConfig;
const serviceAccount = require('./firebaseAdmin');
const config = {
    apiKey, appId, authDomain, databaseURL, measurementId,
    messagingSenderId, projectId, storageBucket,
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: config.firebaseConfig.databaseURL,
    storageBucket: config.firebaseConfig.storageBucket,
});
firebase.initializeApp(config);

module.exports = { admin, firebase, functions };
