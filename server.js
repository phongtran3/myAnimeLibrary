if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

//Dependencies
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const bcrypt = require('bcrypt');
const passport = require('passport');
const session = require('express-session');
const flash = require('express-flash');
const authUtils = require('./utils/auth');
const initPassport = require('./utils/passport-config');
initPassport(passport, (email) => {

});

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');


//SET && USE
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());


//ROUTES
app.use('/', indexRouter);
app.use('/auth', authRouter);


//CONNECT TO MONGODB DATABASE
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });

const db = mongoose.connection;
db.on('error', error => console.log(error));
db.once('open', () => console.log('connected to mongoose'));
//const userDB = require('./models/user.js');
const user = require('./models/user.js');
//app.locals.users = userDB;
console.log(user);



app.listen(process.env.PORT || 3000);