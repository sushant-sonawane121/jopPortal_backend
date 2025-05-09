const express = require("express");
const router = express.Router();

const {
  registerJobSeeker,
  loginJobSeeker,
  applyToJob,
} = require("../controllers/jobseeker.controller");

const authMiddleware = require("../middlewares/auth"); // Ensure this sets req.userId

// Auth Routes
router.post("/register", registerJobSeeker);
router.post("/login", loginJobSeeker);

// Job Application Route
router.post("/apply", authMiddleware, applyToJob);

module.exports = router;
