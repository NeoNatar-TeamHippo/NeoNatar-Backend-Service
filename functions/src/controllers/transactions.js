const { CREATED, OK } = require('http-status-codes');
const { db, fieldValue } = require('../utils/firebase');
const { validationError, tryCatchError } = require('../utils/errorHandler');
const { successNoData, successWithData, successNoMessage } = require('../utils/successHandler');
const { validateTicketData, validateMessageData } = require('../validations/ticket');
const { createTransactionData } = require('../utils/functions');
class transactionController {
    /**
	 * Creates a new transaction, after creating a campaign
	 * @function
	 * @param {object} req - request object
	 * @param {object} res - response object
	 * @return  {Object} result
	 */
    static async create(req, res) {
        try {
            const { campaignId } = req.body;
            const docs = await db.collection('campaigns').doc(campaignId).get();
            const campaignData = docs.data();
            const userId = campaignData.createdBy;
            const data = await db.collection('users')
                .where('userId', '==', userId).get();
            const user = data.docs[0].data();
            const transactionData = createTransactionData(campaignData, user, campaignId);
            await db.collection('transactions').add(transactionData);
            return successNoData(res, CREATED, `New transaction created`);
        } catch (error) {
            return tryCatchError(res, error);
        }
    }

    /**
    * Get single transaction
    * @function
    * @param {object} req - request object
    * @param {object} res - response object
    * @return  {Object} result
    */
    static async getOne(req, res) {
        try {
            const { id } = req.params;
            const doc = await db.collection('transactions').doc(id).get();
            const { campaignId } = doc.data();
            const docs = await db.collection('campaigns').doc(campaignId).get();
            const campaignData = docs.data();
            const userId = campaignData.createdBy;
            const data = await db.collection('users')
                .where('userId', '==', userId).get();
            const user = data.docs[0].data();
            const transactionData = { campaign: campaignData, user };
            return successNoMessage(res, OK, transactionData);
        } catch (error) {
            return tryCatchError(res, error);
        }
    }
    /**
   * Get all transactions created by the particular user or all transactions as an admin
   * @function
   * @param {object} req - request object
   * @param {object} res - response object
   * @return  {Object} result
   */
    static async getAll(req, res) {
        try {
            const { userId, isAdmin } = req.user;
            let data;
            if (isAdmin) {
                data = await db.collection('transactions').orderBy('createdAt', 'desc').get();
            }
            else {
                data = await db.collection('transactions').where('createdBy', '==', userId)
                    .orderBy('createdAt', 'desc').get();
            }
            const docs = data.docs;
            const transactions = docs.map(doc => ({ id: doc.id, transaction: doc.data() }));
            return successNoMessage(res, OK, transactions);
        } catch (error) {
            return tryCatchError(res, error);
        }
    }
    /**
    * Mark as invalid
    * @function
    * @param {object} req - request object
    * @param {object} res - response object
    * @return  {Object} result
    */
    static async markAsInvalid(req, res) {
        try {
            const { id } = req.params;
            const docRef = await db.collection('transactions').doc(id);
            if (!docRef) return validationError(res, 'Transaction does not exist');
            await docRef.update({ status: 'invalid' });
            return successNoData(res, OK, 'marked as invalid');
        } catch (error) {
            return tryCatchError(res, error);
        }
    }
}
module.exports = transactionController;
