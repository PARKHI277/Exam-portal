require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3 },
  email: { type: String, required: true, unique: true },
  studentNum: { type: Number, required: true, unique: true },
  rollNum: { type: Number, required: true, unique: true },
  mobileNum: {
    type: Number,
    required: true,
    maxlength: 10,
    minlength: 10,
    unique: true,
  },
  password: { type: String },
  adminPassword: { type: String },
  year: { type: Number, required: true, min: 1, max: 4 },
  branch: { type: String, required: true },
  gender: { type: String, required: true },
  isHosteler: { type: Boolean, default: false, required: true },
  hasAppeared: { type: Boolean, default: false },
  loginAt: {
    type: Date,
    default: null,
  },
  login_user: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  lang: { type: String },
  userNumCount: {
    NumHtml: { type: Number, default: 0 },
    NumCss: { type: Number, default: 0 },
    NumSql: { type: Number, default: 0 },
    NumAptitude: { type: Number, default: 0 },
    NumLang: { type: Number, default: 0 },
    TotalNum: {
      type: Number,
      default: 0,
    },
  },
});

// token generate---------
UserSchema.methods.generateAuthToken = async function () {
  try {
    const pay_load = { _id: this._id };
    const token = jwt.sign(pay_load, process.env.TOKEN_SECRET_KEY);
    return token;
  } catch (err) {
    res.status(400).send(err);
  }
};

// password encryption------------
UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  if (this.isModified("adminPassword")) {
    this.adminPassword = await bcrypt.hash(this.adminPassword, saltRounds);
  }
  next();
});

const User = new mongoose.model("User", UserSchema);
module.exports = User;

//    --------registration-------
//     name : String,
//     email: String
//     studentNum:Number
//     rollNum: Number
//     mobileNum: Number
//     password: String
//     year: Number
//     branch: String
//     gender: String
//     isHosteler: Boolean
//     startTime: Number
