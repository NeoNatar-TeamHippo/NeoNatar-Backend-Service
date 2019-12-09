const _ = require('lodash');

const validateTicketData = data => {
    const errors = {};
    if (_.isEmpty(data.title) || _.isEmpty(data.priority)) {
        errors.fields = 'Fields must not be empty';
    }
    return { errors, valid: Object.keys(errors).length === 0 ? true : false };
};
const validateMessageData = data => {
    const errors = {};
    if (_.isEmpty(data.body)) {
        errors.fields = 'Fields must not be empty';
    }
    return { errors, valid: Object.keys(errors).length === 0 ? true : false };
};

module.exports = {
    validateMessageData, validateTicketData,
};
