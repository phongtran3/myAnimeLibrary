const express = require('express');
const router = express.Router();
const Anime = require('../models/anime');
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
const Utils = require('../utils/auth');
const User = require('../models/user');

// router.get('/', async(req, res) => {
//     res.send("All Anime");
//     //console.log("test");
//     // let query = await Anime.find();
//     // console.log(JSON.stringify(query[0]));
// });

const passport = require('passport');
const session = require('express-session');
router.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
router.use(passport.initialize());
router.use(passport.session());

// const initPassport = require('../utils/passport-config');
// initPassport(passport,
//     email => User.find({ email: email }),
//     id => User.find({ id: id })
// );

//New Anime Route
router.get('/new', Utils.checkAuthenticated, async(req, res, next) => {
    let user;
    if (req.isAuthenticated()) {
        console.log("logged in ");
        try {
            user = await User.findOne({ _id: req.user._conditions.id });
        } catch (err) {
            console.log("error: " + err);
            res.redirect('/');
        }
    } else
        console.log("not logged in");
    // console.log(req.user._conditions.id);
    // console.log("user: " + user.role);
    if (user.role == 'admin') {
        console.log("admin");
        renderNewPage(res, new Anime());
    } else
        console.log("not admin");

    // try {
    //     const anime = new Anime();
    //     res.render('animes/new', { anime: anime });
    //     console.log("Ntry");
    // } catch {
    //     console.log("Ncatch");
    //     res.redirect('/');
    // }
})

//Create Aninme Route
router.post('/', async(req, res) => {
    console.log("post");
    const anime = new Anime({
        title: req.body.title,
        type: req.body.type,
        //genrePrime: req.body.genrePrime,
        //genreSec: req.body.genreSec,
        genre: req.body['genre'],
        theme: req.body['theme'],
        //test: req.body.test,
        //createdAt: Date.now()
    })

    console.log("type: " + req.body.type);

    saveCover(anime, req.body.cover);
    //console.log(req.body['genre']);
    console.log(anime.genre);
    try {
        const newAnime = await anime.save();
        res.redirect(`anime/${newAnime.id}`);
        console.log("create try");
        //res.redirect("/");
    } catch (err) {
        console.log(err);
        console.log("create catch");
        renderNewPage(res, anime, true);

    }
})

//SHOW ANIME ROUTE
router.get('/:id', async(req, res) => {
    console.log("show");
    let user;
    if (req.isAuthenticated()) {
        console.log("logged in ");
        try {
            user = await User.findOne({ _id: req.user._conditions.id });
        } catch (err) {
            console.log("error: " + err);
            res.redirect('/');
        }
    } else
        console.log("not logged in");
    try {
        const anime = await Anime.findById(req.params.id);
        console.log(anime.genre);
        console.log("theme:" + anime.theme);
        res.render('animes/show', {
            anime: anime,
            user: user
        });

    } catch {
        res.redirect('/');
    }
})

//EDIT BOOK ROUTE
router.get('/:id/edit', Utils.checkAuthenticated, async(req, res) => {
    console.log("edit");

    const user = await User.findOne({ _id: req.user._conditions.id });
    if (user.role == 'admin') {
        console.log("admin");
        try {
            const anime = await Anime.findById(req.params.id);
            console.log(anime.genre);
            console.log(anime.theme);

            renderEditPage(res, anime);
        } catch {
            res.redirect('/');
        }
    } else {
        console.log("not admin");
        res.redirect('/');
    }
})

//UPDATE Aninme Route
router.put('/:id', async(req, res) => {
    let anime;
    console.log("put");
    console.log("title: " + req.body.title);
    try {
        anime = await Anime.findById(req.params.id);
        anime.title = req.body.title;
        anime.genre = req.body['genre'];
        anime.theme = req.body['theme'];
        if (req.body.cover != null && req.body.cover !== '') {
            saveCover(anime, req.body.cover);
        }
        await anime.save();
        res.redirect(`/anime/${anime.id}`);
        console.log("try");
        //res.redirect("/");
    } catch (err) {
        console.log("catch");
        console.log(err);
        if (anime != null) {
            renderEditPage(res, anime, true);
        } else
            res.redirect('/');
    }
})

//DELETE ANIME PAGE
router.delete('/:id', async(req, res) => {
    let anime;
    try {
        anime = await Anime.findById(req.params.id);
        await anime.remove();
        res.redirect('/');
    } catch (err) {
        if (anime != null) {
            res.render('anime/show', {
                anime: anime,
                errorMessage: 'Could not remove book'
            })
        } else {
            res.redirect('/');
        }

    }
})
async function renderNewPage(res, anime, hasError = false) {
    renderFormPage(res, anime, 'new', hasError);
}

async function renderEditPage(res, anime, hasError = false) {
    renderFormPage(res, anime, 'edit', hasError);
}

async function renderFormPage(res, anime, form, hasError = false, ) {
    try {
        //const animes = await Anime.find({});
        const params = {
            anime: anime,
            form: form
        }
        if (hasError) {
            if (form === 'edit')
                params.errorMessage = 'Error Editing Anime';
            else
                params.errorMessage = 'Error Creating Anime';
        }
        res.render(`animes/${form}`, params);
        //res.render("/");
        console.log("Rtry");
    } catch {
        console.log("Rcatch");
        res.redirect("/");
    }

}

function saveCover(anime, coverEncoded) {
    console.log("save cover");
    if (coverEncoded == null || coverEncoded == "")
        return
    const cover = JSON.parse(coverEncoded);
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        anime.coverImage = new Buffer.from(cover.data, 'base64');
        anime.coverImageType = cover.type;
    }
}


module.exports = router;