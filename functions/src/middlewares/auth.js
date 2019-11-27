const { admin } = require('../utils/firebase');
const FBauth = async (req, res, next) => {
    try {
        let idToken;
        if (req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer ')) {
            idToken = req.headers.authorization.split('Bearer ')[1];
        } else {
            return res.status(403).json({ message: 'Unauthorized', status: 'error' });
        }
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken;
        const data = await admin.firestore().collection('users').where('userId', '==', req.user.uid)
            .limit(1).get();
        const { userId, role, isAdmin, status } = data.docs[0].data();
        req.user.userId = userId;
        req.user.role = role;
        req.user.isAdmin = isAdmin;
        req.user.status = status;
        return next();
    } catch (error) {
        return res.status(403).json({ message: error.message, status: 'error' });
    }
};
module.exports = {
    FBauth,
};
