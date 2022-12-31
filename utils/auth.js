// Create password hash util
const crypto = require('crypto');

//Credit to James Bubb of Junior Developer Central/codebubb
const hashPassword = (plainText) => {
    return crypto.createHmac('sha256', 'secret key')
        .update(plainText)
        .digest('hex');
}

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/auth/login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

module.exports = {
    hashPassword: hashPassword,
    checkAuthenticated: checkAuthenticated,
    checkNotAuthenticated: checkNotAuthenticated
};