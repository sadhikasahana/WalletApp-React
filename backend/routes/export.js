const express = require('express');
const router = express.Router();
const { Parser } = require('json2csv');
const Expense = require('../models/Expense');
const User = require('../models/User');
const { getCurrentTimestamp } = require('react-native/types_generated/Libraries/Utilities/createPerformanceLogger');

router.get('/csv/:mobile', async (req, res) => {
    try {
        const user = await User.findOne({ mobile: req.params.mobile });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const expenses = await Expense.find({ userId: user._id }).lean();
        if (!expenses.length) return res.status(404).json({ message: 'No expenses found for this user' });

        const fields = ['category', 'amount', 'description', 'date'];
        const parser = new Parser({ fields });
        const csv = parser.parse(expenses);

        res.header('Content-Type', 'text/csv');
        res.attachment(`expenses_${getCurrentTimestamp}.csv`);
        return res.send(csv);
    } catch (error) {
        console.error('Error exporting expenses to CSV:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;