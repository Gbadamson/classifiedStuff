const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  fullname: {
    type: String,
  },
  id_number: {
    type: Number,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
