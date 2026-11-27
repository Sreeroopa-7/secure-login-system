
function isAuthenticated(req, res, next) {

    // Check whether user has a valid login session
    if (req.session && req.session.user) {
        return next();
    }

    // If user is not logged in
    return res.status(401).json({
        message: 'Please login first!'
    });
}

module.exports = isAuthenticated;
