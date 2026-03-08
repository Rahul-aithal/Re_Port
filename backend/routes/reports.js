const express  = require("express");
const path     = require("path");
const fs       = require("fs");
const router   = express.Router();

const Report               = require("../models/Report");
const { generateReport }   = require("../services/typstGenerator");
const { reportRules, validate } = require("../middleware/validate");

// ── Helper: run generation and update document ───────────────────────────────
async function runGeneration(doc) {
  doc.status       = "generating";
  doc.errorMessage = null;
  await doc.save();

  try {
    const pdfPath = await generateReport(doc);
    doc.status  = "ready";
    doc.pdfPath = pdfPath;
  } catch (err) {
    doc.status       = "failed";
    doc.errorMessage = err.message;
    console.error(`[Generator] Report ${doc._id} failed:`, err.message);
  }

  await doc.save();
  return doc;
}

// ────────────────────────────────────────────────────────────────────────────
// POST /api/reports  — create new report and generate PDF
// ────────────────────────────────────────────────────────────────────────────
router.post("/", reportRules, validate, async (req, res) => {
  try {
    const doc = new Report(req.body);
    await doc.save();

    const updated = await runGeneration(doc);

    res.status(201).json({
      _id:      updated._id,
      title:    updated.title,
      status:   updated.status,
      pdfUrl:   updated.pdfUrl,
      error:    updated.errorMessage || undefined,
      createdAt: updated.createdAt,
    });
  } catch (err) {
    console.error("[POST /reports]", err);
    res.status(500).json({ error: "Server error", detail: err.message });
  }
});

// ────────────────────────────────────────────────────────────────────────────
// GET /api/reports  — list all reports (summary only)
// ────────────────────────────────────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const filter = status ? { status } : {};

    const docs = await Report.find(filter, "title subject year authors section status createdAt")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Report.countDocuments(filter);

    res.json({
      reports: docs.map((d) => ({
        _id:       d._id,
        title:     d.title,
        subject:   d.subject,
        year:      d.year,
        authors:   d.authors,
        section:   d.section,
        status:    d.status,
        pdfUrl:    d.pdfUrl,
        createdAt: d.createdAt,
      })),
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ────────────────────────────────────────────────────────────────────────────
// GET /api/reports/:id  — get single report with all fields
// ────────────────────────────────────────────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const doc = await Report.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Report not found" });

    res.json({ ...doc.toObject(), pdfUrl: doc.pdfUrl });
  } catch (err) {
    if (err.name === "CastError")
      return res.status(400).json({ error: "Invalid report ID" });
    res.status(500).json({ error: "Server error" });
  }
});

// ────────────────────────────────────────────────────────────────────────────
// PUT /api/reports/:id  — update report data and regenerate
// ────────────────────────────────────────────────────────────────────────────
router.put("/:id", reportRules, validate, async (req, res) => {
  try {
    const doc = await Report.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Report not found" });

    // Update all fields
    Object.assign(doc, req.body);

    const updated = await runGeneration(doc);

    res.json({
      _id:    updated._id,
      status: updated.status,
      pdfUrl: updated.pdfUrl,
      error:  updated.errorMessage || undefined,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", detail: err.message });
  }
});

// ────────────────────────────────────────────────────────────────────────────
// POST /api/reports/:id/regenerate  — re-run PDF generation without data change
// ────────────────────────────────────────────────────────────────────────────
router.post("/:id/regenerate", async (req, res) => {
  try {
    const doc = await Report.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Report not found" });

    const updated = await runGeneration(doc);

    res.json({
      status: updated.status,
      pdfUrl: updated.pdfUrl,
      error:  updated.errorMessage || undefined,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ────────────────────────────────────────────────────────────────────────────
// DELETE /api/reports/:id
// ────────────────────────────────────────────────────────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    const doc = await Report.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: "Report not found" });

    // Remove generated files
    const workDir = path.join(__dirname, "..", "outputs", req.params.id);
    if (fs.existsSync(workDir)) fs.rmSync(workDir, { recursive: true });

    res.json({ message: "Report deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
