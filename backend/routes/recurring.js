const express = require('express');
const router = express.Router();
const RecurringExpense = require('../models/RecurringExpense');
const User = require('../models/User');

// Add a new recurring expense
router.post('/add', async (req, res) => {
    const { mobile, category, amount, description, frequency, nextDue } = req.body;
    try {
        const user = await User.findById(userId);
        if(!user) return res.status(404).json({ message: 'User not found' });
        const recurringExpense = new RecurringExpense({
            user: user._id,
            category,
            amount,
            description,
            frequency,
            nextDue
        });
        await recurringExpense.save();
        res.json({ msg: 'Recurring expense added', recurringExpense });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Get all recurring expenses for a user
router.get('/list/:mobile', async (req, res) => {
    try {
        const user = await User.findOne({ mobile: req.params.mobile });
        if(!user) return res.status(404).json({ message: 'User not found' });

        const recurringExpenses = await RecurringExpense.find({ user: user._id }).sort({ nextDue: 1 });
        res.json({ recurringExpenses });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Get due recurring expenses for a user for reminder
router.get('/due/:mobile', async (req, res) => {
    try {
        const user = await User.findOne({ mobile: req.params.mobile });
        if(!user) return res.status(404).json({ message: 'User not found' });

        const today = new Date();
        todau.setHours(0,0,0,0);

        const due = await RecurringExpense.find({
            user: user._id,
            nextDue: { $lte: today}
        }).sort({nextDue: 1});

        res.json(due);
    } catch (error) {
        res.status(500).json({msg: 'Server Error', error})
    }
});

module.exports = router;