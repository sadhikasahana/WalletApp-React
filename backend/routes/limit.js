const express = require('express');

const Limit = require('../models/Limit');

const User = require('../models/User');

const Expense = require('../models/Expense');

const router = express.Router();

// Set or update category limit

router.post('/set', async (req, res) => {

  const { mobile, category, limit } = req.body;

  try {

    const user = await User.findOne({ mobile });

    if (!user) return res.status(404).json({ msg: 'User not found' });

    let catLimit = await Limit.findOne({ user: user._id, category });

    if (catLimit) {

      catLimit.limit = limit;

      await catLimit.save();

    } else {

      catLimit = new Limit({ user: user._id, category, limit });

      await catLimit.save();

    }

    res.json({ msg: 'Limit set', limit: catLimit });

  } catch (err) {

    res.status(500).json({ msg: 'Server error' });

  }

});

// Check if category limit exceeded

router.get('/check/:mobile/:category', async (req, res) => {

  try {

    const user = await User.findOne({ mobile: req.params.mobile });

    if (!user) return res.status(404).json({ msg: 'User not found' });

    const catLimit = await Limit.findOne({ user: user._id, category: req.params.category });

    if (!catLimit) return res.json({ exceeded: false });

    const expenses = await Expense.find({ user: user._id, category: req.params.category });

    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    res.json({ exceeded: total > catLimit.limit, total, limit: catLimit.limit });

  } catch (err) {

    res.status(500).json({ msg: 'Server error' });

  }

});

module.exports = router;