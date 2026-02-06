const express = require('express');
const router = express.Router();
const collaborationController = require('../controllers/collaborationController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

router.post('/join', collaborationController.joinCollaboration);
router.post('/acknowledge', collaborationController.acknowledgeCollaborator);
router.get('/listing/:listingId', collaborationController.getCollaborators);
router.get('/my', collaborationController.getMyCollaborations);

module.exports = router;
