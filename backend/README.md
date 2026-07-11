# 🕒 AI Timetable Generator Backend

Welcome to the production-grade **AI Timetable Generator Backend** service. This is a robust, modular, and scalable server-side REST API built with Node.js, Express.js, TypeScript, and MongoDB.

Designed specifically with a **FastAPI developer's mental model** in mind, this project implements strict clean architecture principles, robust validation pipelines, comprehensive security configurations, and self-documenting endpoints.

---

## 🏗️ Architectural Overview & Design Pattern

The codebase is structured using the industry-standard **MVC (Model-View-Controller) / Tiered Layer Architecture**. This splits concerns into isolated, easily testable layers:

```
backend/
├── src/
│   ├── config/        # Environment configurations & DB pools (FastAPI config / lifespan equivalents)
│   ├── controllers/   # Route handlers (FastAPI path operation functions)
│   ├── middleware/    # Security, auth guards, rate limiters, error catches (FastAPI dependencies / middlewares)
│   ├── models/        # Mongoose data schemas & DB modeling (FastAPI SQLModel / Pydantic database representations)
│   ├── routes/        # Router files linking paths to controllers (FastAPI APIRouter modules)
│   ├── services/      # Core business logic & AI solver interface (Internal services / FastAPI helper tasks)
│   ├── utils/         # Helper functions, color loggers, custom HTTP exception handlers
│   ├── validators/    # Input schema definitions (FastAPI Pydantic models for validation)
│   ├── app.ts         # Main Express Application configuration
│   └── server.ts      # HTTP Entry point & process listener (FastAPI uvicorn equivalent)
├── .env.example       # Environment template
├── .gitignore         # Version control ignore lists
├── package.json       # Project dependencies and script definitions (equivalent to requirements.txt / pyproject.toml)
├── tsconfig.json      # TypeScript compiler configuration
└── README.md          # Technical documentation
```

---

## 🔍 Node.js / Express vs. FastAPI: A Rosetta Stone

If you are coming from **FastAPI**, here is how your Python skills translate into Node.js + Express:

| Feature / Concept | FastAPI (Python) | Express.js + TS (Node.js) |
| :--- | :--- | :--- |
| **Dependency Manager** | `pip` / `poetry` (`pyproject.toml`) | `npm` / `yarn` / `pnpm` (`package.json`) |
| **Server Startup** | `uvicorn main:app --reload` | `tsx watch src/server.ts` |
| **Application Instance** | `app = FastAPI()` | `const app = express()` |
| **Router Registry** | `router = APIRouter()` | `const router = express.Router()` |
| **Serialization & Validation** | `Pydantic` schemas | `Zod` schemas |
| **ORM / Data Access** | `SQLAlchemy` or `Beanie` (MongoDB) | `Mongoose` ODM |
| **Exceptions** | `raise HTTPException(status_code, detail)` | `next(new AppError(message, statusCode))` |
| **Automatic Documentation** | Built-in Swagger at `/docs` | `swagger-jsdoc` + `swagger-ui-express` at `/docs` |
| **Middlewares** | `@app.middleware("http")` | `app.use((req, res, next) => { ... })` |

### 1. The Controller Async Wrap (`asyncHandler`)
In FastAPI, you can write `async def read_items():` and FastAPI handles underlying event-loop exceptions automatically. 
In Express, any unhandled async exception will cause a **Promise Rejection** which could stall or crash the thread. To handle this elegantly without wrapping every single route in verbose `try-catch` blocks, we created `asyncHandler` in `src/middleware/errorHandler.ts`:
```typescript
// Equivalent to FastAPI capturing exceptions and routing them to exception_handlers
export const asyncHandler = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};
```

### 2. High-Performance Input Validation (`Zod`)
FastAPI uses **Pydantic** to validate incoming JSON payloads and query parameters. In this backend, we use **Zod** (a TypeScript-first schema declaration and validation library). Zod is fast, supports custom refinement rules, and integrates flawlessly into our Express request pipelines via reusable middleware.

---

## 🛡️ Production Security & Performance Best Practices

To ensure this project is enterprise-ready, we have fully integrated:

1. **Helmet**: Secures Express apps by setting various HTTP response headers (disables X-Powered-By, configures referrer policies, etc.).
2. **CORS**: Configured with strict header whitelisting, ready to integrate your React frontend domains.
3. **Express Rate Limit**: Implements IP-based request throttling (configured to 300 requests per 15 minutes) to protect against DoS attacks.
4. **Mongoose Cast Safeguards**: Automatic detection of invalid Hex-strings (for MongoDB ObjectIds) in the centralized error handler to prevent database query crashes.
5. **No-Crash Failover Memory Database**: If a remote `MONGODB_URI` database is not available, the backend automatically provisions a high-fidelity **In-Memory MongoDB Server** (`mongodb-memory-server`) locally! This ensures the app boots up and runs flawlessly during demonstrations and local testing inside sandboxed IDEs.

---

## 🚀 How to Run the Independent Backend

Follow these simple steps to run this standalone project:

### 1. Install Dependencies
Navigate to the `backend` folder and run npm installation:
```bash
cd backend
npm install
```

### 2. Set Up Environment Variables
Copy the template to create your `.env` file:
```bash
cp .env.example .env
```
*(Adjust database connections, JWT secrets, or python service endpoints in `.env` if desired).*

### 3. Start Development Mode
Boot the server with automatic file watching:
```bash
npm run dev
```
The server will automatically start on Port **3000** with fully-colorized logs.

### 4. Build and Compile TypeScript (For Production Deployments)
To compile TypeScript code to plain, highly-optimized JavaScript:
```bash
npm run build
npm start
```

---

## 📖 Live API Documentation (Swagger)

Once the server is booted, navigate to:
👉 **`http://localhost:3000/docs`** (or just **`http://localhost:3000/`**)

You'll see a fully interactive **Swagger UI terminal** that details:
- Authorization steps (JWT token registration)
- Active health check statistics
- Models, payloads, and API definitions

---

### 💻 Senior Engineering Review Guidelines (For Collaboration)
- **Zero Placeholder Code**: Ensure code has full production validations, type safety, and real return objects.
- **Colorized Logging**: All operations utilize the custom console `logger` to trace database connections, routing registrations, and runtime exceptions.
- **Extensible Router Setup**: The `app.ts` is ready to mount auth, faculty, subjects, and timetables routes as soon as we kick off Module 2.
