const User = require("../models/User");
const Note = require("../models/Note");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// @desc get all users
// @route GET /users
// @access private
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean().exec();

  if (!users) {
    return res.status(400).json({ message: "No users found" });
  }
  res.status(201).json(users);
});

// @desc create user
// @route POST /users
// @access private
const createUser = asyncHandler(async (req, res) => {
  const { username, password, roles } = req.body;

  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({ message: "All fields are required" });
  }

  console.log(username, password, "inside create user");

  // check for duplicate, exec() returns a promise, lean returns plain js objects
  const duplicate = await User.findOne({ username }).lean().exec();
  console.log("duplicate ", duplicate);
  if (duplicate) {
    // 409 - conflict
    return res.status(409).json({ message: "User already exists" });
  }

  const hashedPwd = await bcrypt.hash(password, 10);
  const userObject = { username, password: hashedPwd, roles };

  // create new user
  const newUser = await User.create(userObject);

  if (newUser) {
    res.status(201).json({ message: "New user created" });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
});

// @desc update user
// @route PATCH /users
// @access private
const updateUser = asyncHandler(async (req, res) => {
  const { id, username, password, roles, active } = req.body;

  if (
    !id ||
    !username ||
    !password ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== "boolean"
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = await User.findById(id);
  if (!user) {
    return res.status(400).json({ message: "No user found!" });
  }

  // duplicate check - use lean() for read only operations
  const duplicate = await User.findOne({ username }).lean().exec();

  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "duplicate username found" });
  }

  user.username = username;
  user.roles = roles;
  user.active = active;

  if (password) {
    // hashpwd
    user.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await user.save();

  res
    .status(201)
    .json({ message: `${updateUser.username} updated successfully` });
});

// @desc delete user
// @route DELETE /users
// @access private
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "UserID required" });
  }

  // dont delete user if they have notes attached
  const note = await Note.findOne({ user: id }).lean().exec();

  if (note) {
    return res.status(400).json({ message: "User has assigned notes" });
  }

  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "user does not exists" });
  }

  const result = await User.findByIdAndDelete(id).exec();
  console.log("results", result);
  const reply = `${result.username} with ID ${result?.id} deleted`;
  console.log(reply);
  res.status(201).json({
    message: reply,
  });
});

module.exports = { getUsers, createUser, updateUser, deleteUser };
