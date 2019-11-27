const _ = require('lodash');
const isEmail = email => {
    const re = /\S+@\S+\.\S+/;
    return re.test(String(email).toLowerCase());
};
const validateSignInData = data => {
    const errors = {};
    if (_.isEmpty(data.email) || _.isEmpty(data.password)) {
        errors.fields = 'Fields must not be empty';
    }
    if (!isEmail(data.email)) {
        errors.email = 'Must be a valid email';
    }
    return { errors, valid: Object.keys(errors).length === 0 ? true : false };
};
const validateSignUpData = data => {
    const errors = {};
    if (_.isEmpty(data.email) || _.isEmpty(data.password) ||
        _.isEmpty(data.firstName) || _.isEmpty(data.lastName)) {
        errors.fields = 'Fields must not be empty';
    }
    if (!isEmail(data.email)) {
        errors.email = 'Must be a valid email';
    }
    if (!_.isEqual(data.password, data.confirmPassword)) {
        errors.password = 'Password does not match';
    }
    return { errors, valid: Object.keys(errors).length === 0 ? true : false };
};
const validateUpdateProfile = data => {
    const errors = {};
    if (_.isEmpty(data.address) || _.isEmpty(data.firstName) || _.isEmpty(data.lastName)) {
        errors.fields = 'Fields must not be empty';
    }
    return { errors, valid: Object.keys(errors).length === 0 ? true : false };
};
module.exports = { isEmail, validateSignInData, validateSignUpData, validateUpdateProfile };
