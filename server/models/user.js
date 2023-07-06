const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  picturePath: {
    type: String,
    default: "",
  },
  animes: {
    type: [
      {
        title: { type: String, required: true },
        genres: { type: [String], required: true },
        format: { type: String, required: true },
        coverImage: { type: String, required: true },
        siteUrl: { type: String, required: true },
        userStatus: { type: String, required: true },
        status: { type: String, required: true },
        createdAt: { type: Date, immutable: true, default: () => Date.now() },
      },
    ],
    default: [],
  },
  mangas: {
    type: [
      {
        title: { type: String, required: true },
        genres: { type: [String], required: true },
        format: { type: String, required: true },
        coverImage: { type: String, required: true },
        siteUrl: { type: String, required: true },
        userStatus: { type: String, required: true },
        status: { type: String, required: true },
        createdAt: { type: Date, immutable: true, default: () => Date.now() },
      },
    ],
    default: [],
  },
  socialMediaHandles: {
    type: Map,
    of: String,
  },
  following: {
    type: Array,
    default: [],
  },
  followers: {
    type: Array,
    default: [],
  },
  isAdult: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
