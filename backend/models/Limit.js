const mongoose = require('mongoose');

const LimitSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    limit: { type: Number, required: true },
    category: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Limit', LimitSchema);