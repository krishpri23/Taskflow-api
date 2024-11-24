const express = require("express");
const router = express.Router();
const notesController = require("../controllers/NotesController");
const verifyJWT = require("../middleware/verifyJWT");

// applies to all the routes
router.use(verifyJWT);

router
  .route("/")
  .get(notesController.getAllNotes)
  .post(notesController.createNewNote)
  .patch(notesController.updateNote)
  .delete(notesController.deleteNote);

module.exports = router;
