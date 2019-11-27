const functions = require('firebase-functions');
const admin = require('firebase-admin');
const firebase = require('firebase');
const config = require('../config/index');
const serviceAccount = require('./firebaseAdmin');
const firebaseConfig = {
	apiKey: config.firebaseConfig.apiKey,
	authDomain: config.firebaseConfig.authDomain,
	databaseURL: config.firebaseConfig.databaseURL,
	projectId: config.firebaseConfig.projectId,
	storageBucket: config.firebaseConfig.storageBucket,
	messagingSenderId: config.firebaseConfig.messagingSenderId,
	appId: config.firebaseConfig.appId,
	measurementId: config.firebaseConfig.measurementId,
};

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: config.firebaseConfig.databaseURL,
});
firebase.initializeApp(firebaseConfig);

module.exports = { admin, functions, firebase };
