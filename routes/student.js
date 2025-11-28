// routes/student.js
const express = require("express");
const router = express.Router();
const Notice = require("../models/Notice");
const User = require("../models/User");

// --- Ensure demo users exist automatically ---
async function ensureDefaultUsers() {
  const adminExists = await User.findOne({ role: "admin" });
  const studentExists = await User.findOne({ role: "student" });

  if (!adminExists) {
    const admin = new User({ username: "admin", role: "admin" });
    await admin.setPassword("admin123");
    await admin.save();
    console.log("✅ Default admin created (username: admin, password: admin123)");
  }

  if (!studentExists) {
    const student = new User({ username: "student01", role: "student" });
    await student.setPassword("1234");
    await student.save();
    console.log("✅ Default student created (username: student01, password: 1234)");
  }
}
ensureDefaultUsers(); // run once at startup

// --- Login Page ---
router.get("/", (req, res) => {
  res.render("signin", { message: null });
});

// --- Handle login POST ---
router.post("/signin", async (req, res) => {
  const { username, password, role } = req.body;

  const user = await User.findOne({ username, role });
  if (!user) {
    return res.render("signin", { message: "❌ User not found" });
  }

  const isValid = await user.validatePassword(password);
  if (!isValid) {
    return res.render("signin", { message: "❌ Invalid password" });
  }

  req.session.user = { username: user.username, role: user.role };

  if (user.role === "admin") {
    return res.redirect("/admin/dashboard");
  } else {
    return res.redirect("/student/new");
  }
});

// --- Student dashboard (new) ---
router.get("/student/new", async (req, res) => {
  if (!req.session.user) return res.redirect("/");

  const currentUser = req.session.user;
  const notices = await Notice.find({ expiry: { $gte: new Date() } }).sort({ createdAt: -1 });
  res.render("new_student_dashboard", { notices, currentUser });
});

// --- Student dashboard (existing) ---
router.get("/student/existing", async (req, res) => {
  if (!req.session.user) return res.redirect("/");

  const currentUser = req.session.user;
  const notices = await Notice.find().sort({ createdAt: -1 });
  res.render("existing_student_dashboard", { notices, currentUser });
});

// --- Logout ---
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
