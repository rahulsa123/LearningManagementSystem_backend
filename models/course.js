const Joi = require("joi");
const { number } = require("joi");
const mongoose = require("mongoose");
const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true,
    trim: true,
  },
  courseDept: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  courseRoom: {
    type: Number,
    required: true,
  },
  waitlistCapacity: {
    type: Number,

    default: 0,
  },
  courseTeam: {
    type: String,
  },
  faculty: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
});
const Course = mongoose.model("Course", courseSchema);
function validateCourse(course) {
  const schema = Joi.object({
    courseName: Joi.string().min(5).max(255).required(),
    courseDept: Joi.string().min(5).max(255).required(),
    description: Joi.string().min(5).max(500).required(),
    courseRoom: Joi.number().min(5).max(255).required(),
    waitlistCapacity: Joi.number().min(0),
    courseTeam: Joi.string(),
  });
  return schema.validate(course);
}
module.exports.Course = Course;
module.exports.validateCourse = validateCourse;
