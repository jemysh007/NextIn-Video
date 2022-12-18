const mongoose = require("mongoose");
const { Schema } = mongoose;

const SeriesSchema = new Schema({
  name: { type: "string", default: null },
  short_desc: { type: "string", default: null },
  rated_for: { type: "string", default: null },
  imdb: Number,
  release_year: Number,
  available_in: [String],
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
  seasons: [{ type: Schema.Types.ObjectId, ref: "season" }],
});

module.exports = mongoose.model("series", SeriesSchema);
