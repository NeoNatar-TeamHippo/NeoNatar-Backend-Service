const { OK } = require('http-status-codes');
const { db } = require('../utils/firebase');
const { tryCatchError, validationError } = require('../utils/errorHandler');
const { successNoMessage, successNoData } = require('../utils/successHandler');

class notifications {

    /**
	 * Get all notification, only authenticated users
	 * @function
	 * @param {object} req - request object
	 * @param {object} res - response object
	 * @return  {Object} result
	 */
    static async allNotifications(req, res) {
        try {
            const { userId } = req.user;
            const data = await db.collection('notifications')
                .where('userId', '==', userId).where('read', '==', false)
                .orderBy('createdAt', 'desc').get();
            const docs = data.docs;
            const notifications = docs.map(doc => ({ id: doc.id, notification: doc.data() }));
            if (notifications.length === 0) {
                return validationError(res, 'No New Notifications for this user');
            }
            return successNoMessage(res, OK, notifications);
        } catch (error) {
            return tryCatchError(res, error);
        }
    }

    /**
	 * Update all notification sent, req is an array of ids
	 * @function
	 * @param {object} req - request object
	 * @param {object} res - response object
	 * @return  {Object} result
	 */
    static async markAsRead(req, res) {
        try {
            const batch = db.batch();
            const { id } = req.body;
            id.forEach(notificationId => {
                const notification = db.doc(`notifications/${notificationId}`);
                batch.update(notification, { read: true });
            });
            await batch.commit();
            return successNoData(res, OK, 'Notifications updated succesfully');
        } catch (error) {
            return tryCatchError(res, error);
        }
    }
}
module.exports = notifications;
