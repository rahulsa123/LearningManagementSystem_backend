const express = require("express");
const auth = require("../middleware/auth");
const isFaculty = require("../middleware/faculty");
const validateObjectId = require("../middleware/validateObjectId");
const { Course, validateCourse } = require("../models/course");
const routes = express.Router();

routes.get("/", async (req, res) => {
  const courses = await Course.find().populate("faculty", "_id name image");
  res.send(courses);
});

routes.post("/", auth, isFaculty, async (req, res) => {
  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let course = new Course(req.body);
  course.faculty = req.user._id;
  try {
    const result = await course.save();
    return res.send(result);
  } catch (err) {
    return res.status(400).send("unable to create course");
  }
});

routes.get("/byme", auth, isFaculty, async (req, res) => {
  const courses = await Course.find({ faculty: req.user._id });
  res.send(courses);
});
routes.get("/:id", validateObjectId, async (req, res) => {
  const course = await Course.findOne(req.params.id).populate(
    "faculty",
    "_id name image"
  );
  if (!course) return res.status(404).send("Course not found.");
  res.send(course);
});

module.exports = routes;
