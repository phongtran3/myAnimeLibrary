const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user');


function initialize(passport, user, getUserById) {
    const authenticateUser = async(email, password, done) => {
        const user = await User.findOne({ email: email });
        //console.log(email);
        console.log("init " + user);
        if (user == null) {
            return done(null, false, { message: 'No user found with that email' });
        }

        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Password incorrect' })
            }
        } catch (err) {
            return done(err);
        }
    }

    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));
    passport.serializeUser((user, done) => { done(null, user.id) });
    passport.deserializeUser((id, done) => { return done(null, getUserById(id)) });
}

module.exports = initialize;