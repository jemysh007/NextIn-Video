const express = require("express");
const db = require("./db");
db();
const app = express();
const port = 3500;
var movies = require("./routes/movie");

app.get("/", (req, res) => {
  res.send("Hello Root!");
});

app.use("/movie", movies);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
