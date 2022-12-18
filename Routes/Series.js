const express = require("express");
const router = express.Router();
const SeriesController = require("../controllers/SeriesController");
var path = require("path");

router.get("/", function (req, res) {
  res.send("Hello Movie Route");
});

router.post("/all", SeriesController.getAll);

router.post("/add", SeriesController.add);
router.post("/add-season", SeriesController.addSeason);
router.post("/get-seasons", SeriesController.getSeasons);
router.post("/add-episode", SeriesController.addEpisode);
module.exports = router;
