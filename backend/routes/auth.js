const express = require('express');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const User = require('../models/User');

const router = express.Router();

// Register

router.post('/register', async (req, res) => {

  const { mobile, email, mpin } = req.body;

  try {

    const existing = await User.findOne({ $or: [{ mobile }, { email }] });

    if (existing) return res.status(400).json({ msg: 'User already exists' });

    const hashedMpin = await bcrypt.hash(mpin, 10);

    const user = new User({ mobile, email, mpin: hashedMpin });

    await user.save();

    res.json({ msg: 'Registered successfully' });

  } catch (err) {

    res.status(500).json({ msg: 'Server error' });

  }

});

// Login

router.post('/login', async (req, res) => {

  const { mobile, mpin } = req.body;

  try {

    const user = await User.findOne({ mobile });

    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(mpin, user.mpin);

    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { mobile: user.mobile, email: user.email } });

  } catch (err) {

    res.status(500).json({ msg: 'Server error' });

  }

});

module.exports = router;