const express = require('express');
const router = express.Router();
const researcherController = require('../controllers/researcherController');

// Public routes (no auth middleware required for viewing public profiles)
router.get('/', researcherController.getAllResearchers);
router.get('/:id', researcherController.getResearcherById);

module.exports = router;
