const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingController');
const authMiddleware = require('../middleware/authMiddleware');

// Protected routes (require valid JWT token)
router.get('/', authMiddleware, listingController.getAllListings);
router.post('/', authMiddleware, listingController.createListing);
router.get('/my-listings', authMiddleware, listingController.getMyListings);
router.get('/:id', authMiddleware, listingController.getListingById);
router.put('/:id', authMiddleware, listingController.updateListing);
// Reviewer/Admin routes
router.get('/pending', authMiddleware, listingController.getPendingListings);
router.put('/:id/approve', authMiddleware, listingController.approveListing);
router.put('/:id/reject', authMiddleware, listingController.rejectListing);

router.delete('/:id', authMiddleware, listingController.deleteListing);

module.exports = router;
