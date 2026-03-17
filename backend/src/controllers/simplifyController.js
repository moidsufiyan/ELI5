const Simplification = require('../models/Simplification');

// 1. Get History
exports.getHistory = async (req, res) => {
  try {
    const list = await Simplification.find({}).sort({ timestamp: -1 }).limit(10).lean();
    return res.json(list);
  } catch (err) {
    return res.json([]);
  }
};

// 2. Regular Simplify
exports.simplify = async (req, res) => {
  const { text, complexity, useWikipedia, topic } = req.body;
  if (!text) return res.status(400).json({ status: 'fail', error: 'Text is required' });

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return res.status(500).json({ status: 'fail', error: 'GROQ_API_KEY is not configured' });

  try {
    let wiki_info = null;
    const searchTopic = topic?.trim() || text.trim().split(/\s+/).slice(0, 3).join(' ');

    if (useWikipedia && searchTopic) {
      try {
        const safeTopic = encodeURIComponent(searchTopic.replace(' ', '_'));
        const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${safeTopic}`;
        const wikiResponse = await fetch(wikiUrl, {
          headers: { 'User-Agent': 'ELI5-Simplifier/1.0', 'Accept': 'application/json' }
        });
        if (wikiResponse.ok) {
          const wikiData = await wikiResponse.json();
          wiki_info = { title: wikiData.title || '', summary: (wikiData.extract || '').substring(0, 500) };
        }
      } catch (err) { }
    }

    const levelPrompts = { ELI5: "Explain this like I'm 5 years old", ELI15: "Explain this like I'm 15 years old", normal: "Provide an adult-level explanation" };
    const instruction = levelPrompts[complexity] || "Explain this";

    let aiPrompt = `${instruction}: ${text.trim()}`;
    if (wiki_info && wiki_info.summary) {
      aiPrompt = `Context from Wikipedia about "${wiki_info.title}":\n${wiki_info.summary}\n\nNow ${instruction}: ${text.trim()}`;
    }
    aiPrompt += `. Write in plain text without markdown formatting.`;

    const aiResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: aiPrompt }],
        max_tokens: 1024,
        temperature: 0.7
      })
    });

    if (!aiResponse.ok) {
        const errorData = await aiResponse.json();
        return res.status(aiResponse.status).json({ status: 'fail', error: errorData.error?.message || 'AI Error' });
    }

    const aiData = await aiResponse.json();
    const cleaned_text = (aiData.choices?.[0]?.message?.content || '').trim();

    try {
      await Simplification.create({
        original_text: text,
        simplified_text: cleaned_text,
        level: complexity || 'normal',
        used_wiki: wiki_info !== null,
        wiki_title: wiki_info?.title || null
      });
    } catch (e) {
        console.error("DB Create Fail:", e.message);
    }

    return res.json({
      simplified_text: cleaned_text,
      used_wiki: wiki_info !== null,
      wiki_title: wiki_info?.title,
      metrics: { original_length: text.length, simplified_length: cleaned_text.length }
    });

  } catch (error) {
    res.status(500).json({ status: 'fail', error: 'API Error execution block' });
  }
};

// 3. Streaming Simplify
exports.simplifyStream = async (req, res) => {
  const { text, level, use_wiki, topic } = req.body;
  if (!text) return res.status(400).json({ status: 'fail', error: 'Text required' });

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return res.status(500).json({ status: 'fail', error: 'GROQ_API_KEY not set' });

  try {
    let wiki_info = null;
    const searchTopic = topic?.trim() || text.trim().split(/\s+/).slice(0, 3).join(' ');

    if (use_wiki && searchTopic) {
      try {
        const safeTopic = encodeURIComponent(searchTopic.replace(' ', '_'));
        const wikiResponse = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${safeTopic}`);
        if (wikiResponse.ok) {
          const wikiData = await wikiResponse.json();
          wiki_info = { title: wikiData.title || '', summary: (wikiData.extract || '').substring(0, 500) };
        }
      } catch (e) { }
    }

    const levelPrompts = { ELI5: "Explain this like I'm 5 years old", ELI15: "Explain this like I'm 15 years old", normal: "Adult-level" };
    const instruction = levelPrompts[level] || "Explain this";

    let aiPrompt = `${instruction}: ${text.trim()}`;
    if (wiki_info && wiki_info.summary) {
      aiPrompt = `Context from Wikipedia about "${wiki_info.title}":\n${wiki_info.summary}\n\nNow ${instruction}: ${text.trim()}`;
    }

    const aiResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: aiPrompt }],
        max_tokens: 1024,
        temperature: 0.7,
        stream: true
      })
    });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    res.write(`data: ${JSON.stringify({ type: 'metadata', used_wiki: wiki_info !== null, wiki_title: wiki_info?.title })}\n\n`);

    if (aiResponse.body) {
      const reader = aiResponse.body.getReader();
      const decoder = new TextDecoder();
      let current_text = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          const dataStr = line.replace('data: ', '').trim();
          if (dataStr === '[DONE]' || !dataStr) continue;

          try {
            const parsed = JSON.parse(dataStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              current_text += content;
              res.write(`data: ${JSON.stringify({ type: 'content', current_text: current_text })}\n\n`);
            }
          } catch (e) { }
        }
      }

      try {
        await Simplification.create({
          original_text: text,
          simplified_text: current_text.trim(),
          level: level || 'normal',
          used_wiki: wiki_info !== null,
          wiki_title: wiki_info?.title || null
        });
      } catch (e) { }

      res.write(`data: ${JSON.stringify({ type: 'complete', final_text: current_text.trim() })}\n\n`);
    }
    res.end();

  } catch (error) {
    res.write(`data: ${JSON.stringify({ type: 'error', error: 'Stream failed' })}\n\n`);
    res.end();
  }
};
