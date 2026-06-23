const express = require('express');
const router = express.Router();
const simplifyController = require('../controllers/simplifyController');
const { validate, simplifySchema, simplifyStreamSchema, explanationsSchema } = require('../middlewares/validate');

// ── Existing routes (kept for backward compatibility) ─────────────────────────
router.get('/history', simplifyController.getHistory);
router.post('/simplify', validate(simplifySchema), simplifyController.simplify);

// FIX: Stream endpoint now has input validation (was unprotected before)
router.post('/simplify-stream', validate(simplifyStreamSchema), simplifyController.simplifyStream);

// ── Phase 5: Unified explanations endpoint ────────────────────────────────────
// POST /api/explanations — accepts { text, mode, stream, useWikipedia, topic }
// Routes to streaming or regular handler based on body.stream flag
router.post('/explanations', validate(explanationsSchema), simplifyController.explanations);

module.exports = router;
