const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();

// Import Routes
const employerRoutes = require("./routes/employerRoutes");
const jobRoutes = require("./routes/job.routes");
const jobSeekerRoutes = require("./routes/jobSeeker.route");

const app = express();

// Connect to Database
connectDB();

// Define allowed origins (add more if needed)
const allowedOrigins = [
  "http://localhost:3000",
  "https://job-portal-frontend-vert-one.vercel.app"
];

// CORS Configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin like curl or Postman
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// Body parser
app.use(express.json());

// Routes
app.use("/api/employer", employerRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/jobseeker", jobSeekerRoutes);

// Health Check Route
app.get("/", (req, res) => {
  res.send("Server is Running");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
