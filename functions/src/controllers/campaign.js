const {
    CREATED, OK,
} = require('http-status-codes');

const { db } = require('../utils/firebase');
const validateCampaignInput = require('../validations/campaignInput');
const { getLocationsAmount } = require('../utils/functions');
const { input } = require('../config/constant');
const { pending, live } = input;
const { tryCatchError, validationError } = require('../utils/errorHandler');
const { successNoData, successNoMessage } = require('../utils/successHandler');
const { campaignResponseData,
    createCampaignData, singleCampaignResponseData } = require('../utils/functions');

const Campaign = {
    /**
	 * The Campaign Routes
	 * @function
	 * @param {object} req - request object
	 * @param {object} res - response object
	 * @return  {Object} result
    */
    async campaignApproved(req, res) {
        try {
            const document = db.collection('campaigns').doc(req.params.id);
            if (!document) validationError(res, errors);
            req.body.status = live;
            req.body.approvedAt = new Date().toISOString();
            await document.update(req.body);
            return successNoData(res, CREATED, 'campaign successfully updated');
        } catch (error) {
            tryCatchError(res, error);
        }
    },

    async create(req, res) {
        try {
            const { userId } = req.user;
            const { valid, errors } = await validateCampaignInput(req.body);
            if (!valid) validationError(res, errors);
            const campaignData = await createCampaignData(req.body, userId);
            if (valid) {
                await db.collection('campaigns').doc().create(campaignData);
                return successNoData(res, CREATED, 'Campaign successfully created');
            }
        } catch (error) {
            return tryCatchError(res, error);
        }
    },

    async deleteCampaign(req, res) {
        try {
            const campaign = await db.collection('campaigns').doc(req.params.id);
            if (!campaign) {
                return validationError(res, 'campaign not found');
            }
            await campaign.delete();
            return successNoData(res, OK, 'Campaign deleted successfully');
        } catch (error) {
            tryCatchError(res, error);
        }
    },

    async getAll(req, res) {
        try {
            const { userId, isAdmin } = req.user; let data;
            if (isAdmin) data = await db.collection('campaigns')
                .orderBy('createdAt', 'desc').get();
            else data = await db.collection('campaigns').where('createdBy', '==', userId)
                .orderBy('createdAt', 'desc').get();
            const { docs } = data;
            const retrievedUsers = docs.map(async doc => {
                const userData = await db.collection('users')
                    .where('userId', '==', doc.data().createdBy).get();
                const responseData = campaignResponseData(doc, userData);
                return responseData;
            });
            const campaignsAndUsers = await Promise.all(retrievedUsers);
            return successNoMessage(res, OK, campaignsAndUsers);
        } catch (error) {
            tryCatchError(res, error);
        }
    },

    async getOne(req, res) {
        try {
            const document = db.collection('campaigns').doc(req.params.id);
            if (!document) {
                return validationError(res, 'Document not found');
            }
            const documentData = await document.get();
            const complainantId = documentData.data().createdBy;
            const data = await db.collection('users')
                .where('userId', '==', complainantId).get();
            const responseData = await singleCampaignResponseData(documentData);
            return successNoMessage(res, OK, responseData);
        } catch (error) {
            tryCatchError(res, error);
        }
    },

    async updateCampaign(req, res) {
        try {
            const document = db.collection('campaigns').doc(req.params.id);
            if (!document) validationError(res, errors);
            const { valid, errors } = await validateCampaignInput(req.body);
            if (!valid) validationError(res, errors);
            req.body.updatedAt = new Date().toISOString();
            req.body.updatedBy = req.user.uid;
            let amount = await getLocationsAmount(req.body.locationsSelected);
            amount = amount.reduce((a, b) => a + b, 0);
            req.body.amount = amount * req.body.duration;
            if (valid) {
                await document.update(req.body);
                return successNoData(res, CREATED, 'campaign successfully updated');
            }
        } catch (error) {
            tryCatchError(res, error);
        }
    },
};

module.exports = Campaign;
