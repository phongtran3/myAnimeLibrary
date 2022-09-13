const mongoose = require('mongoose');

const animeSchema = new mongoose.Schema({
    userId: mongoose.SchemaType.ObjectId,
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
        type: Data,
        immutable: true,
        default: () => Date.now()
    }

})

module.exports = mongoose.model('Anime', authorSchema)