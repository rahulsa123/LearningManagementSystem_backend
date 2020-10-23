const mongoose = require("mongoose");

const EnrollmentSchema = new mongoose.Schema({
  enrolled: {
    type: Date,
    default: Date.now,
  },
  student: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  course: {
    type: mongoose.Types.ObjectId,
    ref: "Course",
  },
});
module.exports.Enrollment = mongoose.model("Enrollment", EnrollmentSchema);
