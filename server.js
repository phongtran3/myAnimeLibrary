if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');

const indexRouter = require('./routes/index');


app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use('/', indexRouter);

//CONNECT TO MONGODB DATABASE
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });

const db = mongoose.connection;
db.on('error', error => console.log(error));
db.once('open', () => console.log('connected to mongoose'));



app.get('/', (req, res) => {
    res.render('index.ejs');
}); //homepage


app.get('/login', (req, res) => {
    res.render('login.ejs');

})

app.get('/register', (req, res) => {
    res.render('register.ejs');

})

app.post('/register', (req, res) => {

})

app.post('/login', (req, res) => {

})


app.listen(process.env.PORT || 3000);