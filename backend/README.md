# AI Timetable Generator - Backend

Backend service for the AI Timetable Generator built with **Node.js**, **Express.js**, **TypeScript**, and **MongoDB**.

## Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB & Mongoose
- JWT Authentication
- Swagger (OpenAPI)
- Zod Validation

## Project Structure

```
backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── validators/
│   ├── app.ts
│   └── server.ts
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## Installation

```bash
cd backend
npm install
```

## Environment Variables

Create a `.env` file from `.env.example`.

Example:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/ai-timetable-generator
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
PYTHON_AI_API_URL=http://localhost:8000/api/v1/generate
```

## Run Development Server

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Run Production

```bash
npm start
```

## API Documentation

Swagger UI:

```
http://localhost:3000/docs
```

## Planned Modules

- Authentication
- Faculty Management
- Subject Management
- Department Management
- Classroom Management
- Timetable Management
- AI Module Integration

## Contributors

- **Ramini Sai Santhosh** – Backend
- **Mayur Wagh** – Frontend
- **Yash Verma** – AI Module
