const mongoose = require("mongoose");

// ── Sub-schemas ──────────────────────────────────────────────────────────────
const authorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    usn:  { type: String, required: true, trim: true, uppercase: true },
  },
  { _id: false }
);

const guideSchema = new mongoose.Schema(
  {
    name:           { type: String, required: true, trim: true },
    designation:    { type: String, default: "Professor", trim: true },
    departmentAbbr: { type: String, required: true, trim: true },
    departmentFull: { type: String, required: true, trim: true },
  },
  { _id: false }
);

// ── Main schema ──────────────────────────────────────────────────────────────
const reportSchema = new mongoose.Schema(
  {
    // ── Project / Cover ──────────────────────────────────────────────────────
    title:       { type: String, required: true, trim: true },
    subject:     { type: String, required: true, trim: true },
    subjectCode: { type: String, required: true, trim: true },

    // ── Academic details ─────────────────────────────────────────────────────
    year:           { type: String, required: true, trim: true },  // "2025-26"
    semesterNumber: { type: Number, required: true, min: 1, max: 8 },
    semesterWord:   { type: String, required: true, trim: true },  // "Fifth"
    section:        { type: String, required: true, trim: true, uppercase: true },

    // ── Authors (1-4) ────────────────────────────────────────────────────────
    authors: {
      type: [authorSchema],
      required: true,
      validate: {
        validator: (v) => v.length >= 1 && v.length <= 4,
        message: "Must have 1 to 4 authors",
      },
    },

    // ── Guide ────────────────────────────────────────────────────────────────
    guide: { type: guideSchema, required: true },

    // ── Department ───────────────────────────────────────────────────────────
    departmentName: { type: String, required: true, trim: true },
    departmentAbbr: { type: String, required: true, trim: true },
    hod:            { type: String, required: true, trim: true },

    // ── Content ──────────────────────────────────────────────────────────────
    abstract:           { type: String, required: true },
    introduction:       { type: String, default: "" },
    literatureSurvey:   { type: String, default: "" },
    systemRequirements: { type: String, default: "" },
    methodology:        { type: String, default: "" },
    results:            { type: String, default: "" },
    conclusion:         { type: String, default: "" },

    // ── References (Hayagriva YAML) ───────────────────────────────────────────
    citations: { type: String, default: "" },

    // ── Generation metadata ───────────────────────────────────────────────────
    status: {
      type: String,
      enum: ["pending", "generating", "ready", "failed"],
      default: "pending",
    },
    pdfPath:      { type: String, default: null },
    errorMessage: { type: String, default: null },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Virtual: public PDF URL ──────────────────────────────────────────────────
reportSchema.virtual("pdfUrl").get(function () {
  return this.status === "ready"
    ? `/outputs/${this._id}/report.pdf`
    : null;
});

// ── Index for fast listing ───────────────────────────────────────────────────
reportSchema.index({ createdAt: -1 });
reportSchema.index({ status: 1 });

module.exports = mongoose.model("Report", reportSchema);
