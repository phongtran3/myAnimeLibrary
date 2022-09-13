const { authenticate } = require('passport')
const bcrypt = require('bcrypt');
const Strategy = require('passport-local').Strategy

function initialize(passport, getUserByEmail) {
    const authenticateUser = async(email, password, done) => {
        const user = getUserByEmail(email);
        console.log(email);
        console.log(user);
        if (user == null) {
            return done(null, false), { message: 'No user found with that email' };
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

    passport.use(new Strategy({ usernameField: 'email' }, authenticateUser))
    passport.serializeUser((user, done) => {});
    passport.deserializeUser((id, done) => {});
}

module.exports = initialize;