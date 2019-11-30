const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const routes = require('./src/routes');
const { functions } = require('./src/utils/firebase');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));
//Use Routes Here
routes.init(app);
//Error Handlers
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        errors: {
            message: err.message,
        },
    });
});

exports.api = functions.https.onRequest(app);
