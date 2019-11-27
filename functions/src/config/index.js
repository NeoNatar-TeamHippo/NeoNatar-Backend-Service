const dotenv = require('dotenv');
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const envFound = dotenv.config();
if (!envFound) {
    throw new Error("⚠️  Couldn't find .env file  ⚠️");
}
module.exports = {
    adminConfig: {
        auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_x509_CERT_URL,
        auth_uri: process.env.AUTH_URI,
        client_email: process.env.CLIENT_EMAIL,
        client_id: process.env.CLIENT_ID,
        client_x509_cert_url: process.env.CLIENT_x509_CERT_URL,
        private_key: process.env.PRIVATE_KEY,
        private_key_id: process.env.PRIVATE_KEY_ID,
        project_id: process.env.PROJECT_ID,
        token_uri: process.env.TOKEN_URI,
        type: process.env.TYPE,
    },
    firebaseConfig: {
        apiKey: process.env.APIKEY,
        appId: process.env.APPID,
        authDomain: process.env.AUTHDOMAIN,
        databaseURL: process.env.DATABASEURL,
        measurementId: process.env.MEASUREMENTID,
        messagingSenderId: process.env.MESSAGINGSENDERID,
        projectId: process.env.PROJECT_ID,
        storageBucket: process.env.STORAGE_BUCKET,
    },

};
