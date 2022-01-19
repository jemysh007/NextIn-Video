const express = require("express");
const router = express.Router();
const MovieController = require("../controllers/MovieController");
const multer = require("multer");
var path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "assets/movies");
  },
  filename: function (req, file, cb) {
    var ext = path.extname(file.originalname);
    console.log(ext);
    let newFileName = Date.now() + ext;
    cb(null, newFileName);
  },
});

const upload = multer({ storage: storage });

router.get("/", function (req, res) {
  res.send("Hello Movie Route");
});

router.get("/all", MovieController.getAll);

const cpUpload = upload.fields([
  { name: "avatar", maxCount: 4 },
  { name: "gallery", maxCount: 8 },
]);

router.post("/add", cpUpload, MovieController.add);

router.get("/update", MovieController.update);

router.get("/delete", MovieController.delete);

module.exports = router;
