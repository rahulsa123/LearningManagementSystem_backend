const express = require("express");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const { Course } = require("../models/course");
const { Enrollment } = require("../models/enrollment");

const routes = express.Router();

routes.get("/", auth, async (req, res) => {
  const enrolledCourse = await Enrollment.find({
    student: req.user._id,
  }).populate("course");
  res.send(enrolledCourse);
});
routes.post("/", auth, async (req, res) => {
  const courseId = req.body.courseId;
  if (!(courseId && mongoose.Types.ObjectId.isValid(courseId)))
    return res.status(400).send("valid CourseId is required.");
  let ref = await Enrollment.findOne({
    student: req.user._id,
    course: courseId,
  });
  if (ref) return res.status(400).send("Already registred for course.");
  let course = await Course.findOne({ _id: courseId });
  if (!course) return res.status(404).send("Course not found.");
  let enrollment = new Enrollment({
    student: req.user._id,
    course: courseId,
  });

  // start transaction
  const session = mongoose.startSession();
  (await session).startTransaction();

  course.waitlistCapacity += 1;
  course = await course.save();
  enrollment = await enrollment.save();

  (await session).commitTransaction();
  (await session).endSession();
  if (course && enrollment) res.send(enrollment);
  else res.status(400).send("suring enrollment some error occurred.");
});

module.exports = routes;
