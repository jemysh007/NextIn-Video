const express = require("express");
const router = express.Router();
const MovieController = require("../controllers/MovieController");

router.get("/", function (req, res) {
  res.send("Hello Movie Route");
});

router.get("/all", MovieController.getAll);

router.post("/add", MovieController.add);

router.get("/update", MovieController.update);

router.get("/delete", MovieController.delete);

module.exports = router;
