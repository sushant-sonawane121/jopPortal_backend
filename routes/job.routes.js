const express = require("express");
const router = express.Router();
const { createJob, getAllJobs, getJobById, deleteJob } = require("../controllers/job.controller");
const verifyEmployerToken = require("../middlewares/auth");

router.get("/", getAllJobs);
router.get("/:id", getJobById);

router.post("/create", verifyEmployerToken, createJob);
router.delete("/:id", verifyEmployerToken, deleteJob);

module.exports = router;
