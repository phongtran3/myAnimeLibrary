const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    animeTable: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Anime'
    },
    role: {
        type: String,
        default: 'viewer',
    }
})

module.exports = mongoose.model('User', userSchema)