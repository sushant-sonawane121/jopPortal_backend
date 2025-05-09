const Employer = require("../models/employer.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

module.exports = { empRegister, empLogin };
