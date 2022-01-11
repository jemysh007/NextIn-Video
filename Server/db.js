const mongoose = require("mongoose");

const mongoURI =
  "mongodb+srv://jemish:jemish@NextIn@cluster0.mnwum.mongodb.net/nextinvideo?retryWrites=true&w=majority";
const db = () => {
  mongoose.createConnection(mongoURI, () => {
    console.log("MongoDB Connected Successfully");
  });
};

module.exports = db;
