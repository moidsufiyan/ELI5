const mongoose = require('mongoose');

const SimplificationSchema = new mongoose.Schema({
  original_text: { type: String, required: true },
  simplified_text: { type: String, required: true },
  level: { type: String, required: true },
  used_wiki: { type: Boolean, default: false },
  wiki_title: { type: String, default: null },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Simplification || mongoose.model('Simplification', SimplificationSchema);
