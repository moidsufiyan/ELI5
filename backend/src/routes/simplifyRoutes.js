const express = require('express');
const router = express.Router();
const simplifyController = require('../controllers/simplifyController');

const { validate, simplifySchema } = require('../middlewares/validate');

// Define Routes
router.get('/history', simplifyController.getHistory);
router.post('/simplify', validate(simplifySchema), simplifyController.simplify);
router.post('/simplify-stream', simplifyController.simplifyStream);

module.exports = router;
