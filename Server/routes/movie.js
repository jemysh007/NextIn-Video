const express = require("express");
const router = express.Router();
const MovieController = require("../controllers/MovieController");
var path = require("path");

router.get("/", function (req, res) {
  res.send("Hello Movie Route");
});

router.post("/all", MovieController.getAll);

router.post("/by-genre", MovieController.getByGenre);
router.post("/add", MovieController.add);

router.get("/stream/:choice/:movie_id", MovieController.getStream);

router.get("/update", MovieController.update);

router.get("/delete", MovieController.delete);

router.get("/get-genres", MovieController.getGenres);
module.exports = router;
