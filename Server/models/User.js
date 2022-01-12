const mongoose = require("mongoose");
const { Schema } = mongoose;
const moment = require("moment");

const Userschema = new Schema({
  email: String,
  password: String,
  date: {
    type: String,
    default: Date.now,
  },
  timestamp: {
    type: Number,
    default: moment().unix,
  },
});

module.export = mongoose.model("user", Userschema);
