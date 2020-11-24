const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const FleetsSchema = new Schema({
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    require: true,
  },
  location: {
    type: String,
    required: true,
  },
  charge: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Fleets", FleetsSchema);
