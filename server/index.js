const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const helmet = require("helmet");
const multer = require("multer");
const path = require("path");
const { register } = require("./controllers/auth.js");

const app = express();
const userRouter = require("./routes/users.js");
const authRouter = require("./routes/auth.js");
const animeRouter = require("./routes/anime.js");
const mangaRouter = require("./routes/manga.js");

app.use(express.json());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

//FILE STORAGE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

//ROUTES WITH FILE
app.post("auth/register", upload.single("picture"), register); //Register new user

//ROUTES
app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/anime", animeRouter);
app.use("/manga", mangaRouter);

//MONGOOSE SET UP
const PORT = process.env.PORT || 5001;
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
  )
  .catch((error) => console.log(error));

app.get("/", async (req, res) => {
  res.send("Test");
});
