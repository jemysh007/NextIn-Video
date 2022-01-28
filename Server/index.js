const express = require("express");
const db = require("./db");
db();
const app = express();
const fileUpload = require("express-fileupload");
var path = require("path");
const cors = require("cors");

const port = 3500;
var movies = require("./Routes/Movie");
var user = require("./Routes/User");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(express.static(path.resolve("./public/")));

app.get("/", (req, res) => {
  res.send("Hello Root!");
});

var fs = require("fs");
var ffmpeg = require("fluent-ffmpeg");

// open input stream
var whitelist = ["https://videojs.github.io/", "http://example2.com"];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));

app.use("/movie", movies);
app.use("/user", user);
app.get("/convert", () => {
  var infs = new ffmpeg();
  let videopath = "./public/movie/Iron Man/Iron Man Tailer.mp4";
  infs
    .addInput("video.mp4")
    .outputOptions([
      "-map 0:0",
      "-map 0:1",
      "-map 0:0",
      "-map 0:1",
      "-s:v:0 2160x3840",
      "-c:v:0 libx264",
      "-b:v:0 2000k",
      "-s:v:1 960x540",
      "-c:v:1 libx264",
      "-b:v:1 365k",
      // '-var_stream_map', '"v:0,a:0 v:1,a:1"',
      "-master_pl_name master.m3u8",
      "-f hls",
      "-max_muxing_queue_size 1024",
      "-hls_time 1",
      "-hls_list_size 0",
      "-hls_segment_filename",
      "v%v/fileSequence%d.ts",
    ])
    .output("./public/movie/Iron Man/HLS/index.m3u8")
    .on("start", function (commandLine) {
      console.log("Spawned Ffmpeg with command: " + commandLine);
    })
    .on("error", function (err, stdout, stderr) {
      console.log("An error occurred: " + err.message, err, stderr);
    })
    .on("progress", function (progress) {
      console.log("Processing: " + progress.percent + "% done");
    })
    .on("end", function (err, stdout, stderr) {
      console.log("Finished processing!" /*, err, stdout, stderr*/);
    })
    .run();
  // save to file
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
