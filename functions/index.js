const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const routes = require('./src/routes');
const { functions, db } = require('./src/utils/firebase');
const { sendText } = require('./src/utils/emailService');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan('dev'));
//Use Routes Here
routes.init(app);
//Error Handlers
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        errors: {
            message: err.message,
        },
    });
});
exports.api = functions.region('europe-west1').https.onRequest(app);
exports.signUpEmailNotification = functions.region('europe-west1')
    .firestore.document('users/{userId}').onCreate(async snapshot => {
        try {
            const { email, firstName, lastName, userId } = snapshot.data();
            const receipent = email;
            // TODO: convert this to a html template with its own css served for a better view
            const subject = 'Welcome to NeoNatar';
            const text = `Dear ${firstName} ${lastName},
        reach out to all your esteemed customers using our platform`;
            await sendText(receipent, subject, text);
            const dataToAdd = {
                createdAt: new Date().toISOString(),
                id: userId, message: 'Welcome to NeoNatar',
                read: false, type: 'users', userId,
            };
            return await db.collection('notifications').add(dataToAdd);
        } catch (error) {
            console.log(error);
        }
    });
exports.deactivatedEmailNotification = functions.region('europe-west1')
    .firestore.document('users/{userId}').onUpdate(async change => {
        try {
            const { email, firstName, lastName, status, userId } = change.before.data();
            const statusBefore = change.before.data().status;
            const statusAfter = change.after.data().status;
            if (statusBefore !== statusAfter) {
                const receipent = email, subject = `${statusAfter}ed from NeoNatar`;
                const text = `Dear ${firstName} ${lastName}, due to some reasons you
                have been deactivated, please contact the admins`;
                await sendText(receipent, subject, text);
                const dataToAdd = {
                    createdAt: new Date().toISOString(), id: userId,
                    message: `${statusAfter}ed from NeoNatar`, read: false, type: 'users', userId,
                };
                return await db.collection('notifications').add(dataToAdd);
            }
        } catch (error) {
            console.log(error);
        }
    });
exports.newCommercialNotification = functions.region('europe-west1')
    .firestore.document('commercials/{commercialId}').onCreate(async snapshot => {
        try {
            const { id } = snapshot;
            const { createdBy } = snapshot.data();
            const dataToAdd = {
                commercialId: id, createdAt: new Date().toISOString(),
                message: 'New Commercial Uploaded',
                read: false, type: 'commercials', userId: createdBy,
            };
            return await db.collection('notifications').add(dataToAdd);
        } catch (error) {
            console.log(error);
        }
    });
exports.newLocationNotification = functions.region('europe-west1')
    .firestore.document('locations/{locationId}').onCreate(async snapshot => {
        try {
            const { id } = snapshot;
            const { createdBy } = snapshot.data();
            const dataToAdd = {
                createdAt: new Date().toISOString(), locationId: id,
                message: 'New Location Uploaded',
                read: false, type: 'locations', userId: createdBy,
            };
            return await db.collection('notifications').add(dataToAdd);
        } catch (error) {
            console.log(error);
        }
    });
exports.newTransactionNotification = functions.region('europe-west1')
    .firestore.document('campaigns/{campaignId}').onCreate(async snapshot => {
        try {
            const { id: campaignId } = snapshot;
            const { createdBy } = snapshot.data();
            const dataToAdd = {
                campaignId: id, createdAt: new Date().toISOString(),
                message: 'New Campaign Created', read: false, type: 'campaign', userId: createdBy,
            };
            await db.collection('notifications').add(dataToAdd);
            const docs = await db.collection('campaigns').doc(campaignId).get();
            const campaignData = docs.data();
            const userId = campaignData.createdBy;
            const data = await db.collection('users').where('userId', '==', userId).get();
            const user = data.docs[0].data();
            const transactionData = createTransactionData(campaignData, user, campaignId);
            return await db.collection('transactions').add(transactionData);
        } catch (error) {
            console.log(error);
        }
    });
