const express = require("express");
const router = express.Router();
const Notice = require("../models/Notice");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// --- Multer setup ---
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const fname = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, fname);
  }
});
const upload = multer({ storage });

// --- Admin dashboard ---
router.get("/dashboard", async (req, res) => {
  const notices = await Notice.find().sort({ createdAt: -1 });
  res.render("admin_dashboard", { notices });
});

// --- Post new notice (with file upload) ---
router.get("/post", (req, res) => res.render("post_notice"));

router.post("/post", upload.single("attachment"), async (req, res) => {
  const { title, category, description, expiry } = req.body;
  const attachment = req.file ? `/uploads/${req.file.filename}` : null;
  await Notice.create({ title, category, description, expiry, attachment });
  res.redirect("/admin/dashboard");
});

// --- Edit notice ---
router.get("/edit/:id", async (req, res) => {
  const notice = await Notice.findById(req.params.id);
  res.render("edit_notice", { notice });
});

router.put("/edit/:id", async (req, res) => {
  const { title, category, description, expiry } = req.body;
  await Notice.findByIdAndUpdate(req.params.id, { title, category, description, expiry });
  res.redirect("/admin/dashboard");
});

// --- Delete notice ---
router.delete("/delete/:id", async (req, res) => {
  const n = await Notice.findByIdAndDelete(req.params.id);
  if (n && n.attachment) {
    const fp = path.join(__dirname, "..", n.attachment);
    if (fs.existsSync(fp)) fs.unlinkSync(fp);
  }
  res.redirect("/admin/dashboard");
});

module.exports = router;

