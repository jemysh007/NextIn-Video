const mongoose = require("mongoose");
const { Schema } = mongoose;

const EpisodeSchema = new Schema({
  title: { type: "string", default: null },
  short_desc: { type: "string", default: null },
  date: {
    type: Date,
    default: Date.now,
  },
  timestamp: {
    type: Number,
    default: 0,
  },
  video_source: { type: "string", default: null },
  series: { type: Schema.Types.ObjectId, ref: "series" },
  season: { type: Schema.Types.ObjectId, ref: "season" },
});

module.exports = mongoose.model("episode", EpisodeSchema);
