const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();

// Import Routes
const employerRoutes = require("./routes/employerRoutes");
const jobRoutes = require("./routes/job.routes");
const jobSeekerRoutes = require("./routes/jobSeeker.route");  // Added JobSeeker routes

const app = express();

// Connect to DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/employer", employerRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/jobseeker", jobSeekerRoutes);  // Added JobSeeker API route

app.get("/",(req,res)=>{
      res.send("Server is Running");
})
// Server Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
