const mongoose = require('mongoose');

const RecurringExpenseSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    description: { type: String },
    frequency: { type: String, enum: ['daily', 'weekly', 'monthly'], required: true },
    nextDue: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('RecurringExpense', RecurringExpenseSchema);