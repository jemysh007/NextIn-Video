const mongoose = require("mongoose");
const { Schema } = mongoose;

const SeasonSchema = new Schema({
  name: { type: "string", default: null },
  date: {
    type: Date,
    default: Date.now,
  },
  timestamp: {
    type: Number,
    default: 0,
  },
  banner: { type: "string", default: null },
  trailer_source: { type: "string", default: null },
  series: { type: Schema.Types.ObjectId, ref: "series" },
  episodes: [{ type: Schema.Types.ObjectId, ref: "episode" }],
});

module.exports = mongoose.model("season", SeasonSchema);
