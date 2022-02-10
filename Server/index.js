const express = require("express");
const db = require("./db");
db();
const app = express();
const fileUpload = require("express-fileupload");
var path = require("path");
const cors = require("cors");

const port = 3500;
var movies = require("./Routes/Movie");
var series = require("./Routes/Series");
var user = require("./Routes/User");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(express.static(path.resolve("./public/")));

app.get("/", (req, res) => {
  res.send("Hello Root!");
});

var fs = require("fs");
var ffmpeg = require("fluent-ffmpeg");

app.use("/movie", movies);
app.use("/series", series);

app.use("/user", user);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
