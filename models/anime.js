const mongoose = require('mongoose');

const animeSchema = new mongoose.Schema({
    // userId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true,
    //     ref: 'User'
    // },
    title: {
        type: String,
        required: true
    },
    genrePrime: {
        type: String,
        required: true
    },
    genreSec: {
        type: String,
        required: true
    },
    theme: String,
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    },
    coverImage: {
        type: Buffer,
        //required: true
    },
    coverImageType: {
        type: String,
        //required: true
    },
})

module.exports = mongoose.model('Anime', animeSchema)