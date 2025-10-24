const express = require('express');
const router = express.Router();
const Goal = require('../models/Goal');
const User = require('../models/User');

router.post('/setl', async (req, res) => {
    const { mobile, month, amount } = req.body;
    try {
        const user = await User.findOne({ mobile });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        let goal = await Goal.findOne({ user: user._id, month });
        if (goal) {
            goal.amount = amount;
            await goal.save();
        } else {
            goal = new Goal({ user: user._id, month, amount });
            await goal.save();
        }
        res.status(200).json({ message: 'Goal set successfully', goal });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

router.get('/get/:mobile/:month', async (req, res) => {
    try{
        const user = await User.findOne({ mobile: req.params.mobile });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const goal = await Goal.findOne({ user: user._id, month: req.params.month });
        res.status(200).json({ goal });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;