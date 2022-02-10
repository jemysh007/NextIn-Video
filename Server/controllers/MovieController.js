const Movie = require("../Models/Movie");
const Check = require("../Helpers/Check");
var fs = require("fs");
var path = require("path");
const moment = require("moment");
var Ffmpeg = require("fluent-ffmpeg");

const SEND = (msg = "Invalid Requst", data = []) => {
  formottedData = {
    msg: msg,
    data: data,
  };
  return formottedData;
};

exports.getAll = async (req, res) => {
  let { start, length, date_filter } = req.body;
  console.log(req.body);
  length = !length ? 10 : length;
  start = !start ? 0 : start;
  let total_records = await Movie.countDocuments({});
  let filter = {};
  if (date_filter) {
    if (date_filter.start != "" && date_filter.end != "") {
      if (
        parseFloat(date_filter.start) > 0 &&
        parseFloat(date_filter.end) > 0
      ) {
      }
      filter = {
        $and: [
          { timestamp: { $gte: parseFloat(date_filter.start) } },
          { timestamp: { $lte: parseFloat(date_filter.end) } },
        ],
      };
    }
  }

  let moviedata = await Movie.find(filter)
    .limit(length)
    .skip(start)
    .sort({ timestamp: -1 });
  if (moviedata) {
    res.send(SEND("Movie Data Found", { nodedata: moviedata, total_records }));
  } else {
    res.status(400).json(SEND("No Movie Data Found"));
  }
};

exports.add = async (req, res) => {
  let {
    movie_name,
    short_desc,
    duration,
    rated_for,
    imdb,
    release_year,
    available_in,
    genre,
    keywords,
  } = req.body;

  if (!Check.isBlank(movie_name) && Check.isString(movie_name)) {
    if (!Check.isBlank(short_desc) && Check.isString(short_desc)) {
      if (!Check.isBlank(duration) && parseFloat(duration) > 0) {
        if (!Check.isBlank(rated_for) && Check.isString(rated_for)) {
          if (!Check.isBlank(imdb) && parseFloat(imdb) > 0) {
            if (!Check.isBlank(release_year) && parseFloat(release_year) > 0) {
              if (
                !Check.isBlank(available_in) &&
                Check.isString(available_in)
              ) {
                if (!Check.isBlank(genre) && Check.isString(genre)) {
                  if (!Check.isBlank(keywords) && Check.isString(keywords)) {
                    const isExistMovie = await Movie.findOne({
                      name: movie_name,
                    });
                    if (!isExistMovie) {
                      if (req.files && Object.keys(req.files).length > 0) {
                        if (req.files.banner) {
                          if (req.files.trailer_source) {
                            if (req.files.movie_source) {
                              // Uploaded Movie banner, Trailer and Movie File Validated
                              let uploadPath = "./public/movie/" + movie_name;
                              if (!fs.existsSync(uploadPath)) {
                                fs.mkdirSync(uploadPath);
                              }

                              let { banner, movie_source, trailer_source } =
                                req.files;
                              let bannerExt = path.extname(banner.name);
                              let movie_sourceExt = path.extname(
                                movie_source.name
                              );
                              let trailer_sourceExt = path.extname(
                                trailer_source.name
                              );
                              let banneruploadPath =
                                movie_name + " Banner" + bannerExt;
                              let movieuploadPath =
                                movie_name + movie_sourceExt;
                              let traileruploadPath =
                                movie_name + " Trailer" + trailer_sourceExt;

                              banner.mv(
                                uploadPath + "/" + banneruploadPath,
                                function (err) {
                                  if (err) {
                                    res.status(400).json(SEND(err));
                                  }
                                  console.log("Movie Banner uploaded");
                                }
                              );
                              movie_source.mv(
                                uploadPath + "/" + movieuploadPath,
                                function (err) {
                                  if (err) {
                                    res.status(400).json(SEND(err));
                                  }
                                  console.log("Movie File Uploaded");
                                }
                              );
                              trailer_source.mv(
                                uploadPath + "/" + traileruploadPath,
                                function (err) {
                                  if (err) {
                                    res.status(400).json(SEND(err));
                                  }
                                  console.log("Movie Trailer Uploaded");
                                }
                              );

                              let insData = {
                                name: movie_name,
                                short_desc,
                                duration,
                                rated_for,
                                imdb,
                                release_year,
                                available_in: available_in.split(","),
                                genre: genre.split(","),
                                keywords: keywords.split(","),
                                timestamp: moment().unix(),
                                banner: banneruploadPath,
                                movie_source: movieuploadPath,
                                trailer_source: traileruploadPath,
                              };

                              let addMovie = await Movie.create(insData);
                              res.send(SEND("Movie Added Successfully"));
                            } else {
                              res
                                .status(400)
                                .json(SEND("Please Upload Movie Source"));
                            }
                          } else {
                            res
                              .status(400)
                              .json(SEND("Please Upload Trailer Source"));
                          }
                        } else {
                          res
                            .status(400)
                            .json(SEND("Please Upload Movie Banner"));
                        }
                      } else {
                        res
                          .status(400)
                          .json(
                            SEND(
                              "Please Upload Movie Banner, Movie Trailer and Movie File Correctly"
                            )
                          );
                      }
                    } else {
                      res.status(400).json(SEND("Movie already exists"));
                    }
                  } else {
                    res
                      .status(400)
                      .json(SEND("Choose Genre available for this Movie"));
                  }
                } else {
                  res
                    .status(400)
                    .json(SEND("Choose Genre available for this Movie"));
                }
              } else {
                res
                  .status(400)
                  .json(SEND("Choose Languages available for this Movie"));
              }
            } else {
              res.status(400).json(SEND("Movie Release Year is not Valid"));
            }
          } else {
            res.status(400).json(SEND("Movie IMDB Rating is not Valid"));
          }
        } else {
          res.status(400).json(SEND("Movie Rated For is not Valid"));
        }
      } else {
        res.status(400).json(SEND("Movie Duration is not Valid"));
      }
    } else {
      res.status(400).json(SEND("Movie Short description is not Valid"));
    }
  } else {
    res.status(400).json(SEND("Movie name is not Valid"));
  }
};

exports.getStream = async (req, res) => {
  let { movie_id, choice } = req.params;
  console.log(movie_id, choice);
  const range = req.headers.range;
  if (!range) {
    res.status(400).send("Requires Range header");
  }
  const getMovie = await Movie.findOne({ _id: movie_id });
  if (getMovie) {
    // console.log(getMovie);
    let videoPath;
    if (choice == "movie") {
      videoPath =
        "./public/movie/" + getMovie.name + "/" + getMovie.movie_source;
    } else {
      videoPath =
        "./public/movie/" + getMovie.name + "/" + getMovie.trailer_source;
    }
    // const videoPath = "./public/movie/Iron Man/Iron Man.mp4";
    const videoSize = fs.statSync(videoPath).size;

    // Parse Range
    // Example: "bytes=32324-"
    const CHUNK_SIZE = 10 ** 6; // 1MB
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    // Create headers
    const contentLength = end - start + 1;
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "video/mp4",
    };

    // HTTP Status 206 for Partial Content
    res.writeHead(206, headers);

    // create video read stream for this particular chunk
    const videoStream = fs.createReadStream(videoPath, { start, end });

    // Stream the video chunk to the client
    videoStream.pipe(res);
  } else {
    res.status(400).send("Movie Not Found");
  }
};

exports.getGenres = async (req, res) => {
  let genres = await Movie.find({}).select("genre -_id");
  let total_genres = [];
  genres.forEach((element) => {
    element.genre.forEach((element2) => {
      if (!total_genres.includes(element2)) {
        total_genres.push(element2);
      }
    });
  });
  res.send(SEND("Genre Data", total_genres));
};
exports.update = (req, res) => {
  res.send("Update a Movie");
};

exports.delete = (req, res) => {
  res.send("Delete a Movie");
};

exports.getByGenre = async (req, res) => {
  let { start, length, date_filter, genre } = req.body;
  let filter = {};
  length = !length ? 10 : length;
  start = !start ? 0 : start;
  let total_records = await Movie.countDocuments({});

  if (genre && genre != "") {
    filter.genre = { $elemMatch: { $eq: genre } };
    console.log(filter);
    let moviedata = await Movie.find(filter);

    if (moviedata) {
      res.send(SEND("Movie Data Found", moviedata));
    } else {
      res.status(400).json(SEND("No Movie Data Found"));
    }
  } else {
    res.status(400).json(SEND("No Movie Data Found"));
  }
};
