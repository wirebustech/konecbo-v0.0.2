const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friendController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/request/:id', friendController.sendFriendRequest);
router.post('/accept/:requestId', friendController.acceptFriendRequest);
router.get('/', friendController.getFriends);
router.get('/requests', friendController.getFriendRequests);
router.get('/status/:userId', friendController.checkFriendStatus);

module.exports = router;
