const { z } = require('zod');

const simplifySchema = z.object({
  body: z.object({
    text: z.string().min(10, 'Text must be at least 10 characters').max(5000, 'Text must be under 5000 characters'),
    complexity: z.enum(['ELI5', 'ELI15', 'normal']).optional(),
    useWikipedia: z.boolean().optional(),
    topic: z.string().optional()
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
  simplifySchema
};
