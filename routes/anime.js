const express = require('express');
const router = express.Router();
const Anime = require('../models/anime');
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

// router.get('/', async(req, res) => {
//     res.send("All Anime");
//     //console.log("test");
//     // let query = await Anime.find();
//     // console.log(JSON.stringify(query[0]));
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
    console.log("post");
    const anime = new Anime({
        title: req.body.title,
        genrePrime: req.body.genrePrime,
        genreSec: req.body.genreSec,
        theme: req.body.theme,
        //createdAt: Date.now()
    })
    console.log("test");
    console.log(req.body.title);
    console.log(anime.title);
    console.log(req.body.genrePrime);
    console.log(req.body.genreSec);

    saveCover(anime, req.body.cover);

    try {
        const newAnime = await anime.save();
        res.redirect(`anime/${newAnime.id}`);
        console.log("try");
        //res.redirect("/");
    } catch {
        console.log("catch");
        renderNewPage(res, anime, true);

    }
})

//SHOW BOOK ROUTE
router.get('/:id', async(req, res) => {
    console.log("show");
    try {
        const anime = await Anime.findById(req.params.id);
        res.render('animes/show', { anime: anime });

    } catch {
        res.redirect('/');
    }
})

//EDIT BOOK ROUTE
router.get('/:id/edit', async(req, res) => {
    console.log("edit");
    try {
        const anime = await Anime.findById(req.params.id);
        renderEditPage(res, anime);
    } catch {
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
        anime.genrePrime = req.body.genrePrime;
        anime.genreSec = req.body.genreSec;
        anime.theme = req.body.theme;
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
            anime: anime
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
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        anime.coverImage = new Buffer.from(cover.data, 'base64')
        anime.coverImageType = cover.type
    }
}


module.exports = router;