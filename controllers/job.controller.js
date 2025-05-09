const Job = require("../models/jobs.model");
const Employer = require("../models/employer.model");

const createJob = async (req, res) => {
  try {
    console.log(req.body); // Optional: for debugging
    const {
      jobTitle,
      jobType,
      category,
      jobDescription,
      requirements,
      salaryRange,
      company,
      employerId,
    } = req.body;

    if (!employerId) {
      return res.status(400).json({ message: "Employer ID is required" });
    }

    // ✅ Check if employer exists in Employer model
    const employerExists = await Employer.findById(employerId);
    if (!employerExists) {
      return res.status(400).json({ message: "Employer not found" });
    }

    const newJob = new Job({
      jobTitle,
      jobType,
      category,
      jobDescription,
      requirements,
      salaryRange: {
        min: Number(salaryRange.min),
        max: Number(salaryRange.max),
      },
      company,
      employer: employerId,
    });

    const savedJob = await newJob.save();

    res.status(201).json({
      message: "Job listing created successfully",
      job: savedJob,
    });
  } catch (err) {
    console.error("Error creating job listing:", err);
    res
      .status(500)
      .json({ message: "Error creating job listing", error: err.message });
  }
};

const getAllJobs = async (req, res) => {
  try {
    const { search, category, jobType } = req.query; // Include jobType parameter

    // Build query based on search, category, and jobType parameters
    const query = {};

    // If a search term is provided, filter jobs by job title
    if (search) {
      query.jobTitle = { $regex: search, $options: "i" }; // Case-insensitive search
    }

    // If category is provided and not set to 'All', filter jobs by category
    if (category && category !== "All") {
      query.category = category;
    }

    // If jobType is provided, filter jobs by job type
    if (jobType && jobType !== "All") {
      query.jobType = jobType;
    }

    // Fetch jobs from the database based on the query
    const jobs = await Job.find(query)
      .populate("employer", "fullName email")
      .sort({ createdAt: -1 });

    res.status(200).json(jobs); // Return the filtered job data
    
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve jobs", error: error.message });
  }
};



const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "employer",
      "fullName email"
    );
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.status(200).json(job);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve job", error: error.message });
  }
};

const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) return res.status(404).json({ message: "Job not found" });

    if (req.user?.id && job.employer.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this job" });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete job", error: error.message });
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  deleteJob,
};
