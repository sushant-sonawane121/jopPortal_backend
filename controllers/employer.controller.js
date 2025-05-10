const Employer = require("../models/employer.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JobSeeker = require("../models/jobseeker.model");

const JWT_SECRET = process.env.JWT_SECRET || "yoursecretkey";

// REGISTER
const empRegister = async (req, res) => {
  const { fullName, email, password, accountType, companyName } = req.body;

  try {
    const existingEmployer = await Employer.findOne({ email });
    if (existingEmployer) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployer = new Employer({
      fullName,
      email,
      password: hashedPassword,
      accountType,
      companyName: accountType === "employer" ? companyName : undefined,
    });

    await newEmployer.save();

    res.status(201).json({ message: "Registration successful." });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Registration failed.", error: error.message });
  }
};

// LOGIN
const empLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingEmployer = await Employer.findOne({ email });
    if (!existingEmployer) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, existingEmployer.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign(
      { id: existingEmployer._id, accountType: existingEmployer.accountType },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        id: existingEmployer._id,
        fullName: existingEmployer.fullName,
        email: existingEmployer.email,
        accountType: existingEmployer.accountType,
        companyName: existingEmployer.companyName,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed.", error: error.message });
  }
};
const getEmployerById = async (req, res) => {
  const { employerId } = req.body;

  try {
    const employer = await Employer.findById(employerId);
    
    if (!employer) {
      return res.status(404).json({ message: "Employer not found" });
    }

    res.status(200).json({
      id: employer._id,
      fullName: employer.fullName,
      email: employer.email,
      accountType: employer.accountType,
      companyName: employer.companyName,  // Only return the necessary details
    });
  } catch (error) {
    console.error("Error fetching employer details:", error);
    res.status(500).json({ message: "Failed to retrieve employer details", error: error.message });
  }
};

const getjobseakerappliedjob = async (req, res) => {
  const { employerId } = req.body;

  if (!employerId) {
    return res.status(400).json({ message: "Employer ID is required" });
  }

  try {
    // Find all jobseekers who have applied to jobs posted by this employer
    const jobSeekers = await JobSeeker.find({
      "appliedJobs.employerId": employerId,
    }).select("fullName email appliedJobs");

    // Filter and structure the response to only include matched jobs
    const filteredApplications = [];

    jobSeekers.forEach((js) => {
      const matchedJobs = js.appliedJobs.filter(
        (job) => job.employerId.toString() === employerId
      );

      matchedJobs.forEach((job) => {
        filteredApplications.push({
          jobSeekerId: js._id,
          fullName: js.fullName,
          email: js.email,
          jobId: job.jobId,
          status: job.status,
          appliedDate: job.date,
        });
      });
    });

    res.status(200).json(filteredApplications);
  } catch (err) {
    console.error("Error fetching applied jobs:", err);
    res.status(500).json({ message: "Server error" });
  }
};



module.exports = { empRegister, empLogin,getEmployerById,getjobseakerappliedjob };
