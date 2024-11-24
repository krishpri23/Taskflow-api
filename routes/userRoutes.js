const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");
const verifyJWT = require("../middleware/verifyJWT");

// applies to all the routes
router.use(verifyJWT);

// '/' denotes the parent route 'users'
router
  .route("/")
  .get(userController.getUsers)
  .post(userController.createUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
