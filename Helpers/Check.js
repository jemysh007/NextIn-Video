const moment = require("moment");
var bcrypt = require("bcryptjs");
var fs = require("fs");
const { response } = require("express");

module.exports = {
  hello: (val) => {
    console.log("Hello", val);
  },
  isBlank(val) {
    return val == null || val == "" || val == undefined;
  },
  isInt(val) {
    return Number.isInteger(val); //true
  },
  isFloat(n) {
    return Number(n) === n && n % 1 !== 0;
  },
  isString(val) {
    return typeof val === "string" || val instanceof String;
  },
  isEmail(val) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(val).toLowerCase());
  },
  isInLimit(val, min, max) {
    return val >= min && val <= max;
  },
  removeSpechars(val) {
    val.replace(/[^\w\s]/gi, "");
  },
  isStrongPassword(pass) {
    const re = /^(?=.{8,}$)(?=.*[A-Za-z])(?=.*[0-9])(?=.*\W).*$/;
    return re.test(pass);
  },
  isUsername(uname) {
    return uname.length > 4;
  },
  getOtp(min = 100000, max = 999999) {
    return Math.floor(Math.random() * (max - min) + min);
  },
  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  },
  randomString(
    length = 34,
    chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
  ) {
    var result = "";
    for (var i = length; i > 0; --i)
      result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  },
  range(min, max) {
    let carray = [];
    for (var i = min; i <= max; i++) {
      carray.push(i);
    }
    return carray;
  },
  getReferralUniqueCode() {
    let num = moment().unix();
    return (
      parseFloat(num.toString().split("").reverse().join("")) * Math.sign(num)
    );
  },
  async createAdmin() {
    const getAdmin = await Admin.findOne({});
    if (!getAdmin) {
      var salt = bcrypt.genSaltSync(10);
      let password = "admin123";
      var hash = bcrypt.hashSync(password, salt);
      let insdata = {
        email: "admin@gmail.com",
        password: hash,
        timestamp: moment().unix(),
      };
      let createUser = await Admin.create(insdata);
      if (createUser) {
        console.log("Admin Created");
      }
    } else {
      console.log("Admin Already Exist");
    }
  },
  async createConfigs() {
    const getConfig = await Config.findOne({});
    if (!getConfig) {
      let insdata = {
        admin_address: "admaddress1",
        referral_earning_prc: 10,
      };
      let createConfig = await Config.create(insdata);
      if (createConfig) {
        console.log("Configuration Created");
      }
    } else {
      console.log("Configuation Already Exist");
    }
  },
  writeLog(data) {
    let insData = "";
    // console.log(data.message);
    insData = "\nError Occured : " + data.name + " | " + data.message + "\n";
    fs.appendFile("AccessLog.txt", insData, function (err) {
      if (err) {
        console.log(err);
      }
    });
  },
  writeResponse(data) {
    let insData = "";
    // console.log(data.message);
    insData = "Response Data : " + JSON.stringify(data) + "\n";
    fs.appendFile("AccessLog.txt", insData, function (err) {
      if (err) {
        console.log(err);
      }
    });
  },
};
