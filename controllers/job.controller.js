const Job = require("../models/jobs.model");
const Employer = require("../models/employer.model");

const createJob = async (req, res) => {
  try {
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
    res
      .status(500)
      .json({ message: "Failed to retrieve jobs", error: error.message });
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

const updateJobByBodyId = async (req, res) => {
  try {
    const employerId = req.body._id; // From auth middleware
    const jobId = req.body.id;

    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required in request body." });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }

    // Check if the employer owns the job
    if (job.employer.toString() !== employerId.toString()) {
      return res.status(403).json({ message: "Unauthorized to update this job." });
    }

    // Update fields if they exist in req.body
    const {
      jobTitle,
      jobType,
      category,
      jobDescription,
      requirements,
      salaryRange,
      company,
    } = req.body;

    if (jobTitle) job.jobTitle = jobTitle;
    if (jobType) job.jobType = jobType;
    if (category) job.category = category;
    if (jobDescription) job.jobDescription = jobDescription;
    if (requirements) job.requirements = requirements;
    if (salaryRange) job.salaryRange = salaryRange;
    if (company) job.company = company;

    const updatedJob = await job.save();

    res.status(200).json({ message: "Job updated successfully.", job: updatedJob });
  } catch (error) {
    console.error("Update job error:", error);
    res.status(500).json({ message: "Server error while updating job." });
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  deleteJob,
  updateJobByBodyId
};
