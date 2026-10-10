/*
 * ============================================================
 *  EMOJIMIX API — standalone
 *  Mix two emojis into one image (Google Emoji Kitchen data)
 *  106,751 combinations bundled — no external API needed.
 * ============================================================
 *
 *  ★★★  YOUR SETTINGS — শুধু এই অংশটুকু বদলাও  ★★★
 *
 */
const CONFIG = {
  BRAND: "SAGOR",                                   // তোমার API-র নাম
  SITE_URL: "https://sagor-emojimix-api.vercel.app", // তোমার সাইটের URL (Vercel link বসাও)
};
/*
 *  ★★★  এর নিচে হাত দিও না  ★★★
 *  নিচের CREDIT_LINK তোমার সাইটে (SITE_URL) ফুটারে থাকতেই হবে।
 *  লিংক সরিয়ে ফেললে API কাজ করা বন্ধ করে দেবে (403)।
 */
const CREDIT_HOST = "sagor-apis-nx.vercel.app";
const CREDIT_URL = "https://" + CREDIT_HOST;
/* ============================================================ */

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const app = express();
app.use(cors());

/* ---------- dataset load (106k combos, gzip+base64, 4 parts) ---------- */
let MIX = null;
function loadDataset() {
  if (MIX) return MIX;
  let b64 = "";
  for (let i = 1; i <= 4; i++) {
    const part = fs.readFileSync(path.join(__dirname, `emojikitchen.p${i}.json`), "utf8");
    b64 += JSON.parse(part);
  }
  const buf = Buffer.from(b64, "base64");
  MIX = JSON.parse(zlib.gunzipSync(buf).toString("utf8"));
  console.log(`[emojimix] dataset loaded: ${Object.keys(MIX).length} combos`);
  return MIX;
}

/* ---------- credit-link enforcement ---------- */
let creditCache = { ok: null, at: 0 };
async function creditOK() {
  const now = Date.now();
  if (creditCache.ok !== null && now - creditCache.at < 3600 * 1000) return creditCache.ok;

  const site = (process.env.SITE_URL || CONFIG.SITE_URL || "").trim().replace(/\/+$/, "");
  let ok = true;

  if (!site) {
    ok = false; // SITE_URL বসানো হয়নি — README দেখো
  } else if (site === CREDIT_URL) {
    ok = true; // owner's own deployment
  } else {
    ok = false;
    for (let attempt = 0; attempt < 2 && !ok; attempt++) {
      try {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 8000);
        const res = await fetch(site, {
          signal: ctrl.signal,
          headers: { "User-Agent": "Mozilla/5.0 (EmojimixCreditCheck)" },
        });
        clearTimeout(timer);
        const html = await res.text();
        ok = html.includes(CREDIT_HOST); // ফুটারে ক্রেডিট লিংক আছে?
        if (!ok) break; // পেজ পাওয়া গেছে কিন্তু লিংক নেই — retry নয়
      } catch (e) {
        if (attempt === 1) ok = true; // দুবারই নেটওয়ার্ক fail → সাইট ডাউন ধরে API চালু রাখো
      }
    }
  }
  creditCache = { ok, at: now };
  return ok;
}

/* ---------- helpers ---------- */
const up = (cp) => cp.replace(/-/g, "-u");
function emojiToCp(emoji) {
  return [...emoji].map((c) => c.codePointAt(0).toString(16)).join("-");
}
function mixURL(left, right, date) {
  return `https://www.gstatic.com/android/keyboard/emojikitchen/${date}/u${up(left)}/u${up(left)}_u${up(right)}.png`;
}
const err = (res, code, message) =>
  res.status(code).json({ status: "error", author: CONFIG.BRAND, message });

/* ---------- landing page (credit footer included — সরাবে না) ---------- */
app.get("/", (req, res) => {
  res.send(`<!doctype html><html lang="bn"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${CONFIG.BRAND} Emojimix API</title>
<style>body{font-family:system-ui;background:#0f172a;color:#e2e8f0;max-width:640px;margin:40px auto;padding:0 20px}
code{background:#1e293b;padding:2px 8px;border-radius:6px;font-size:14px}
a{color:#38bdf8}input,button{padding:10px;border-radius:8px;border:1px solid #334155;font-size:16px}
input{background:#1e293b;color:#fff;width:70px;text-align:center}button{background:#38bdf8;color:#000;font-weight:700;cursor:pointer}
img{max-width:200px;margin-top:16px}footer{margin-top:48px;padding-top:16px;border-top:1px solid #334155;color:#64748b;font-size:13px}</style>
</head><body>
<h1>🎭 ${CONFIG.BRAND} Emojimix API</h1>
<p>দুটো emoji মিক্স করে একটা image বানাও — 106,751 কম্বিনেশন, কোনো external API লাগে না।</p>
<h3>ব্যবহার</h3>
<code>/emojimix?emoji1=🙂&amp;emoji2=🔥</code>
<h3>লাইভ টেস্ট</h3>
<input id="e1" value="🙂" maxlength="4"> + <input id="e2" value="🔥" maxlength="4">
<button onclick="go()">Mix!</button><br><img id="out" style="display:none">
<script>async function go(){
const e1=document.getElementById('e1').value,e2=document.getElementById('e2').value;
const r=await fetch('/emojimix?emoji1='+encodeURIComponent(e1)+'&emoji2='+encodeURIComponent(e2));
const j=await r.json();
if(j.status==='success'){const im=document.getElementById('out');im.src=j.data[0].image;im.style.display='block';}
else alert(j.message);}</script>
<footer>Powered by <a href="${CREDIT_URL}">SAGOR APIs</a> • <a href="${CREDIT_URL}">${CREDIT_HOST}</a></footer>
</body></html>`);
});

/* ---------- the API ---------- */
app.get("/emojimix", async (req, res) => {
  const { emoji1, emoji2 } = req.query;

  if (!(await creditOK())) {
    return err(res, 403, `API disabled: keep a backlink to ${CREDIT_URL} on your site (${CONFIG.SITE_URL}). Link sorale API kaj korbe na.`);
  }

  if (!emoji1 || !emoji2) return err(res, 400, "Missing emoji1 or emoji2");

  const data = loadDataset();
  const cp1 = emojiToCp(emoji1);
  const cp2 = emojiToCp(emoji2);

  let key = `${cp1}_${cp2}`;
  let left = cp1, right = cp2;
  if (!data[key]) {
    key = `${cp2}_${cp1}`;
    left = cp2; right = cp1;
  }
  const date = data[key];
  if (!date) return err(res, 404, "No mix found for this emoji pair");

  res.json({
    status: "success",
    author: CONFIG.BRAND,
    total: 1,
    data: [{ id: key, emoji: [emoji1, emoji2], image: mixURL(left, right, date), size: null }],
  });
});

app.get("/health", (req, res) => res.json({ status: "ok", combos: Object.keys(loadDataset()).length }));

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  loadDataset();
  app.listen(PORT, () => console.log(`[emojimix] listening on :${PORT}`));
}
module.exports = app;
