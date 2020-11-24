const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const RefreshTokensSchema = new Schema({
  token: {
    type: Array,
    required: true,

  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("refreshTokens", RefreshTokensSchema);
