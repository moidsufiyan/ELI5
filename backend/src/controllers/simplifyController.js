const Simplification = require('../models/Simplification');

// ── Shared helpers ────────────────────────────────────────────────────────────

const LEVEL_PROMPTS = {
  ELI5: "Explain this like I'm 5 years old. Use very simple words, short sentences, and fun analogies a child would understand.",
  ELI15: "Explain this like I'm 15 years old. Use clear language, some technical terms are okay, but keep it engaging.",
  normal: "Provide a comprehensive, adult-level explanation with proper terminology and depth.",
};

/**
 * Fetch a Wikipedia summary for a given topic.
 * Returns { title, summary } or null on failure.
 */
async function fetchWikiContext(topic) {
  if (!topic?.trim()) return null;

  // FIX: Use replaceAll so multi-word topics produce a correct Wikipedia slug.
  const slug = encodeURIComponent(topic.trim().replaceAll(' ', '_'));
  try {
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${slug}`, {
      headers: { 'User-Agent': 'ELI5-Simplifier/1.0', Accept: 'application/json' },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      title: data.title || '',
      summary: (data.extract || '').substring(0, 500),
    };
  } catch {
    return null;
  }
}

/**
 * Build the final AI prompt from text, level, and optional wiki context.
 */
function buildPrompt(text, level, wikiContext) {
  const instruction = LEVEL_PROMPTS[level] || LEVEL_PROMPTS.ELI5;
  let prompt = wikiContext?.summary
    ? `Context from Wikipedia about "${wikiContext.title}":\n${wikiContext.summary}\n\nNow ${instruction}: ${text.trim()}`
    : `${instruction}: ${text.trim()}`;
  prompt += ' Write in plain text without markdown formatting.';
  return prompt;
}

/**
 * Persist a simplification to MongoDB (non-blocking, errors are swallowed).
 */
async function saveToDb(original, simplified, level, wikiContext) {
  try {
    await Simplification.create({
      original_text: original,
      simplified_text: simplified,
      level: level || 'ELI5',
      used_wiki: wikiContext !== null,
      wiki_title: wikiContext?.title || null,
    });
  } catch (e) {
    console.error('[DB] Failed to save simplification:', e.message);
  }
}

// ── 1. GET /api/history ───────────────────────────────────────────────────────
exports.getHistory = async (req, res) => {
  try {
    const list = await Simplification.find({}).sort({ timestamp: -1 }).limit(10).lean();
    return res.json(list);
  } catch {
    return res.json([]);
  }
};

// ── 2. POST /api/simplify (non-streaming) ─────────────────────────────────────
exports.simplify = async (req, res) => {
  const { text, complexity, useWikipedia, topic } = req.body;
  if (!text) return res.status(400).json({ status: 'fail', error: 'Text is required' });

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return res.status(500).json({ status: 'fail', error: 'GROQ_API_KEY is not configured' });

  const level = complexity || 'ELI5';
  const searchTopic = topic?.trim() || text.trim().split(/\s+/).slice(0, 3).join(' ');

  try {
    const wikiContext = useWikipedia ? await fetchWikiContext(searchTopic) : null;
    const aiPrompt = buildPrompt(text, level, wikiContext);

    const aiResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: aiPrompt }],
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      const errorData = await aiResponse.json().catch(() => ({}));
      return res.status(aiResponse.status).json({ status: 'fail', error: errorData.error?.message || 'AI API Error' });
    }

    const aiData = await aiResponse.json();
    const simplified_text = (aiData.choices?.[0]?.message?.content || '').trim();

    await saveToDb(text, simplified_text, level, wikiContext);

    return res.json({
      simplified_text,
      used_wiki: wikiContext !== null,
      wiki_title: wikiContext?.title,
      metrics: { original_length: text.length, simplified_length: simplified_text.length },
    });
  } catch (error) {
    console.error('[simplify] Error:', error.message);
    res.status(500).json({ status: 'fail', error: 'Internal server error' });
  }
};

// ── 3. POST /api/simplify-stream (SSE streaming) ─────────────────────────────
exports.simplifyStream = async (req, res) => {
  const { text, level, use_wiki, topic } = req.body;
  if (!text) return res.status(400).json({ status: 'fail', error: 'Text required' });

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return res.status(500).json({ status: 'fail', error: 'GROQ_API_KEY not set' });

  const effectiveLevel = level || 'ELI5';
  const searchTopic = topic?.trim() || text.trim().split(/\s+/).slice(0, 3).join(' ');

  // Set SSE headers before any async work so the client knows the content type.
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx/proxy buffering

  // Clean up if the client disconnects mid-stream.
  let clientGone = false;
  req.on('close', () => { clientGone = true; });

  const send = (data) => {
    if (!clientGone) res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  try {
    const wikiContext = use_wiki ? await fetchWikiContext(searchTopic) : null;
    if (clientGone) return;

    const aiPrompt = buildPrompt(text, effectiveLevel, wikiContext);

    send({ type: 'metadata', used_wiki: wikiContext !== null, wiki_title: wikiContext?.title });

    const aiResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: aiPrompt }],
        max_tokens: 1024,
        temperature: 0.7,
        stream: true,
      }),
    });

    if (!aiResponse.ok) {
      const errorData = await aiResponse.json().catch(() => ({}));
      send({ type: 'error', error: errorData.error?.message || 'AI API Error' });
      res.end();
      return;
    }

    if (aiResponse.body) {
      const reader = aiResponse.body.getReader();
      const decoder = new TextDecoder();
      let current_text = '';

      while (!clientGone) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          const dataStr = line.replace(/^data: /, '').trim();
          if (dataStr === '[DONE]' || !dataStr) continue;

          try {
            const parsed = JSON.parse(dataStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              current_text += content;
              send({ type: 'content', current_text });
            }
          } catch { /* malformed SSE chunk – skip */ }
        }
      }

      if (!clientGone) {
        await saveToDb(text, current_text.trim(), effectiveLevel, wikiContext);
        send({ type: 'complete', final_text: current_text.trim() });
      }
    }

    res.end();
  } catch (error) {
    console.error('[simplifyStream] Error:', error.message);
    send({ type: 'error', error: 'Stream failed. Please try again.' });
    res.end();
  }
};

// ── 4. POST /api/explanations (unified endpoint – Phase 5) ───────────────────
// Accepts: { text, mode, stream, useWikipedia, topic }
// Routes to streaming or regular response based on body.stream flag.
exports.explanations = async (req, res) => {
  // Normalise field names to match existing handlers
  const { text, mode, stream, useWikipedia, use_wiki, topic } = req.body;

  if (stream) {
    // Delegate to streaming handler using its expected field names
    req.body.level = mode;
    req.body.use_wiki = useWikipedia ?? use_wiki ?? false;
    return exports.simplifyStream(req, res);
  } else {
    // Delegate to regular handler using its expected field names
    req.body.complexity = mode;
    return exports.simplify(req, res);
  }
};
