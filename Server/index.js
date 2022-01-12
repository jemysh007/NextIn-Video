const express = require("express");
const db = require("./db");
db();
const app = express();
const multer = require("multer");

const port = 3500;
var movies = require("./routes/movie");
var user = require("./routes/user");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello Root!");
});

app.use("/movie", movies);
app.use("/user", user);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
