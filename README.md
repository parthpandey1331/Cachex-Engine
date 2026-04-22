# CacheX Engine

A full-stack caching system designed to reduce database load by serving frequently accessed data from memory using the Least Recently Used (LRU) strategy.

---

## Overview

In many applications, the same data is requested repeatedly, leading to unnecessary database queries and slower response times. This project addresses that problem by introducing a memory-based caching layer that intelligently stores and serves frequently used data.

CacheX Engine demonstrates how caching improves performance by reducing latency and optimizing resource usage.

---

## Why This Project Matters

Traditional database systems repeatedly fetch the same data from disk, increasing response time and server load. This project demonstrates how an LRU (Least Recently Used) caching mechanism can reduce database access frequency and improve retrieval performance.

The system dynamically tracks cache hits and misses while visualizing cache efficiency in real time through an interactive dashboard.

---

## Live Demo

Frontend (User Interface):  
https://cachex-engine008.netlify.app/

Backend API:  
https://cachex-engine.onrender.com  

Note: The backend is hosted on a free service, so the first request may take some time to respond.

---

## Key Features

- In-memory caching using LRU eviction policy  
- Automatic removal of least recently used data when capacity is reached  
- Real-time tracking of cache hits and misses  
- REST API for data operations (Add, Get, Update, Delete)  
- Interactive frontend dashboard for visualization  
- Fully deployed full-stack application  

---

## How It Works

1. A request is made to fetch data  
2. The system first checks the cache:
   - If present → returns immediately (cache hit)  
   - If not → fetches from database (cache miss)  
3. The fetched data is stored in cache  
4. If cache exceeds capacity, the least recently used item is removed  

This ensures faster repeated access while maintaining memory efficiency.

---

## Tech Stack

Backend:
- Node.js
- Express.js
- SQLite

Frontend:
- HTML
- CSS
- JavaScript
- Chart.js

Deployment:
- Render (Backend)
- Netlify (Frontend)

---

## API Endpoints

| Endpoint | Description |
|--------|------------|
| /add?value=Apple | Add new data |
| /get?key=1 | Retrieve data |
| /keys | Get all stored records |
| /update?id=1&value=Mango | Update existing data |
| /delete?id=1 | Delete data |
| /clear | Clear cache |

---

## Project Structure

smart-memory-cache-system/
│
├── backend/
│   ├── server.js
│   ├── cache.db
│   └── ...
│
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── style.css
│
└── README.md

---

## Screenshots

### Main Dashboard
![Dashboard](./screenshots/dashboard.png)

### Data Fetch & Cache Response
![Fetch Result](./screenshots/fetch-result.png)

### Cache Hit Visualization
![Cache Hit](./screenshots/cache-hit.png)
---

## Testing the Application

1. Add data using:
   /add?value=Apple  

2. Fetch the same data:
   /get?key=1  

3. Repeat the request to observe cache hits increasing  

4. Use /keys to view all stored data  

---

## What This Project Demonstrates

- Practical implementation of caching in backend systems  
- Understanding of performance optimization techniques  
- Full-stack development (frontend + backend integration)  
- Deployment of production-ready applications  

---

## Author
Parth Pandey 
B.Tech in Computer Science Engineering
Focused on backend systems, performance optimization, and full-stack development.