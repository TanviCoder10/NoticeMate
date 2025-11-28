const express = require('express');
const router = express.Router();
const Notice = require('../models/Notice');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const fname = Date.now() + '-' + file.originalname.replace(/\s+/g,'_');
    cb(null, fname);
  }
});
const upload = multer({ storage });

// post new notice (admin)
router.get('/post', (req, res) => {
  if (!req.session.user || req.session.user.role !== 'admin') return res.redirect('/signin');
  res.render('post_notice', { message: null });
});

router.post('/post', upload.single('attachment'), async (req, res) => {
  if (!req.session.user || req.session.user.role !== 'admin') return res.redirect('/signin');
  const { title, category, description, expiry } = req.body;
  const attachment = req.file ? `/uploads/${req.file.filename}` : null;

  const n = new Notice({ title, category, description, expiry: expiry || null, attachment });
  await n.save();
  res.redirect('/admin');
});

// admin view notices and delete
router.get('/all', async (req, res) => {
  const notices = await Notice.find().sort({ createdAt: -1 });
  res.json(notices); // for API usage; front-end pages will embed notices within templates where needed
});

// delete notice
router.post('/delete/:id', async (req, res) => {
  if (!req.session.user || req.session.user.role !== 'admin') return res.redirect('/signin');
  const id = req.params.id;
  const n = await Notice.findByIdAndDelete(id);
  if (n && n.attachment) {
    const fp = path.join(__dirname, '..', n.attachment);
    if (fs.existsSync(fp)) fs.unlinkSync(fp);
  }
  res.redirect('/admin');
});

module.exports = router;
