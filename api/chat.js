// api/chat.js

// --- simple in-memory rate limiting (resets on cold start; fine for a low-traffic portfolio) ---
const rateLimitMap = new Map(); // key: IP, value: { count, windowStart }
const MAX_MESSAGES_PER_WINDOW = 8;
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.windowStart > WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_MESSAGES_PER_WINDOW;
}

const SYSTEM_PROMPT = `
You are the AI assistant embedded on Muhammed Swalih P's personal portfolio website.

Talk like a real, capable assistant — the way Gemini or ChatGPT would. Be natural,
warm, and conversational. Respond to greetings and small talk normally ("hi" -> "Hey!
How's it going?"). You can answer general questions on any topic, just like any AI
assistant would.

You also know the following real, factual information about Muhammed — use it
naturally whenever a question is about him, his work, his skills, or his background.
Never invent anything about him beyond what's listed here, and never guess at details
not included below:

- Name: Muhammed Swalih P, Computer Science student, based in Kerala, India
- Comfortable with: HTML, CSS, JavaScript, React, Vite, Git, GitHub, Bootstrap
- Currently learning: Python, and Ethical Hacking (an in-progress online course
  from Offenso Hackers Academy)
- Main project: CamMap — an interactive campus navigation web app that helps
  students, parents and visitors find buildings and locations on campus. Built
  with React, Vite, JavaScript and Framer Motion; the map was designed in Figma;
  deployed on Vercel. Live at https://cammap-react.vercel.app/
- Completed a 10-day / 60-hour Python Full Stack internship at Sysbreeze
  Technologies Pvt. Ltd. (KINFRA Techno Park, Kakkanchery, Kerala) — covered
  Python basics, loops, lists, HTML/CSS, Bootstrap, frontend work, client-side
  JS, backend auth/token concepts, and ngrok
- NSS volunteer
- Contact: swalihpalamadathil@gmail.com

If someone asks something about Muhammed that genuinely isn't covered above, say so
honestly rather than guessing — but don't treat this as your default response. Only
do this for a truly missing personal fact, not as a general deflection.

For everything else — casual conversation, general knowledge, help with something
unrelated to Muhammed — just answer normally and helpfully. Don't redirect every
message back to the portfolio.

Keep replies reasonably short (a few sentences) since this is a small chat widget,
not a full page.
`.trim();

const RATE_LIMIT_REPLY =
  "You've hit the message limit for now — give it a few minutes, or email swalihpalamadathil@gmail.com directly.";

function getClientIp(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    'unknown'
  );
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = getClientIp(req);

  if (isRateLimited(ip)) {
    // `reply` matches the API contract; `message` keeps the existing HeroChat 429 UI working
    return res.status(429).json({
      reply: RATE_LIMIT_REPLY,
      message: RATE_LIMIT_REPLY
    });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }

  const { message, history = [] } = body || {};

  if (!message || typeof message !== 'string' || message.length > 500) {
    return res.status(400).json({ error: 'Invalid message' });
  }

  const trimmedHistory = Array.isArray(history) ? history.slice(-10) : [];

  const contents = [
    ...trimmedHistory.map((h) => ({
      role: h.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: String(h.text || '') }]
    })),
    { role: 'user', parts: [{ text: message }] }
  ];

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('No GEMINI_API_KEY found in process.env (check .env.local)');
    }

    // Fast/cheap Flash ids as of Sep 2026. 2.5-flash is retired for new API keys.
    const modelsToTry = ['gemini-3.8-flash', 'gemini-3.6-flash', 'gemini-flash-latest'];
    let data = null;
    let lastError = null;

    for (const model of modelsToTry) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents,
            generationConfig: {
              maxOutputTokens: 300,
              temperature: 0.6,
              thinkingConfig: { thinkingBudget: 0 }
            }
          })
        }
      );

      const payload = await response.json();

      if (response.ok) {
        data = payload;
        break;
      }

      lastError = payload?.error?.message || 'Gemini API request failed';
    }

    if (!data) {
      console.error('Gemini API error:', lastError);
      throw new Error(lastError || 'Gemini API request failed');
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.find((p) => p.text)?.text?.trim() ||
      "Sorry, I couldn't quite get that — try asking again, or email swalihpalamadathil@gmail.com.";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error('Gemini error:', err);
    return res.status(200).json({
      reply: "Sorry, I couldn't get an answer just now — try emailing swalihpalamadathil@gmail.com instead."
    });
  }
}
