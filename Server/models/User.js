const mongoose = require("mongoose");
const { Schema } = mongoose;

const Userschema = new Schema({
  email: String,
  password: String,
  date: {
    type: String,
    default: Date.now,
  },
  timestamp: {
    type: Number,
    default: 0,
  },
});

module.export = mongoose.model("user", Userschema);
