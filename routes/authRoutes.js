const { register, login, getMe, logout, getAllUsers, updateDetails, toggleWishlist } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/wishlist/:productId', protect, toggleWishlist);
router.get('/users', protect, authorize('admin'), getAllUsers);

module.exports = router;
