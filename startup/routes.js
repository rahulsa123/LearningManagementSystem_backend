const express = require("express");
const userRoutes = require("./../routes/users");
const loginRoutes = require("./../routes/auths");
const courseRoutes = require("./../routes/courses");
const enrollRoutes = require("./../routes/enrolled");
const error = require("./../middleware/error");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/users", userRoutes);
  app.use("/api/login", loginRoutes);
  app.use("/api/courses", courseRoutes);
  app.use("/api/enrolled", enrollRoutes);
  app.use(error);
};
