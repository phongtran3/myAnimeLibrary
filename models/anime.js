const mongoose = require('mongoose');


const animeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    theme: String,
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now()
    }
})

module.exports = mongoose.model('Anime', animeSchema)