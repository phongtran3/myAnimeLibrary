if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const User = require('../models/user');
const Anime = require('../models/anime');

const express = require('express');

const router = express.Router();
const passport = require('passport');
const session = require('express-session');
router.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
router.use(passport.initialize());
router.use(passport.session());

//checkAuthenticated
router.get('/', async(req, res) => {
    console.log("search anime");
    let user;
    if (req.isAuthenticated()) {
        console.log("isAuthenticated");
        user = await User.findOne({ _id: req.user._conditions.id });
    }
    // let users;
    // let query = Anime.find().sort({ title: 'asc' }); //Sort in alphabetical order
    let query = Anime.find().sort({ createdAt: -1 }); //Sort by recently added.
    if (req.query.title != null && req.query.title != "") {
        query = query.regex('title', new RegExp(req.query.title, 'i'));
    }
    if (req.query.genre != null) {
        query = query.find({ "genre": { "$in": req.query.genre } });
    }
    if (req.query.theme != null) {
        query = query.find({ "theme": { "$in": req.query.theme } });
    }
    if (req.query.type != null) {
        query = query.find({ "type": { "$in": req.query.type } });
    }
    //console.log(req.query.genre);
    //console.log(req.query.theme); 
    // const user = req.user;
    // console.log(user);
    // console.log(user._id);
    //user = await User.findOne({ _id: user._conditions.id });
    try {
        const anime = await query.exec();

        //console.log(anime[0]);
        //users = await User.find();
        //console.log("try block");
        res.render('index.ejs', {
            // users: users[0],
            anime: anime,
            searchOpt: req.query,
            user: user
        });
    } catch (err) {
        //users = [];
        console.log("index catch" + err);
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


module.exports = router;