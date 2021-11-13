const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: false
  },
  count: {
    type: Number,
    required: false
  },

  log: [{
    description: {
      type: String,
      required: false
    },
    duration: {
      type: Number,
      required: false
    },
    date: {
      type: String,
      required: false
    }
  }],

  // logs: {
  //   description: {
  //     type: String,
  //     required: false
  //   },
  //   duration: {
  //     type: Number,
  //     required: false
  //   },
  //   date: {
  //     type: String,
  //     default: Date.now()
  //   }
  // },

  createdAt: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model("ExerciseUsers", UserSchema);