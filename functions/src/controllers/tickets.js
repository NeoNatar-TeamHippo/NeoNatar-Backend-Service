const { CREATED, OK } = require('http-status-codes');
const { db, fieldValue } = require('../utils/firebase');
const { validationError, tryCatchError } = require('../utils/errorHandler');
const { successNoData, successWithData, successNoMessage } = require('../utils/successHandler');
const { validateTicketData, validateMessageData } = require('../validations/ticket');
const { 
    createMessageData, 
    createTicketData, 
    createTicketResponseData,
} = require('../utils/functions');
class ticketController {
    /**
	 * Creates a new ticket, only authorized user can do so
	 * @function
	 * @param {object} req - request object
	 * @param {object} res - response object
	 * @return  {Object} result
	 */
    static async create(req, res) {
        try {
            const { title, priority } = req.body;
            const { userId } = req.user;
            const { valid, errors } = validateTicketData(req.body);
            if (!valid) return validationError(res, errors);
            const ticketData = createTicketData(title, priority, userId);
            await db.collection('tickets').add(ticketData);
            return successNoData(res, CREATED, `New ticket created`);
        } catch (error) {
            return tryCatchError(res, error);
        }
    }
    /**
    * Add messages to a ticket
    * @function
    * @param {object} req - request object
    * @param {object} res - response object
    * @return  {Object} result
    */
    static async addMessage(req, res) {
        try {
            const { body } = req.body;
            const { isAdmin, userId } = req.user;
            const { id } = req.params;
            let status = 'new';
            const { valid, errors } = validateMessageData(req.body);
            if (!valid) return validationError(res, errors);
            const messageData = createMessageData(body, isAdmin, userId);
            const docRef = db.collection('tickets').doc(id);
            if (isAdmin) status = 'pending';
            await docRef.update({
                messages: fieldValue.arrayUnion(messageData),
                status,
            });
            return successNoData(res, OK, 'Message added');
        } catch (error) {
            return tryCatchError(res, error);
        }
    }
    /**
    * Get single ticket
    * @function
    * @param {object} req - request object
    * @param {object} res - response object
    * @return  {Object} result
    */
    static async getOne(req, res) {
        try {
            const { id } = req.params;
            const doc = await db.collection('tickets').doc(id).get();
            const ticket = doc.data();
            const complainantId = ticket.createdBy;
            const data = await db.collection('users')
                .where('userId', '==', complainantId).get();
            const user = data.docs[0].data();
            const ticketData = { ticket, user };
            return successNoMessage(res, OK, ticketData);
        } catch (error) {
            return tryCatchError(res, error);
        }
    }
    /**
   * Get all new tickets created by the particular user
   * @function
   * @param {object} req - request object
   * @param {object} res - response object
   * @return  {Object} result
   */
    static async getAllNew(req, res) {
        try {
            const { userId, isAdmin } = req.user;
            let data;
            if (isAdmin) data = await db.collection('tickets').where('status', '==', 'new')
                .orderBy('createdAt', 'desc').get();
            else data = await db.collection('tickets').where('createdBy', '==', userId)
                .where('status', '==', 'new').orderBy('createdAt', 'desc').get();
            const { docs } = data;
            const retrievedUsers = docs.map(async doc => {
                const userData = await db.collection('users')
                    .where('userId', '==', doc.data().createdBy).get();
                const ticketResponseData = createTicketResponseData(doc, userData);
                return ticketResponseData;
            }); const ticketsAndUsers = await Promise.all(retrievedUsers);
            return successNoMessage(res, OK, ticketsAndUsers);
        } catch (error) {
            return tryCatchError(res, error);
        }
    }
    /**
   * Get all pending tickets created by the particular user
   * @function
   * @param {object} req - request object
   * @param {object} res - response object
   * @return  {Object} result
   */
    static async getAllPending(req, res) {
        try {
            const { userId, isAdmin } = req.user;
            let data;
            if (isAdmin) data = await db.collection('tickets').where('status', '==', 'pending')
                .orderBy('createdAt', 'desc').get();
            else data = await db.collection('tickets').where('createdBy', '==', userId)
                .where('status', '==', 'pending').orderBy('createdAt', 'desc').get();
            const { docs } = data;
            const retrievedUsers = docs.map(async doc => {
                const userData = await db.collection('users')
                    .where('userId', '==', doc.data().createdBy).get();
                const ticketResponseData = createTicketResponseData(doc, userData);
                return ticketResponseData;
            }); const ticketsAndUsers = await Promise.all(retrievedUsers);
            return successNoMessage(res, OK, ticketsAndUsers);
        } catch (error) {
            return tryCatchError(res, error);
        }
    }
    /**
   * Get all resolved tickets created by the particular user
   * @function
   * @param {object} req - request object
   * @param {object} res - response object
   * @return  {Object} result
   */
    static async getAllResolved(req, res) {
        try {
            const { userId, isAdmin } = req.user;
            let data;
            if (isAdmin) data = await db.collection('tickets').where('status', '==', 'resolved')
                .orderBy('createdAt', 'desc').get();
            else data = await db.collection('tickets').where('createdBy', '==', userId)
                .where('status', '==', 'resolved').orderBy('createdAt', 'desc').get();
            const { docs } = data;
            const retrievedUsers = docs.map(async doc => {
                const userData = await db.collection('users')
                    .where('userId', '==', doc.data().createdBy).get();
                const ticketResponseData = createTicketResponseData(doc, userData);
                return ticketResponseData;
            }); const ticketsAndUsers = await Promise.all(retrievedUsers);
            return successNoMessage(res, OK, ticketsAndUsers);
        } catch (error) {
            return tryCatchError(res, error);
        }
    }
    /**
   * Get all tickets created by the particular user
   * @function
   * @param {object} req - request object
   * @param {object} res - response object
   * @return  {Object} result
   */
    static async getAll(req, res) {
        try {
            const { userId, isAdmin } = req.user;
            let data;
            if (isAdmin) data = await db.collection('tickets').orderBy('createdAt', 'desc').get();
            else data = await db.collection('tickets').where('createdBy', '==', userId)
                .orderBy('createdAt', 'desc').get();
            const { docs } = data;
            const retrievedUsers = docs.map(async doc => {
                const userData = await db.collection('users')
                    .where('userId', '==', doc.data().createdBy).get();
                const ticketResponseData = createTicketResponseData(doc, userData);
                return ticketResponseData;
            });
            const ticketsAndUsers = await Promise.all(retrievedUsers);
            return successNoMessage(res, OK, ticketsAndUsers);
        } catch (error) {
            return tryCatchError(res, error);
        }
    }
    /**
    * Mark as resolved
    * @function
    * @param {object} req - request object
    * @param {object} res - response object
    * @return  {Object} result
    */
    static async markAsResolved(req, res) {
        try {
            const { id } = req.params;
            const { userId } = req.user;
            const docRef = await db.collection('tickets').doc(id);
            if (!docRef) return validationError(res, 'Ticket does not exist');
            await docRef.update({ resolvedBy: userId, status: 'resolved' });
            return successNoData(res, OK, 'Resolved successfully');
        } catch (error) {
            return tryCatchError(res, error);
        }
    }
}
module.exports = ticketController;
