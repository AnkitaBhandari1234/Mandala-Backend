const express = require('express');
const router = express.Router();
const SellerRequest = require('../Models/sellerRequest.model');
const User = require('../Models/user.model');
const { requireAuth, isAdmin} = require('../Middlewares/auth.middleware'); // Assume you have auth middleware

// 2.1 User submits seller request
router.post('/', requireAuth, async (req, res) => {
  try {
    const { details } = req.body;

    // Check if user already has pending request
    const existing = await SellerRequest.findOne({ userId: req.user.id, status: 'pending' });
    if (existing) {
      return res.status(400).json({ message: 'You already have a pending request.' });
    }

    const newRequest = new SellerRequest({
      userId: req.user.id,
      details,
    });

    await newRequest.save();
    res.status(201).json({ message: 'Seller request submitted.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 2.2 Admin gets all pending seller requests
router.get('/', requireAuth, isAdmin, async (req, res) => {
  try {
    const requests = await SellerRequest.find({ status: 'pending' }).populate('userId', 'username email');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 2.3 Admin approves seller request
router.put('/:id/approve', requireAuth, isAdmin, async (req, res) => {
  try {
    const request = await SellerRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = 'approved';
    await request.save();

    // Update user role
    await User.findByIdAndUpdate(request.userId, { role: 'seller' });

    res.json({ message: 'Seller request approved.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 2.4 Admin rejects seller request
router.put('/:id/reject', requireAuth, isAdmin, async (req, res) => {
  try {
    const request = await SellerRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = 'rejected';
    await request.save();

    res.json({ message: 'Seller request rejected.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
