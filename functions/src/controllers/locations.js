const {
    CREATED, getStatusText, INTERNAL_SERVER_ERROR, NOT_FOUND, OK,
} = require('http-status-codes');
const { db } = require('../utils/firebase');

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
                address,
                coords,
                country,
                createdAt: new Date().toISOString(),
                image,
                lga,
                name,
                price,
                state,
                status,
                trafficRate,
            };
            const location = await db.collection('locations').doc().create(data).then(ref => ref);
            return res.status(CREATED).send({
                data: { location, message: 'Location successfully created' },
                status: 'success',
            });
        } catch (error) {
            return res.status(INTERNAL_SERVER_ERROR).send({                
                message: getStatusText(INTERNAL_SERVER_ERROR),
                status: 'error',
            });
        }
    },

    async deleteLocation(req, res) {
        try {
            const location = await db.collection('locations').doc(req.params.id);
            await location.delete();
            if (!location) {
                return res.status(NOT_FOUND).send({
                    message: getStatusText(NOT_FOUND),
                    status: 'error',
                });
            }
            return res.status(OK).send({
                data: null,
                status: 'success',
            });
        } catch (error) {
            return res.status(INTERNAL_SERVER_ERROR).send({
                error,
                message: getStatusText(INTERNAL_SERVER_ERROR),
                status: 'error',
            });
        }
    },

    async getAll(req, res) {
        try {
            const query = await db.collection('locations');
            const locations = [];
            await query.get().then(querySnapshot => {
                const docs = querySnapshot.docs;
                for (const doc of docs) {
                    const selectedItem = {
                        id: doc.id,
                        location: doc.data(),
                    };
                    locations.push(selectedItem);
                }
                return locations;
            });
            return res.status(OK).send({
                data: { locations },
                status: 'success',
            });
        } catch (error) {
            return res.status(INTERNAL_SERVER_ERROR).send({
                error,
                message: getStatusText(INTERNAL_SERVER_ERROR),
                status: 'error',
            });
        }
    },

    async getOne(req, res) {
        try {
            const document = db.collection('locations').doc(req.params.id);
            if (!document) {
                return res.status(NOT_FOUND).send({
                    message: getStatusText(NOT_FOUND),
                    status: 'error',
                });
            }
            const documentData = await document.get();
            const location = documentData.data();
            return res.status(OK).send({
                data: { location },
                status: 'success',
            });
        } catch (error) {
            return res.status(INTERNAL_SERVER_ERROR).send({
                error,
                message: getStatusText(INTERNAL_SERVER_ERROR),
                status: 'error',
            });
        }
    },

    async updateLocation(req, res) {
        try {
            const document = db.collection('locations').doc(req.params.id);

            if (!document) {
                return res.status(NOT_FOUND).send({
                    status: 'error',
                    message: getStatusText(NOT_FOUND),
                });
            }
            const location = await document.update(req.body);

            return res.status(CREATED).send({
                status: 'success',
                data: { location, message: 'Comment successfully updated' },
            });
        } catch (error) {
            return res.status(INTERNAL_SERVER_ERROR).send({
                status: 'error',
                message: getStatusText(INTERNAL_SERVER_ERROR),
                error,
            });
        }
    },
};

module.exports = Locations;
