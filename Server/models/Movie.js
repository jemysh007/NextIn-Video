const mongoose = require("mongoose");
const { Schema } = mongoose;

const MovieSchema = new Schema({
  name: { type: "string", default: null },
  short_desc: { type: "string", default: null },
  duration: Number,
  rated_for: { type: "string", default: null },
  imdb: Number,
  release_year: Number,
  available_in: [String],
  banner: { type: "string", default: null },
  movie_source: { type: "string", default: null },
  trailer_source: { type: "string", default: null },
  genre: [String],
  date: {
    type: Date,
    default: Date.now,
  },
  timestamp: {
    type: Number,
    default: 0,
  },
  keywords: [String],
});

module.exports = mongoose.model("movie", MovieSchema);
