const express = require('express');
const router = express.Router();
const passport = require('passport');
const session = require('express-session');
const methodOverride = require('method-override');
const User = require('../models/user');

router.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
router.use(passport.initialize());
router.use(passport.session());
router.use(methodOverride('_method'))


router.get('/', checkAuthenticated, async(req, res) => {
    let users;
    try {
        users = await User.find();
        //console.log("try block");
    } catch {
        users = [];
    }
    res.render('index.ejs', { users: users[0] });
    //console.log("user: " + users[0]);
})




router.delete('/logout', function(req, res, next) {
    req.logOut(function(err) {
        if (err) {
            return next(err);
        }
        res.redirect('/auth/login');
    });
});

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/auth/login')
}



module.exports = router;