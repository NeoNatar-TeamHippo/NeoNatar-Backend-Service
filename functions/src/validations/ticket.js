const _ = require('lodash');

/**
    * function to handle ticket validation
    * @function
    * @param {Object} - data to validate
    * @return  {Object} errors and valid status
    */
const validateTicketData = data => {
    const errors = {};
    if (_.isEmpty(data.title) || _.isEmpty(data.priority)) {
        errors.fields = 'Fields must not be empty';
    }
    return { errors, valid: Object.keys(errors).length === 0 ? true : false };
};
/**
    * function to handle message validation
    * @function
    * @param {Object} - data to validate
    * @return  {Object} errors and valid status
    */
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
