const mongoose = require("mongoose");
const { Schema } = mongoose;
const moment = require("moment");
console.log("Hello", moment().unix());

const MovieSchema = new Schema({
  name: String,
  shortDesc: String,
  duration: String,
  ratedFor: Number,
  imdb: Number,
  releaseYear: Number,
  availableIn: [String],
  banner: String,
  movie_source: String,
  trailer_source: String,
  genre: [String],
  date: {
    type: String,
    default: Date.now,
  },
  timestamp: {
    type: Number,
    default: moment().unix,
  },
  keywords: [String],
});

module.export = mongoose.model("movie", MovieSchema);
