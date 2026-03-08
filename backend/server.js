require("dotenv").config();
const express  = require("express");
const mongoose = require("mongoose");
const cors     = require("cors");
const path     = require("path");
const fs       = require("fs");

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Ensure outputs directory exists ─────────────────────────────────────────
const outputsDir = path.join(__dirname, "outputs");
if (!fs.existsSync(outputsDir)) fs.mkdirSync(outputsDir, { recursive: true });

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ── Serve generated PDFs ─────────────────────────────────────────────────────
app.use("/outputs", express.static(outputsDir));

// ── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/reports", require("./routes/reports"));

// ── Health check ─────────────────────────────────────────────────────────────
app.get("/api/health", (_, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    mongoState: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// ── 404 handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// ── Global error handler ─────────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error", detail: err.message });
});

// ── Connect to MongoDB then start server ─────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/bnmit_reports")
  .then(() => {
    console.log("✅  MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀  Backend running → http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌  MongoDB connection failed:", err.message);
    process.exit(1);
  });
