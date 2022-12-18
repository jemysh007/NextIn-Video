const Series = require("../Models/Series");
const Season = require("../Models/Season");
const Episode = require("../Models/Episode");
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
  length = !length ? 10 : length;
  start = !start ? 0 : start;
  let total_records = await Series.countDocuments({});
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

  let seriesdata = await Series.find(filter)
    .limit(length)
    .skip(start)
    .sort({ timestamp: -1 });
  if (seriesdata) {
    res.send(
      SEND("Series Data Found", { nodedata: seriesdata, total_records })
    );
  } else {
    res.status(400).json(SEND("No Series Data Found"));
  }
};

exports.add = async (req, res) => {
  let {
    series_name,
    short_desc,
    rated_for,
    imdb,
    release_year,
    available_in,
    genre,
    keywords,
  } = req.body;

  if (!Check.isBlank(series_name) && Check.isString(series_name)) {
    if (!Check.isBlank(short_desc) && Check.isString(short_desc)) {
      if (!Check.isBlank(rated_for) && Check.isString(rated_for)) {
        if (!Check.isBlank(imdb) && parseFloat(imdb) > 0) {
          if (!Check.isBlank(release_year) && parseFloat(release_year) > 0) {
            if (!Check.isBlank(available_in) && Check.isString(available_in)) {
              if (!Check.isBlank(genre) && Check.isString(genre)) {
                if (!Check.isBlank(keywords) && Check.isString(keywords)) {
                  const isExistSeries = await Series.findOne({
                    name: series_name,
                  });
                  if (!isExistSeries) {
                    let insData = {
                      name: series_name,
                      short_desc,
                      rated_for,
                      imdb,
                      release_year,
                      available_in: available_in.split(","),
                      genre: genre.split(","),
                      keywords: keywords.split(","),
                      timestamp: moment().unix(),
                    };

                    let addSeries = await Series.create(insData);
                    res.send(SEND("Series Added Successfully"));
                  } else {
                    res.status(400).json(SEND("Series already exists"));
                  }
                } else {
                  res
                    .status(400)
                    .json(SEND("Choose Genre available for this Series"));
                }
              } else {
                res
                  .status(400)
                  .json(SEND("Choose Genre available for this Series"));
              }
            } else {
              res
                .status(400)
                .json(SEND("Choose Languages available for this Series"));
            }
          } else {
            res.status(400).json(SEND("Series Release Year is not Valid"));
          }
        } else {
          res.status(400).json(SEND("Series IMDB Rating is not Valid"));
        }
      } else {
        res.status(400).json(SEND("Series Rated For is not Valid"));
      }
    } else {
      res.status(400).json(SEND("Series Short description is not Valid"));
    }
  } else {
    res.status(400).json(SEND("Series name is not Valid"));
  }
};

exports.addSeason = async (req, res) => {
  let { season_name, short_desc, series_id } = req.body;
  const getSeries = await Series.findById(series_id);
  if (getSeries) {
    let insData = {
      name: season_name,
      short_desc,
      timestamp: moment().unix(),
      series: getSeries._id,
    };

    let banneruploadPath = "";
    let traileruploadPath = "";

    if (req.files && Object.keys(req.files).length > 0) {
      let uploadPath = "./public/series/" + getSeries.name;
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath);
      }
      let { banner, trailer_source } = req.files;
      if (banner) {
        let bannerExt = path.extname(banner.name);
        banneruploadPath =
          getSeries.name + " " + season_name + " Banner" + bannerExt;
        banner.mv(uploadPath + "/" + banneruploadPath, function (err) {
          if (err) {
            res.status(400).json(SEND(err));
          }
          console.log("Season Banner uploaded");
        });
        insData.banner = banneruploadPath;
      }
      if (trailer_source) {
        let trailer_sourceExt = path.extname(trailer_source.name);
        traileruploadPath =
          getSeries.name + " " + season_name + " Trailer" + trailer_sourceExt;
        trailer_source.mv(uploadPath + "/" + traileruploadPath, function (err) {
          if (err) {
            res.status(400).json(SEND(err));
          }
          console.log("Season Trailer Uploaded");
        });
        insData.trailer_source = traileruploadPath;
      }
    }
    let addSeason = await Season.create(insData);
    if (addSeason) {
      let addSeasonToSeries = await Series.updateOne(
        { _id: getSeries._id },
        { $push: { seasons: addSeason._id } }
      );
      if (addSeasonToSeries) {
        res.send(SEND("Season Added Successfully"));
      }
    }
  } else {
    res.status(400).json(SEND("No Series Data Found"));
  }
};

exports.getSeasons = async (req, res) => {
  let { series_id } = req.body;
  if (series_id) {
    const getSeasons = await Season.find({ series: series_id });
    if (getSeasons) {
      res.send(SEND("Movie Data Found", getSeasons));
    } else {
      res.status(400).json(SEND("No Seasons Found"));
    }
  } else {
    res.status(400).json(SEND("Please Enter Valid Season ID"));
  }
};

exports.addEpisode = async (req, res) => {
  let { season_id, episode_title, short_desc } = req.body;
  let season = await Season.findById(season_id).populate({
    path: "series",
    select: "name",
  });
  console.log(season);
  let episodesCount = await Episode.count();
  console.log(episodesCount);
  if (season_id) {
    if (season) {
      if (req.files && Object.keys(req.files).length > 0) {
        let uploadPath = "./public/series/" + season.series.name;
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath);
        }
        let insData = {
          title: episode_title,
          short_desc,
          timestamp: moment().unix(),
        };
        let { video } = req.files;
        if (video) {
          let episodeExt = path.extname(video.name);
          episodeuploadPath =
            season.series.name +
            " " +
            "Episode " +
            episodesCount +
            1 +
            " : " +
            episode_title +
            +episodeExt;
          video.mv(uploadPath + "/" + episodeuploadPath, function (err) {
            if (err) {
              res.status(400).json(SEND(err));
            }
            console.log("Season Banner uploaded");
          });
          insData.video_source = episodeuploadPath;
          let episodeCreate = await Episode.create(insData);
          res.send(episodeCreate);
        }
      } else {
        res.status(400).json(SEND("Please Upload Episode Source File"));
      }
    } else {
      res.status(400).json(SEND("No Season Data Found"));
    }
  } else {
    res.status(400).json(SEND("Please Select Any Season "));
  }
};
