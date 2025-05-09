const JobSeeker = require("../models/jobseeker.model"); // Ensure this is the correct model import
const Job = require("../models/jobs.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "yoursecretkey";

// REGISTER
const registerJobSeeker = async (req, res) => {
  const { fullName, email, password, accountType } = req.body;

  try {
    // Check if the job seeker already exists
    const existingJobSeeker = await JobSeeker.findOne({ email });
    if (existingJobSeeker) {
      return res.status(400).json({ message: "Email already registered." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new JobSeeker
    const newJobSeeker = new JobSeeker({
      fullName,
      email,
      password: hashedPassword,
      accountType,
    });

    await newJobSeeker.save();

    // Send success response
    res.status(201).json({ message: "Registration successful." });
  } catch (error) {
    console.error("Error:", error.message);
    res
      .status(500)
      .json({ message: "Registration failed.", error: error.message });
  }
};

// LOGIN
const loginJobSeeker = async (req, res) => {
  const { email, password } = req.body;

  try {
    const jobSeeker = await JobSeeker.findOne({ email });
    if (!jobSeeker) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, jobSeeker.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: jobSeeker._id, accountType: jobSeeker.accountType },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        id: jobSeeker._id,
        fullName: jobSeeker.fullName,
        email: jobSeeker.email,
        accountType: jobSeeker.accountType,
      },
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Login failed.", error: error.message });
  }
};

// Apply to a Job
const applyToJob = async (req, res) => {
  const { jobId, userId, employerId } = req.body; // Get userId from request body

  if (!jobId || !userId) {
    return res.status(400).json({ message: "Missing jobId or userId." });
  }

  try {
    // Validate job existence
    const job = await Job.findById(jobId);
    if (!job) {
      console.log("Job not found");
      return res.status(404).json({ message: "Job not found." });
    }

    // Find job seeker
    const jobSeeker = await JobSeeker.findById(userId);
    if (!jobSeeker) {
      console.log("Job seeker not found:", userId);
      return res.status(404).json({ message: "Job seeker not found." });
    }

    // Check if already applied
    const alreadyApplied = jobSeeker.appliedJobs.some(
      (application) => application.jobId.toString() === jobId
    );

    if (alreadyApplied) {
      return res.status(400).json({ message: "Already applied to this job." });
    }

    // Add job application
    jobSeeker.appliedJobs.push({ jobId, employerId,  status: "Pending" });
    await jobSeeker.save();

    res.status(200).json({ message: "Job application submitted successfully." });
  } catch (error) {
    console.error("Error applying for job:", error);
    res.status(500).json({ message: "Server error while applying for job." });
  }
};


module.exports = { registerJobSeeker, loginJobSeeker, applyToJob };
