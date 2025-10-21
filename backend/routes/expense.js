const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const User = require('../models/User');

// Add a new expense
router.post('/', async (req, res) => {
    try {
        const { userId, amount, category, date, description } = req.body;
        if(!user) return res.status(404).json({ message: 'User not found' });

        const expense = new Expense({
            user:user._id,
            amount,
            category,
            date: date || Date.now(),
            description
        });
        await expense.save();
        res.json({msg: 'Expense added', expense});
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Get all expenses for a user
router.get('/list/:mobile', async (req, res) => {
    try {
        const user = await User.findOne({ mobile: req.params.mobile });
        if(!user) return res.status(404).json({ message: 'User not found' });

        const expenses = await Expense.find({ user: user._id }).sort({ date: -1 });
        res.json({ expenses });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;