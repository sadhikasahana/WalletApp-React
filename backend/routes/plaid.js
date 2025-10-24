const express = require('express');
const router = express.Router();
const plaidClient = require('../services/plaid');

router.post('/create_link_token', async (req, res) => {
    try {
        const response = await plaidClient.createLinkToken({
            user: { client_user_id: 'unique_user_id' },
            client_name: 'WalletApp',
            products: ['transactions'],
            country_codes: ['US', 'IN'],
            language: 'en',
        });
        res.json(response);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/exchange_public_token', async (req, res) => {
    const { public_token } = req.body;
    try {
        const response = await plaidClient.exchangePublicToken(public_token);
        res.json(response);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/transactions', async (req, res) => {
    const { access_token, start_date, end_date } = req.query;
    try {
        const response = await plaidClient.getTransactions(access_token, start_date, end_date);
        res.json(response);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;