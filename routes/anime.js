const express = require('express');
const router = express.Router();
const Anime = require('../models/anime');
const imageMineTypes = ['image/jpeg', 'image/png', 'image/gif'];

// router.get('/', (req, res) => {
//     res.send("All Anime");
//     //console.log("test");

// });

//New Anime Route
router.get('/new', async(req, res, next) => {
    renderNewPage(res, new Anime());
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
    const anime = new Anime({
        title: req.body.title,
        genrePrime: req.body.genrePrime,
        genreSec: req.body.genreSec,
        theme: req.body.theme,
        //createdAt: Date.now()
    })
    console.log("test");
    console.log(req.body.title);
    console.log(req.body.genrePrime);
    console.log(req.body.genreSec);

    try {
        const newAnime = await anime.save();
        //res.redirect(`animes/${newAnime.id}`);
        console.log("try");
        res.redirect("/");
    } catch {
        console.log("catch");
        renderNewPage(res, anime, true);

    }
})



async function renderNewPage(res, anime, hasError = false) {
    try {
        //const animes = await Anime.find({});
        const params = {
            anime: anime
        }
        if (hasError) params.errorMessage = 'Error Creating Anime';
        res.render("animes/new", params);
        //res.render("/");
        console.log("Rtry");
    } catch {
        console.log("Rcatch");
        res.redirect("/");
    }

}

module.exports = router;