const mongoose = require("mongoose");

const animeSchema = mongoose.Schema({
  title: {
    type: [String], // Will hold english and romaji style tiitle
    default: [],
    required: true,
  },
  genres: {
    type: [String],
    required: true,
  },
  format: {
    type: String,
    required: true,
  },
  coverImage: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
  siteUrl: {
    type: String,
    required: true,
  },
});

//module.exports = mongoose.model("UserAnime", animeSchema);
