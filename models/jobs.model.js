const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },
    jobType: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    postedOn: {
      type: Date,
      default: Date.now,
    },
    salaryRange: {
      min: {
        type: Number,
        required: true,
      },
      max: {
        type: Number,
        required: true,
      },
    },
    jobDescription: {
      type: String,
      required: true,
    },
    requirements: {
      type: [String],
      required: true,
    },
    company: {
      name: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      about: {
        type: String,
        required: true,
      },
    },
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employer",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
