const mongoose = require("mongoose");

const mangaSchema = mongoose.Schema({
  title: {
    type: [String], // Will hold english and romaji style tiitle
    default: [],
    required: true,
  },
  genre: {
    type: [String],
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

//module.exports = mongoose.model("userManga", mangaSchema);
