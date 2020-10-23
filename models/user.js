const { string } = require("joi");
const Joi = require("joi");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 50,
    unique: true,
  },
  hashed_password: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  image: {
    type: String,
    required: true,
  },
  phone_number: {
    type: String,
    minlength: 10,
    maxlength: 10,
  },
  about_me: {
    type: String,
  },
  city: {
    type: String,
  },
  country: {
    type: String,
  },
  company: {
    type: String,
  },
  school: {
    type: String,
  },
  hometown: {
    type: String,
  },
  languages: {
    type: [String],
  },
  gender: {
    type: String,
    enum: ["male", "female", "others"],
    required: true,
  },
  isfaculty: {
    type: Boolean,
    required: true,
  },
});
userSchema.methods.setPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);

  const hashed_password = await bcrypt.hash(password, salt);
  return hashed_password;
};

userSchema.methods.genrateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      email: this.email,
      isfaculty: this.isfaculty,
    },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required(),
    phone_number: Joi.string().min(10).max(10),
    about_me: Joi.string(),
    city: Joi.string(),
    country: Joi.string(),
    company: Joi.string(),
    school: Joi.string(),
    hometown: Joi.string(),
    languages: Joi.array(),
    gender: Joi.string().valid("male", "female", "others").required(),
    isfaculty: Joi.boolean().required(),
  });
  return schema.validate(user);
}

exports.User = User;
exports.validateUser = validateUser;
