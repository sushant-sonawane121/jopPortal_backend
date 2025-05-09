const express = require("express");
const router = express.Router();

const { empRegister, empLogin } = require("../controllers/employer.controller");

// Registration Route
router.post("/register", empRegister);

// Login Route
router.post("/login", empLogin);

module.exports = router;
