if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const router = express.Router();
const passport = require('passport');
const session = require('express-session');
const methodOverride = require('method-override');
const User = require('../models/user');
const Anime = require('../models/anime');

router.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
router.use(passport.initialize());
router.use(passport.session());
router.use(methodOverride('_method'))

//checkAuthenticated
router.get('/', async(req, res) => {
    // let users;
    let query = Anime.find();
    if (req.query.title != null && req.query.title != "") {
        query = query.regex('title', new RegExp(req.query.title, 'i'));
    }

    try {
        const anime = await query.exec();
        console.log(anime[0]);
        //users = await User.find();
        //console.log("try block");
        res.render('index.ejs', {
            // users: users[0],
            anime: anime,
            searchOpt: req.query
        });
    } catch {
        //users = [];
        console.log("index catch");
        res.redirect('/');
    }
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