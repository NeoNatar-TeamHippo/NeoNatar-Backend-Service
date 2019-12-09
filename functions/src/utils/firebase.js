const functions = require('firebase-functions');
const admin = require('firebase-admin');
const firebase = require('firebase');
const fieldValue = admin.firestore.FieldValue;
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
    databaseURL: databaseURL,
    storageBucket: storageBucket,
});
firebase.initializeApp(config);
const db = admin.firestore();

module.exports = { admin, db, fieldValue, firebase, functions };
