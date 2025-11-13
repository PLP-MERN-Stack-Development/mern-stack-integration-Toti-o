# MERN Blog

A full-stack blog application built with MongoDB, Express.js, React, and Node.js.

## Quick Start

### Backend Setup
```bash
cd server
npm install
npm run dev
```
Server runs on `http://localhost:5000`

### Frontend Setup
```bash
cd client  
npm install
npm run dev
```
Client runs on `http://localhost:5173`

## Environment Variables

### Server (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mern-blog
```

## Project Structure
```
mern-blog/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Page components
│   │   └── hooks/          # Custom hooks
└── server/                 # Express backend
    ├── controllers/        # Business logic
    ├── models/             # MongoDB models
    ├── routes/             # API routes
    └── middleware/         # Custom middleware
```

## Features
- React frontend with Vite
- Express.js REST API
- MongoDB database
- Component-based architecture
- Modern development setup

## Available Scripts
- `npm run dev` - Start development server
- `npm start` - Start production server
