const { FORBIDDEN, BAD_REQUEST } = require('http-status-codes');
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
    FBauth, isSuperAdmin,
};
