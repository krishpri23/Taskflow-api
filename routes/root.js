const express = require("express");
const router = express.Router();
const path = require("path");

// if url is just / or index.html or index
router.get("^/$|index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

module.exports = router;
