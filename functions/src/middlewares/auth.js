const { FORBIDDEN, BAD_REQUEST, UNAUTHORIZED } = require('http-status-codes');
const { admin } = require('../utils/firebase');

const FBauth = async (req, res, next) => {
    try {
        let idToken;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            idToken = req.headers.authorization.split('Bearer ')[1];
        } else {
            return res.status(FORBIDDEN).json({ message: 'Unauthorized', status: 'error' });
        }
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken;
        const data = await admin.firestore().collection('users').where('userId', '==', req.user.uid)
            .limit(1).get();
        const { userId, role, isAdmin, status } = data.docs[0].data();
        req.user.userId = userId; req.user.role = role;
        req.user.isAdmin = isAdmin; req.user.status = status;
        return next();
    } catch (error) {
        return res.status(FORBIDDEN).json({ message: error.message, status: 'error' });
    }
};

const getAuthToken = (req, res, next) => {
    if (
        req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
        req.authToken = req.headers.authorization.split(' ')[1];
    } else {
        req.authToken = null;
    }
    next();
};
  
const checkIfAuthenticated = (req, res, next) => {
    getAuthToken(req, res, async () => {
        try {
            const { authToken } = req;
            const userInfo = await admin
                .auth()
                .verifyIdToken(authToken);
            req.authId = userInfo.uid;
            return next();
        } catch (e) {
            return res
                .status(UNAUTHORIZED)
                .send({ error: 'You are not authorized to make this request' });
        }
    });
};
const checkIfAdmin = (req, res, next) => {
    getAuthToken(req, res, async () => {
        try {
            const { authToken } = req;
            const userInfo = await admin
                .auth()
                .verifyIdToken(authToken);
            if (userInfo.admin === true) {
                req.authId = userInfo.uid;
                return next();
            }
            throw new Error('unauthorized');
        } catch (e) {
            return res
                .status(UNAUTHORIZED)
                .send({ error: 'You are not authorized to make this request' });
        }
    });
};
const isSuperAdmin = async (req, res, next) => {
    try {
        const { userId, role, isAdmin, status } = req.user;
        if (isAdmin && role === 'superAdmin' && status === 'active') {
            return next();
        }
        return res.status(FORBIDDEN).json({ message: 'Unauthorized', status: 'error' });
    } catch (error) {
        return res.status(FORBIDDEN).json({ message: 'Unauthorized', status: 'error' });
    }
};
module.exports = {
    FBauth, checkIfAdmin, checkIfAuthenticated, isSuperAdmin,
};
