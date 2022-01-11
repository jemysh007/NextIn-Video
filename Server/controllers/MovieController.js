const movie = require("../models/Movie");

exports.getAll = (req, res) => {
  res.send("All Movie Data");
};

exports.add = (req, res) => {
  res.send("Added a Movie");
};

exports.update = (req, res) => {
  res.send("Update a Movie");
};

exports.delete = (req, res) => {
  res.send("Delete a Movie");
};
