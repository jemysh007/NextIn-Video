const mongoose = require("mongoose");

const mongoURI = "mongodb://localhost:27017/nextinvideo";
const db = () => {
  mongoose.connect(mongoURI, () => {
    console.log("MongoDB Connected Successfully");
  });
};

module.exports = db;
