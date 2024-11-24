const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: [
    {
      type: String,
      default: "Employee", // if frontend does not have a role, it will be employee by default
      required: true,
    },
  ],
  active: {
    type: Boolean,
    default: true, // if frontend does not have active employee, it will be true by default
  },
});

module.exports = mongoose.model("User", userSchema);
