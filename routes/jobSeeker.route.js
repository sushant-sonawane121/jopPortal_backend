const express = require("express");
const router = express.Router();

const {
  registerJobSeeker,
  loginJobSeeker,
  applyToJob,
  getAppliedJobs,
} = require("../controllers/jobseeker.controller");

const authMiddleware = require("../middlewares/auth"); // This should set req.userId

// Auth Routes
router.post("/register", registerJobSeeker);
router.post("/login", loginJobSeeker);

// Job Application Route
router.post("/apply", authMiddleware, applyToJob);

// Get Applied Jobs (Authenticated)
router.post("/appliedjobs", authMiddleware, getAppliedJobs);



module.exports = router;
