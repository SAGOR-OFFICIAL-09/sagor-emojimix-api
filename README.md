# 🎭 Emojimix API (Standalone)

দুটো emoji মিক্স করে একটা image বানানোর API — **106,751টা কম্বিনেশন** built-in, কোনো external API লাগে না।

## 🚀 Deploy (Vercel)

1. এই repo fork করো
2. [vercel.com](https://vercel.com) → Add New → Project → repo import → Deploy
3. Deploy-এর পর তোমার URL (যেমন `https://tomar-api.vercel.app`) `index.js`-এর `CONFIG.SITE_URL`-এ বসাও, আবার deploy দাও

## ⚙️ Settings

কিছু বসাতে হবে না — **zero config**। Deploy করলেই চলবে, কোনো env variable লাগে না।

## ⚠️ Credit নিয়ম (গুরুত্বপূর্ণ!)

- তুমি নিজের নামে API চালাতে পারো — **কিন্তু**
- API নিজেই check করে: তোমার সাইটের হোমপেজে এই লিংকটা থাকতেই হবে:
  `https://sagor-apis-nx.vercel.app`
- লিংক সরিয়ে ফেললে API **403** দিয়ে বন্ধ হয়ে যাবে:
  `"API disabled: keep a backlink to https://sagor-apis-nx.vercel.app"`
- প্রতি ঘণ্টায় একবার auto-check হয় — কিছু configure করতে হয় না

## 📖 ব্যবহার

```
GET /emojimix?emoji1=🙂&emoji2=🔥
```

```json
{
  "status": "success",
  "author": "SAGOR",
  "total": 1,
  "data": [{
    "id": "1f642_1f525",
    "emoji": ["🙂", "🔥"],
    "image": "https://www.gstatic.com/android/keyboard/emojikitchen/20201001/u1f642/u1f642_u1f525.png",
    "size": null
  }]
}
```

## 📁 Files

| File | কাজ |
|------|-----|
| `index.js` | পুরো API (Express) — Vercel-এ চলে |
| `vercel.json` | Vercel config |

Dataset (106,751 combo) `sagor-apis-nx.vercel.app` থেকে auto-load হয় — repo-তে রাখতে হয় না।

---
Powered by [SAGOR APIs](https://sagor-apis-nx.vercel.app)
