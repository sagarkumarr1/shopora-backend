const express = require('express');
const { getHeroes, createHero, deleteHero } = require('../controllers/heroController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(getHeroes)
    .post(protect, authorize('admin'), createHero);

router.route('/:id')
    .delete(protect, authorize('admin'), deleteHero);

module.exports = router;
