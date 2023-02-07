const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

const PORT = process.env.PORT || 5000;
console.log(PORT);
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
  })
  .then(() =>
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
  )
  .catch((error) => console.log(error));

const axios = require("axios");

app.get("/", async (req, res) => {
  res.send("Test");
  try {
    axios({
      url: "https://graphql.anilist.co",
      method: "post",
    });
  } catch (error) {}
});
