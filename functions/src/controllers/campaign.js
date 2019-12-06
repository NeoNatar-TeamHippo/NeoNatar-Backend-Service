const {
    CREATED, OK,
} = require('http-status-codes');

const { db } = require('../utils/firebase');
const validateCampaignInput = require('../validations/campaignInput');
const { getLocationsAmount } = require('../utils/functions');
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
    async create(req, res) {
        try {
            const { valid, errors } = await validateCampaignInput(req.body);
            if (!valid) validationError(res, errors);
            req.body.createdAt = new Date().toISOString();
            req.body.createdBy = req.user.uid;
            let amount = await getLocationsAmount(req.body.locationsSelected);
            amount = amount.reduce((a, b) => a + b, 0);
            req.body.amount = amount * req.body.duration;
            if (valid) {
                await db.collection('campaigns').doc().create(req.body)
                    .then(
                        ref => ref);
                return successNoData(res, CREATED, 'Campaign successfully created');
            }
        } catch (error) {
            return tryCatchError(res, error);
        }
    },

    // async deleteSavedLocation(req, res) {
    //     try {
    //         const savedLocation = await db.collection('savedLocations').doc(req.params.id);
    //         await savedLocation.delete();
    //         if (!savedLocation) {
    //             return validationError(res, 'Saved Location not found');
    //         }
    //         return successNoData(res, OK, 'Saved Location deleted successfully');
    //     } catch (error) {
    //         tryCatchError(res, error);
    //     }
    // },

    // async getAll(req, res) {
    //     try {
    //         const savedLocations = [];
    //         await db.collection('savedLocations').where('createdBy', '==', userId)
    //             .orderBy('createdAt', 'desc').get().then(querySnapshot => {
    //                 const docs = querySnapshot.docs;
    //                 for (const doc of docs) {
    //                     const selectedItem = {
    //                         id: doc.id,
    //                         savedLocation: doc.data(),
    //                     };
    //                     savedLocations.push(selectedItem);
    //                 } return savedLocations;
    //             });
    //         return successNoMessage(res, OK, savedLocations);
    //     } catch (error) {
    //         tryCatchError(res, error);
    //     }
    // },

    // async getOne(req, res) {
    //     try {
    //         const document = db.collection('savedLocations').doc(req.params.id);
    //         if (!document) {
    //             return validationError(res, 'Document not found');
    //         }
    //         const documentData = await document.get();
    //         const savedLocations = documentData.data();
    //         if(savedLocations.createdBy !== req.user.uid) {
    //             return validationError(res, 'Not Authorized');
    //         }
    //         return successNoMessage(res, OK, savedLocations);
    //     } catch (error) {
    //         tryCatchError(res, error);
    //     }
    // },

    // async updateSavedLocation(req, res) {
    //     try {
    //         const document = db.collection('savedLocations').doc(req.params.id);
    //         if (!document) validationError(res, errors);
    //         const { valid, errors } = await validateSavedLocationInput(req.body.location);
    //         if (!valid) validationError(res, errors);
    //         req.body.updatedAt = new Date().toISOString();
    //         req.body.updatedBy = req.user.uid;
    //         if (valid) {
    //             await document.update(req.body);
    //             return successNoData(res, CREATED, 'saved Location successfully updated');
    //         }
    //     } catch (error) {
    //         tryCatchError(res, error);
    //     }
    // },
};

module.exports = Campaign;
