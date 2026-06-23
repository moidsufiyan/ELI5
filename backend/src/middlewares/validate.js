const { z } = require('zod');

// ── Shared schema for the regular /simplify endpoint ─────────────────────────
const simplifySchema = z.object({
  body: z.object({
    text: z.string().min(10, 'Text must be at least 10 characters').max(5000, 'Text must be under 5000 characters'),
    complexity: z.enum(['ELI5', 'ELI15', 'normal']).optional(),
    useWikipedia: z.boolean().optional(),
    topic: z.string().optional(),
  })
});

// ── Schema for the streaming endpoint (uses 'level' instead of 'complexity') ─
// Accepts both field names for backward compatibility.
const simplifyStreamSchema = z.object({
  body: z.object({
    text: z.string().min(10, 'Text must be at least 10 characters').max(5000, 'Text must be under 5000 characters'),
    level: z.enum(['ELI5', 'ELI15', 'normal']).optional(),
    use_wiki: z.boolean().optional(),
    topic: z.string().optional(),
  })
});

// ── Schema for the unified /explanations endpoint ─────────────────────────────
const explanationsSchema = z.object({
  body: z.object({
    text: z.string().min(10, 'Text must be at least 10 characters').max(5000, 'Text must be under 5000 characters'),
    stream: z.boolean().optional().default(false),
    mode: z.enum(['ELI5', 'ELI15', 'normal']).optional().default('ELI5'),
    useWikipedia: z.boolean().optional(),
    topic: z.string().optional(),
  })
});

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({ body: req.body });
    next();
  } catch (err) {
    return res.status(400).json({
      status: 'fail',
      error: err.errors?.[0]?.message || 'Validation Error'
    });
  }
};

module.exports = {
  validate,
  simplifySchema,
  simplifyStreamSchema,
  explanationsSchema,
};
