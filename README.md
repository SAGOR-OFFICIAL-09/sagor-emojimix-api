# 🎭 Emojimix API (Standalone)

দুটো emoji মিক্স করে একটা image বানানোর API — **106,751টা কম্বিনেশন** built-in, কোনো external API লাগে না।

## 🚀 Deploy (Vercel)

1. এই repo fork করো
2. [vercel.com](https://vercel.com) → Add New → Project → repo import → Deploy
3. Deploy-এর পর তোমার URL (যেমন `https://tomar-api.vercel.app`) `index.js`-এর `CONFIG.SITE_URL`-এ বসাও, আবার deploy দাও

## ⚙️ Settings (`index.js`-এর উপরে `CONFIG`)

```js
const CONFIG = {
  BRAND: "SAGOR",                                    // তোমার API-র নাম
  SITE_URL: "https://sagor-emojimix-api.vercel.app", // তোমার সাইটের URL
};
```

## ⚠️ Credit নিয়ম (গুরুত্বপূর্ণ!)

- তুমি নিজের নামে (BRAND) API চালাতে পারো — **কিন্তু**
- তোমার সাইটে (SITE_URL) এই লিংকটা ফুটারে থাকতেই হবে:
  `https://sagor-apis-nx.vercel.app`
- লিংক সরিয়ে ফেললে API **403** দিয়ে বন্ধ হয়ে যাবে:
  `"API disabled: keep a backlink to https://sagor-apis-nx.vercel.app"`
- প্রতি ঘণ্টায় একবার চেক হয়

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
| `emojikitchen.p1-4.json` | Emoji Kitchen dataset (gzip+base64, 4 ভাগে) |

---
Powered by [SAGOR APIs](https://sagor-apis-nx.vercel.app)
