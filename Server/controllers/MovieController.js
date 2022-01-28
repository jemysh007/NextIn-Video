const Movie = require("../Models/Movie");
const Check = require("../Helpers/Check");
var fs = require("fs");
var path = require("path");
const moment = require("moment");
var Ffmpeg = require("fluent-ffmpeg");

exports.getAll = (req, res) => {
  res.send("All Movie Data");
};

const SEND = (msg = "Invalid Requst", data = []) => {
  formottedData = {
    msg: msg,
    data: data,
  };
  return formottedData;
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
                    // Text Validated

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
                            let tailer_sourceExt = path.extname(
                              trailer_source.name
                            );
                            let banneruploadPath =
                              movie_name + " Banner" + bannerExt;
                            let movieuploadPath = movie_name + movie_sourceExt;
                            let taileruploadPath =
                              movie_name + " Tailer" + movie_sourceExt;

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
                              uploadPath + "/" + taileruploadPath,
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
                              available_in,
                              genre,
                              keywords,
                              timestamp: moment().unix(),
                            };

                            let addMovie = await Movie.create(insData);

                            res.send(addMovie);
                          } else {
                            res
                              .status(400)
                              .json(SEND("Please Upload Movie Source"));
                          }
                        } else {
                          res
                            .status(400)
                            .json(SEND("Please Upload Movie File"));
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

exports.update = (req, res) => {
  res.send("Update a Movie");
};

exports.delete = (req, res) => {
  res.send("Delete a Movie");
};
