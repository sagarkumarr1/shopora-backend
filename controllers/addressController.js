const User = require('../models/User');

// @desc    Get user addresses
// @route   GET /api/address
// @access  Private
exports.getAddresses = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({ success: true, count: user.addresses.length, data: user.addresses });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Add new address
// @route   POST /api/address
// @access  Private
exports.addAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        const newAddress = { ...req.body, isDefault: user.addresses.length === 0 }; // First address is default
        user.addresses.push(newAddress);
        await user.save();

        res.status(201).json({ success: true, data: user.addresses });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Update address
// @route   PUT /api/address/:id
// @access  Private
exports.updateAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === req.params.id);

        if (addressIndex === -1) {
            return res.status(404).json({ success: false, error: 'Address not found' });
        }

        user.addresses[addressIndex] = { ...user.addresses[addressIndex]._doc, ...req.body };
        await user.save();

        res.status(200).json({ success: true, data: user.addresses });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Delete address
// @route   DELETE /api/address/:id
// @access  Private
exports.deleteAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.addresses = user.addresses.filter(addr => addr._id.toString() !== req.params.id);
        await user.save();

        res.status(200).json({ success: true, data: user.addresses });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
