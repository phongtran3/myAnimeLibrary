const express = require('express');
const router = express.Router();
const authUtils = require('../utils/auth');
const passport = require('passport');
const flash = require('connect-flash');
const bcrypt = require('bcrypt')
const User = require('../models/user');


//GET LOGIN PAGE
router.get('/login', (req, res, next) => {
    //const message = req.flash();
    res.render('login');
});

//HANDLE LOGIN REQUEST
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true
}))


//Get REGISTER PAGE
router.get('/register', (req, res, next) => {
    //const message = req.flash();
    res.render('register');
})

//HANDLE REGISTER REQUEST
router.post('/register', async(req, res, next) => {
    console.log(req.body.name);
    console.log(req.body.email);
    console.log(req.body.password);
    try {
        if (!req.body.name || !req.body.email || !req.body.password) {
            res.redirect('/auth/register');
            console.log("Not all fields have been entered")
            return next();
        }

        // Checking database and email to ensure no duplicate emails upon register 
        // const existingEmail = await User.findOne({ email: req.body.email });
        // if (existingEmail) {
        //     res.redirect('/auth/register');
        //     console.log("An account with this email already exists")
        //     return next();
        //     //return res.status(400).json({ msg: "An account with this email already exists" });
        // }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });
        const newUser = await user.save();
        console.log(newUser);

        console.log("try block");
        res.redirect('/auth/login');
    } catch (err) {
        res.redirect('/auth/register');
        console.log(err);

    }
})

//LOGOUT PAGE
router.get('/logout', (req, res, next) => {
    req.session.destroy();
    res.redirect('/');
})


module.exports = router;