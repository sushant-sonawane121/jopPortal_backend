const mongoose = require("mongoose");

const jobSeekerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/.+\@.+\..+/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: true,
    },
    accountType: {
      type: String,
      default: "JobSeeker",
    },
    appliedJobs: [
      {
        jobId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Job",
          required: true,
        },
        employerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Employer", // Assuming you have an Employer model
          required: true,
        },
        status: {
          type: String,
          enum: ["Pending", "Accepted", "Rejected"],
          default: "Pending",
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("JobSeeker", jobSeekerSchema);
