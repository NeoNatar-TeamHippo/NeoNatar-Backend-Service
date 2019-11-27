const functions = require('firebase-functions');
const admin = require('firebase-admin');
const firebase = require('firebase');
const config = require('../config/index');
const serviceAccount = require('./firebaseAdmin');
const firebaseConfig = {
    apiKey: config.firebaseConfig.apiKey,
    appId: config.firebaseConfig.appId,
    authDomain: config.firebaseConfig.authDomain,
    databaseURL: config.firebaseConfig.databaseURL,
    measurementId: config.firebaseConfig.measurementId,
    messagingSenderId: config.firebaseConfig.messagingSenderId,
    projectId: config.firebaseConfig.projectId,
    storageBucket: config.firebaseConfig.storageBucket,
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: config.firebaseConfig.databaseURL,
    storageBucket: config.firebaseConfig.storageBucket,
});
firebase.initializeApp(firebaseConfig);

module.exports = { admin, firebase, functions };
