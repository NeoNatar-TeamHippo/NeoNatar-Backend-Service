const locations = require('./locations');

const init = app => {
    app.use('/v1/locations', locations);
};
    
module.exports = {
    init: init,
};
