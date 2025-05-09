const mongoose = require("mongoose");

const employerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    companyName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+@.+\..+/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    accountType: {
      type: String,
      enum: ["employer", "admin", "recruiter"],
      default: "employer",
    },
  },
  { timestamps: true }
);

const Employer = mongoose.model("Employer", employerSchema);
module.exports = Employer;
