const movie = require("../models/Movie");
const multer = require("multer");
const upload = multer({ dest: "assets/movies" });

exports.getAll = (req, res) => {
  res.send("All Movie Data");
};

exports.add = (req, res) => {
  console.log(req.file, req.body);
  res.send("ok");
};

exports.update = (req, res) => {
  res.send("Update a Movie");
};

exports.delete = (req, res) => {
  res.send("Delete a Movie");
};
