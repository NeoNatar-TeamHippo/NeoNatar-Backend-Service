const {
    CREATED, OK,
} = require('http-status-codes');

const { db } = require('../utils/firebase');
const validateLocationInput = require('../validations/locationInput');
const errorHandler = require('../utils/errorHandler');
const successHandler = require('../utils/successHandler');

const Locations = {
    /**
	 * The Location Routes
	 * @function
	 * @param {object} req - request object
	 * @param {object} res - response object
	 * @return  {Object} result
	*/
    async create(req, res) {
        try {
            const {
                address, coords, country, image, lga, name, price, state, status, trafficRate,
            } = req.body;
            const data = {
                address, coords, country, image, lga, name, price, state, status, trafficRate,
            };
            const { valid, errors } = await validateLocationInput(data);
            if (!valid) errorHandler.validationError(res, errors);
            data.createdAt = new Date().toISOString();
            if (valid) {
                await db.collection('locations').doc().create(data).then(
                    ref => ref);
                return successHandler.successNOData(res, CREATED, 'Location successfully created');
            }
        } catch (error) {
            return errorHandler.tryCatchError(res, error);
        }
    },

    async deleteLocation(req, res) {
        try {
            const location = await db.collection('locations').doc(req.params.id);
            await location.delete();
            if (!location) {
                return errorHandler.validationError(res, 'Location not found');
            }
            return successHandler.successNoData(res, OK, 'Location deleted successfully');
        } catch (error) {
            errorHandler.tryCatchError(res, error);
        }
    },

    async getAll(req, res) {
        try {
            const locations = [];
            await db.collection('locations').get().then(querySnapshot => {
                const docs = querySnapshot.docs;
                for (const doc of docs) {
                    const selectedItem = {
                        id: doc.id,
                        location: doc.data(),
                    };
                    locations.push(selectedItem);
                } return locations;
            });
            return successHandler.successNoMessage(res, OK, locations);
        } catch (error) {
            errorHandler.tryCatchError(res, error);
        }
    },

    async getOne(req, res) {
        try {
            const document = db.collection('locations').doc(req.params.id);
            if (!document) {
                return errorHandler.validationError(res, 'Document not found');
            }
            const documentData = await document.get();
            const location = documentData.data();
            return successHandler.successNoMessage(res, OK, location);
        } catch (error) {
            errorHandler.tryCatchError(res, error);
        }
    },

    async updateLocation(req, res) {
        try {
            const document = db.collection('locations').doc(req.params.id);

            if (!document) errorHandler.validationError(res, errors);
            req.body.updatedAt = new Date().toISOString();
            await document.update(req.body);

            return successHandler.successNOData(res, CREATED, 'Location successfully updated');
        } catch (error) {
            errorHandler.tryCatchError(res, error);
        }
    },
};

module.exports = Locations;
