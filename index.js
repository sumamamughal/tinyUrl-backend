import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ConnectMongoDB } from "./Utils/mongodb.js";
import URLRoutes from "./Routes/urls.js";
import { RedirectURL } from "./Controllers/RedirectURL.js";
import mongoose from "mongoose";

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: ["http://localhost:5173", "https://tiny-url-clint.vercel.app"],
  credentials: true
}));
app.use(express.json());

// Request Logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Connect DB
app.use(async (req, res, next) => {
  await ConnectMongoDB();
  next();
});

// Health Check
app.get("/health", (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.json({ 
    status: "ok", 
    database: dbStatus,
    version: "1.0.1"
  });
});

// Root route
app.get("/", (req, res) => {
  res.json({ 
    message: "🔗 TinyURL API is running!",
    endpoints: {
      shorten: "POST /url/shorten",
      redirect: "GET /:shortId",
      health: "GET /health"
    }
  });
});

// Routes
app.get("/:shortId", RedirectURL);
app.use("/url", URLRoutes);

// Error Handling
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// Start server
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
  });
}

export default app;
