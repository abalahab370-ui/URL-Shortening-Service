# ⚡ LINKSHIFT // FAST LINK SHORTENER

> A high-performance, caching-first URL shortener and analytics engine built with Node.js, Express, Redis Hashes, and MongoDB.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Render-informational?style=for-the-badge&logo=render&logoColor=white)](https://url-shortening-service-7u5q.onrender.com)
![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

🌐 **Live Link:** [https://url-shortening-service-7u5q.onrender.com](https://url-shortening-service-7u5q.onrender.com)

---

## ⚡ Key Features

* **Sub-Millisecond Redirects:** Redirects are served directly from Redis RAM using Redis Hashes (`hGetAll`), bypassing disk reads.
* **Non-Blocking Atomic Counters:** Uses Redis `hIncrBy` for zero-latency click counting, paired with background asynchronous syncs (`$inc`) to MongoDB.
* **Smart Cache Fallback:** Automatically queries MongoDB on cache misses, populating Redis RAM with a 24-hour TTL (`expire`).
* **Complete CRUD Lifecycle:** Create short codes, inspect access analytics, update target URLs on the fly, and purge short links instantly.
* **Cyberpunk UI Dashboard:** Responsive single-page application built with glassmorphism, glowing neon accents, and zero external JS framework bloat.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Backend** | Node.js, Express.js |
| **Caching Layer** | Redis (Hash data structures & TTL management) |
| **Primary Database** | MongoDB, Mongoose ODM |
| **Frontend** | HTML5, CSS3 (Flexbox/Custom CSS Variables), Vanilla JavaScript (Fetch API) |

---

## 🔄 Caching Architecture & Data Flow

1. **Incoming Request:** User accesses a shortened link (`GET /:shortCode`).
2. **Redis RAM Check:** Server queries Redis Hash key (`url:shortCode`).
3. **Cache Hit:** Instantly returns original URL, increments RAM counter (`hIncrBy`), and syncs click count asynchronously to MongoDB in the background.
4. **Cache Miss:** Queries MongoDB for the record. If found, updates DB count, repopulates Redis RAM with a 24-hour TTL, and redirects the user.

---

## 🚀 Local Installation & Setup

### 1. Prerequisites
Ensure you have the following installed on your environment:
* [Node.js](https://nodejs.org/) (v18 or higher)
* [MongoDB](https://www.mongodb.com/) running locally or a MongoDB Atlas URI
* [Redis](https://redis.io/) server running on default port `6379`

### 2. Clone Repository & Install Dependencies
```bash
git clone [https://github.com/your-username/linkshift.git](https://github.com/your-username/linkshift.git)
cd linkshift
npm install
npm run dev or npm start
