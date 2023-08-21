// Core Node.js modules
const path = require("path");

// Third-party modules
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
require("dotenv").config();

const multer = require("multer");

// Local modules and controllers
const { register } = require("./controllers/auth.js");
const { updateProfile } = require("./controllers/users.js");
const verifyToken = require("./middleware/auth.js");
const { uploadToS3 } = require("./controllers/s3Service.js");

// Express app setup
const app = express();

// ROUTES
const userRouter = require("./routes/users.js");
const authRouter = require("./routes/auth.js");
const animeRouter = require("./routes/anime.js");
const mangaRouter = require("./routes/manga.js");

// CONFIGURATIONS
app.use(express.json());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

//FILE STORAGE
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[0] === "image") {
    cb(null, true);
  } else {
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1000000000, files: 1 },
});

//ROUTES WITH FILE
app.post("/auth/register", upload.single("picture"), uploadToS3, register); //Register new user

app.patch(
  "/users/:id/update",
  upload.single("picture"),
  verifyToken,
  uploadToS3,
  updateProfile
);

//ROUTES
app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/anime", animeRouter);
app.use("/manga", mangaRouter);

app.get("/", (req, res) => {
  res.send({ message: "Hello World!" });
});

//MONGOOSE SET UP
const PORT = process.env.PORT || 5001;
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.CONNECTION_URL)
  .then(() =>
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
  )
  .catch((error) => console.log(error));
