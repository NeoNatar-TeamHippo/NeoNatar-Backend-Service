const {
    CREATED, OK,
} = require('http-status-codes');

const { db } = require('../utils/firebase');
const validateCampaignInput = require('../validations/campaignInput');
const { getLocationsAmount } = require('../utils/functions');
const { input } = require('../config/constant');
const { pending, approved, live } = input;
const { tryCatchError, validationError } = require('../utils/errorHandler');
const { successNoData, successNoMessage } = require('../utils/successHandler');

const Campaign = {
    /**
	 * The Campaign Routes
	 * @function
	 * @param {object} req - request object
	 * @param {object} res - response object
	 * @return  {Object} result
    */
   
    async adminGetAll(req, res) {
        try {
            const campaigns = [];
            const data = await db.collection('campaigns').get();
            const docs = data.docs;
            for (const doc of docs) {
                const selectedItem = {
                    campaign: doc.data(),
                    id: doc.id,
                };
                campaigns.push(selectedItem);
            }
            return successNoMessage(res, OK, campaigns);
        } catch (error) {
            tryCatchError(res, error);
        }
    },

    async adminGetOne(req, res) {
        try {
            const document = db.collection('campaigns').doc(req.params.id);
            if (!document) {
                return validationError(res, 'Document not found');
            }
            const documentData = await document.get();
            const campaign = documentData.data();
            return successNoMessage(res, OK, campaign);
        } catch (error) {
            tryCatchError(res, error);
        }
    },

    async campaignApproved(req, res) {
        try {
            const document = db.collection('campaigns').doc(req.params.id);
            if (!document) validationError(res, errors);
            req.body.status = approved;
            req.body.validity = live;
            req.body.approvedAt = new Date().toISOString();
            if (valid) {
                await document.update(req.body);
                return successNoData(res, CREATED, 'campaign successfully updated');
            }
        } catch (error) {
            tryCatchError(res, error);
        }
    },

    async create(req, res) {
        try {
            const { valid, errors } = await validateCampaignInput(req.body);
            if (!valid) validationError(res, errors);
            req.body.createdAt = new Date().toISOString();
            req.body.createdBy = req.user.uid;
            req.body.status = pending;
            req.body.numberOfLocation = req.body.locationsSelected.length;
            let amount = await getLocationsAmount(req.body.locationsSelected);
            amount = amount.reduce((a, b) => a + b, 0);
            req.body.amount = amount * req.body.duration;
            if (valid) {
                await db.collection('campaigns').doc().create(req.body);
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
            const campaigns = [];
            const { uid } = req.user;
            const data = await db.collection('campaigns').where('createdBy', '==', uid)
                .orderBy('createdAt', 'desc').get();
            const docs = data.docs;
            for (const doc of docs) {
                const selectedItem = {
                    campaign: doc.data(),
                    id: doc.id,
                };
                campaigns.push(selectedItem);
            }
            return successNoMessage(res, OK, campaigns);
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
            const campaign = documentData.data();
            if (campaign.createdBy !== req.user.uid) {
                return validationError(res, 'Not Authorized');
            }
            return successNoMessage(res, OK, campaign);
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
