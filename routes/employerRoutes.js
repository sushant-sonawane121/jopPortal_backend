const express = require("express");
const router = express.Router();
const verifyEmployerToken = require("../middlewares/auth");
const { empRegister, empLogin, getEmployerById, getjobseakerappliedjob } = require("../controllers/employer.controller");

// Registration Route
router.post("/register", empRegister);

// Login Route
router.post("/login", empLogin);


// get by it
router.post("/getEmployer",getEmployerById);


// get jobs form jobseakers
router.post("/getjobseakerappliedjob",verifyEmployerToken,getjobseakerappliedjob);

module.exports = router;
