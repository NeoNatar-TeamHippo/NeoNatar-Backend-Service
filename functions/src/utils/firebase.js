const functions = require('firebase-functions');
const admin = require('firebase-admin');
const config = require('../config/index');

const serviceAccount = require('./firebaseAdmin');
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: config.firebaseConfig.databaseURL,
});
const db = admin.firestore();

module.exports = { db, functions };
