const locations = require('./locations');
const users = require('./users');

const init = app => {
    app.use('/v1/locations', locations);
    app.use('/v1/auth', users);
};

module.exports = {
    init,
};
