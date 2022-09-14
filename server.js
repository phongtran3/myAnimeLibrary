if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

//Dependencies
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const bcrypt = require('bcrypt');
const passport = require('passport');
//const authUtils = require('./utils/auth');


const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');


//SET && USE
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));


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
const User = require('./models/user.js');
//app.locals.users = userDB;
console.log(User);
// User.deleteMany({ name: 'w' });
// User.count({ name: 'w' });

app.listen(process.env.PORT || 3000);
console.log("Listened")