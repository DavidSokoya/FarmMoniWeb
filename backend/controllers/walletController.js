const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const axios = require('axios');

// Get User Wallet Balance
exports.getMyWallet = async (req, res) => {
  try {
    // Find wallet belonging to the logged-in user
    const wallet = await Wallet.findOne({ user: req.user._id });
    
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    res.json(wallet);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Initialize Deposit 
exports.depositFunds = async (req, res) => {
  const { amount } = req.body;
  const user = req.user;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: 'Invalid amount' });
  }

  try {
    // 1. Initialize Payment with Paystack
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email: user.email,
        amount: amount * 100, 
        currency: 'NGN',
        callback_url: 'http://localhost:5000/api/wallet/verify', 
        metadata: {
           userId: user._id, 
           custom_fields: [{ display_name: "Phone", variable_name: "phone", value: user.phone }]
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // 2. Send the Paystack Checkout Link to the user
    res.json({
      authorization_url: response.data.data.authorization_url,
      access_code: response.data.data.access_code,
      reference: response.data.data.reference
    });

  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Paystack Initialization Failed' });
  }
};


// Verify Paystack Payment & Fund Wallet
exports.verifyDeposit = async (req, res) => {
  const { reference } = req.body;
  const user = req.user;

  if (!reference) {
    return res.status(400).json({ message: 'Transaction reference required' });
  }

  try {
    // 1. Check if this transaction already exists in our Ledger to prevent double-funding
    const existingTx = await Transaction.findOne({ reference });
    if (existingTx) {
      return res.status(400).json({ message: 'Transaction already processed' });
    }

    // 2. Verify with Paystack
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
      }
    );

    const data = response.data.data;

    // 3. If Paystack says "success" AND the amount matches
    if (data.status === 'success') {
      const amountInNaira = data.amount / 100; // Convert kobo to Naira

      // A. Credit the Wallet
      const wallet = await Wallet.findOne({ user: user._id });
      wallet.balance += amountInNaira;
      await wallet.save();

      // B. Create Ledger Entry
      await Transaction.create({
        user: user._id,
        amount: amountInNaira,
        type: 'deposit',
        reference: reference,
        status: 'success',
        description: `Wallet funded via Paystack`
      });

      res.json({ 
        message: 'Wallet funded successfully', 
        newBalance: wallet.balance 
      });

    } else {
      res.status(400).json({ message: 'Transaction failed or pending' });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Verification failed' });
  }
};