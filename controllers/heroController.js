const Hero = require('../models/Hero');

// @desc    Get all active heroes
// @route   GET /api/hero
// @access  Public
exports.getHeroes = async (req, res) => {
    try {
        const heroes = await Hero.find({ isActive: true }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: heroes.length, data: heroes });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Create a hero banner
// @route   POST /api/hero
// @access  Private/Admin
exports.createHero = async (req, res) => {
    try {
        const hero = await Hero.create(req.body);
        res.status(201).json({ success: true, data: hero });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Delete a hero banner
// @route   DELETE /api/hero/:id
// @access  Private/Admin
exports.deleteHero = async (req, res) => {
    try {
        const hero = await Hero.findByIdAndDelete(req.params.id);
        if (!hero) {
            return res.status(404).json({ success: false, error: 'Hero banner not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
