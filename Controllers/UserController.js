const user = require("../models/User");

exports.getAll = (req, res) => {
  res.send("All User Data");
};

exports.add = (req, res) => {
  res.send("Added a User");
};

exports.update = (req, res) => {
  res.send("Update a Movie");
};

exports.delete = (req, res) => {
  res.send("Delete a Movie");
};
