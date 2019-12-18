const _ = require('lodash');

/**
 * An helper function to validate saved Location input
 * @function
 * @param  data to validate
 * @return  {object} result
 */
const validateSavedLocationInput = data => {
    const errors = {};
    if (_.isEmpty(data.title) || _.isEmpty(data.description) || _.isEmpty(data.locations)) {
        errors.fields = 'Fields must not be empty';
    }
    return { errors, valid: Object.keys(errors).length === 0 ? true : false };
};

module.exports = validateSavedLocationInput;
