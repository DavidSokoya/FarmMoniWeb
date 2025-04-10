const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const { getAdminStats, approveWithdrawal, getAllUsers, deleteUser, getAllInvestments, getWithdrawals,payInvestmentReturn, rejectWithdrawal} = require('../controllers/adminController');

// All routes here require Login (protect) AND Admin Role (admin)
router.get('/stats', protect, admin, getAdminStats);
router.get('/withdrawals', protect, admin, getWithdrawals);
router.get('/users', protect, admin, getAllUsers)
router.get('/investments', protect, admin, getAllInvestments);
router.delete('/users/:id', protect, admin, deleteUser);
router.put('/withdrawals/:id/approve', protect, admin, approveWithdrawal);
router.put('/withdrawals/:id/reject', protect, admin, rejectWithdrawal);
router.put('/investments/:id/pay', protect, admin, payInvestmentReturn);


module.exports = router;