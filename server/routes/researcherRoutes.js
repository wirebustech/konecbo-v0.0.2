const express = require('express');
const router = express.Router();
const researcherController = require('../controllers/researcherController');

// Public routes (no auth middleware required for viewing public profiles)
router.get('/', researcherController.getAllResearchers);
router.get('/:id', researcherController.getResearcherById);

// Feature Flags/Settings (Authenticated or Public - currently Public for simplicity of frontend load)
const adminSettingsController = require('../controllers/adminSettingsController');
router.get('/settings/config', adminSettingsController.getResearcherSettings);

module.exports = router;
