function isFaculty(req, res, next) {
  if (!req.user.isfaculty)
    return res
      .status(403)
      .send("Access denied. only faculty can create course");
  next();
}
module.exports = isFaculty;
