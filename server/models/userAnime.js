const mongoose = require("mongoose");

const userAnimeSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  title: {
    type: [String], // Will hold english and romaji style tiitle
    default: [],
    required: true,
  },
  genre: {
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
  userStatus: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("UserAnime", userAnimeSchema);
