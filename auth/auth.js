const isLoggedIn = (req, res, next) => {
    if (req.session.userData) {
        next();
        return;
    }
    else {
        res.redirect('/logIn')
    }
    next();
}

const isLoggedOut = (req, res, next) => {
    if (req.session.userData) {
        res.redirect('/dashBoard')
    }
    next();
}

module.exports = { isLoggedIn, isLoggedOut };