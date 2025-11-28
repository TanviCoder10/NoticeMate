const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Show signin page
router.get('/signin', (req, res) => {
  res.render('signin', { message: null });
});

// Handle login
router.post('/signin', async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password) {
    return res.render('signin', { message: 'Enter both fields' });
  }

  const user = await User.findOne({ username });

  if (user) {
    const ok = await user.validatePassword(password);
    if (!ok) return res.render('signin', { message: 'Invalid credentials' });

    req.session.user = { id: user._id, username: user.username, role: user.role };
    if (user.role === 'admin') return res.redirect('/admin');
    // student
    // check if student has logged in before (we can store firstLogin flag or simple check createdAt)
    return res.redirect('/dashboard');
  } else {
    // create new student user (first-time student) - keep admin creation manual
    const newUser = new User({ username, role: role === 'admin' ? 'admin' : 'student' });
    await newUser.setPassword(password);
    await newUser.save();
    req.session.user = { id: newUser._id, username: newUser.username, role: newUser.role };
    return res.redirect('/dashboard');
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(()=> res.redirect('/signin'));
});

// Admin and dashboard routes rendering
router.get('/admin', async (req, res) => {
  if (!req.session.user || req.session.user.role !== 'admin') return res.redirect('/signin');
  // admin dashboard will load notices from DB via notices route or here
  res.render('admin_dashboard');
});

router.get('/dashboard', (req, res) => {
  if (!req.session.user) return res.redirect('/signin');
  // determine if new or existing: we'll treat users created within this session as new.
  // Better: add a flag. For simplicity, if createdAt is within 60 seconds -> new; else existing.
  // Fetch user
  User.findById(req.session.user.id).then(user => {
    if (!user) return res.redirect('/signin');
    const now = Date.now();
    const diff = now - user.createdAt.getTime();
    if (diff < 60 * 1000) {
      // new student
      return res.redirect('/dashboard/new');
    } else {
      return res.redirect('/dashboard/existing');
    }
  }).catch(err => res.redirect('/signin'));
});

router.get('/dashboard/new', (req, res) => {
  if (!req.session.user) return res.redirect('/signin');
  res.render('new_student_dashboard');
});

router.get('/dashboard/existing', (req, res) => {
  if (!req.session.user) return res.redirect('/signin');
  res.render('existing_student_dashboard');
});

module.exports = router;
