const _ = require('lodash');

const validateDetails = data => {
    const errors = {};
    if (_.isEmpty(data.title) || _.isEmpty(data.description)) {
        errors.fields = 'Fields must not be empty';
    }
    return { errors, valid: Object.keys(errors).length === 0 ? true : false };
};

module.exports = {
    validateDetails,
};
