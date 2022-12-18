const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController.js");

router.get("/", function (req, res) {
  res.send("Hello Movie Route");
});

router.get("/all", UserController.getAll);

router.get("/add", UserController.add);

router.get("/update", UserController.update);

router.get("/delete", UserController.delete);

module.exports = router;
