import { useState } from "react";
import { api }      from "./utils/api.js";
import { EMPTY_FORM, STEPS } from "./utils/constants.js";
import { Button, Spinner }   from "./components/UI.jsx";
import Stepper        from "./components/Stepper.jsx";
import StepProject    from "./components/StepProject.jsx";
import StepAuthors    from "./components/StepAuthors.jsx";
import StepGuide      from "./components/StepGuide.jsx";
import StepAbstract   from "./components/StepAbstract.jsx";
import StepChapters   from "./components/StepChapters.jsx";
import StepReferences from "./components/StepReferences.jsx";
import ResultScreen   from "./components/ResultScreen.jsx";
import HistoryPage    from "./pages/HistoryPage.jsx";

// ── Validation per step ──────────────────────────────────────────────────────
function validateStep(step, form) {
  const e = {};
  if (step === 1) {
    if (!form.title.trim())       e.title       = "Required";
    if (!form.subject.trim())     e.subject     = "Required";
    if (!form.subjectCode.trim()) e.subjectCode = "Required";
    if (!form.year.trim())        e.year        = "Required";
    if (!form.section.trim())     e.section     = "Required";
  }
  if (step === 2) {
    if (form.authors.some(a => !a.name.trim() || !a.usn.trim()))
      e.authors = "All name and USN fields are required";
  }
  if (step === 3) {
    if (!form.guide.name.trim()) e["guide.name"] = "Required";
    if (!form.hod.trim())        e.hod           = "Required";
  }
  if (step === 4) {
    if (!form.abstract.trim()) e.abstract = "Required";
  }
  return e;
}

// ── Layout shell ─────────────────────────────────────────────────────────────
function Shell({ children, onHistory, showHistory }) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--light)", padding: "0 0 60px" }}>
      {/* Top bar */}
      <header style={{
        background: "var(--navy)", padding: "0 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: "3px solid var(--accent)",
      }}>
        <div style={{ padding: "16px 0" }}>
          <p style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase",
            color: "var(--gold)", marginBottom: 2, fontWeight: 700 }}>
            B.N.M. Institute of Technology
          </p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 20,
            color: "var(--white)", fontWeight: 700, letterSpacing: "0.01em" }}>
            Project Report Generator
          </h1>
        </div>
        {!showHistory && (
          <button onClick={onHistory} style={{
            background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 8, padding: "8px 16px", color: "rgba(255,255,255,0.8)",
            cursor: "pointer", fontSize: 13, fontWeight: 600,
          }}>
            📋 My Reports
          </button>
        )}
      </header>

      {/* Content */}
      <main style={{ maxWidth: 760, margin: "40px auto 0", padding: "0 20px" }}>
        <div style={{
          background: "var(--white)", borderRadius: 16,
          boxShadow: "0 8px 40px rgba(13,31,60,0.1)",
          overflow: "hidden",
        }}>
          {children}
        </div>
      </main>
    </div>
  );
}

// ── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [view,    setView]    = useState("form");   // "form" | "result" | "history"
  const [step,    setStep]    = useState(1);
  const [form,    setForm]    = useState({ ...EMPTY_FORM });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState(null);

  function setField(key, val) {
    setForm(f => ({ ...f, [key]: val }));
    // Clear error for this field
    if (errors[key]) setErrors(e => { const n={...e}; delete n[key]; return n; });
  }

  function goNext() {
    const e = validateStep(step, form);
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setStep(s => Math.min(s + 1, STEPS.length));
  }

  function goBack() {
    setErrors({});
    setStep(s => Math.max(s - 1, 1));
  }

  function goTo(s) {
    setErrors({});
    setStep(s);
  }

  async function handleSubmit() {
    // Validate all required steps before submitting
    for (let s = 1; s <= 4; s++) {
      const e = validateStep(s, form);
      if (Object.keys(e).length) {
        setErrors(e);
        setStep(s);
        return;
      }
    }

    setLoading(true);
    try {
      const res = await api.createReport(form);
      setResult(res);
      setView("result");
    } catch (err) {
      setResult({ status: "failed", error: err.message });
      setView("result");
    } finally {
      setLoading(false);
    }
  }

  function handleNew() {
    setForm({ ...EMPTY_FORM });
    setErrors({});
    setStep(1);
    setResult(null);
    setView("form");
  }

  const stepProps = { form, setField, errors };

  // ── HISTORY view ────────────────────────────────────────────────────────
  if (view === "history") {
    return (
      <Shell onHistory={() => setView("form")} showHistory>
        <div style={{ padding: "32px 36px" }}>
          <HistoryPage
            onBack={() => setView("form")}
            onEdit={() => {}}
          />
        </div>
      </Shell>
    );
  }

  // ── RESULT view ─────────────────────────────────────────────────────────
  if (view === "result") {
    return (
      <Shell onHistory={() => setView("history")}>
        <div style={{ padding: "32px 36px" }}>
          <ResultScreen
            result={result}
            onNew={handleNew}
            onViewHistory={() => setView("history")}
          />
        </div>
      </Shell>
    );
  }

  // ── FORM view ───────────────────────────────────────────────────────────
  const stepTitles = {
    1: "Project Information",
    2: "Authors",
    3: "Guide & Department",
    4: "Abstract",
    5: "Chapter Content",
    6: "References",
  };
  const stepSubtitles = {
    1: "Basic details about your project and subject",
    2: "Students who authored this report",
    3: "Your guide and department details",
    4: "A concise summary of the project",
    5: "Content for each chapter of the report",
    6: "Bibliography in Hayagriva YAML format",
  };

  return (
    <Shell onHistory={() => setView("history")}>
      {/* Step header */}
      <div style={{
        background: "linear-gradient(135deg, var(--navy) 0%, var(--blue) 100%)",
        padding: "28px 36px 24px",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
      }}>
        <Stepper currentStep={step} onGoTo={goTo} />
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22,
          color: "var(--white)", marginBottom: 4 }}>
          {stepTitles[step]}
        </h2>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>
          {stepSubtitles[step]}
        </p>
      </div>

      {/* Step body */}
      <div style={{ padding: "28px 36px 8px" }}>
        {step === 1 && <StepProject    {...stepProps} />}
        {step === 2 && <StepAuthors    {...stepProps} />}
        {step === 3 && <StepGuide      {...stepProps} />}
        {step === 4 && <StepAbstract   {...stepProps} />}
        {step === 5 && <StepChapters   {...stepProps} />}
        {step === 6 && <StepReferences {...stepProps} />}
      </div>

      {/* Validation errors banner */}
      {Object.keys(errors).length > 0 && (
        <div style={{
          margin: "0 36px", padding: "12px 16px",
          background: "#fdf0ee", border: "1px solid var(--error)",
          borderRadius: 8, color: "var(--error)", fontSize: 13,
        }}>
          ⚠ Please fix: {Object.values(errors).join(" · ")}
        </div>
      )}

      {/* Navigation footer */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "20px 36px 28px", marginTop: 8,
        borderTop: "1px solid var(--border)",
      }}>
        <Button variant="secondary" onClick={goBack} disabled={step === 1}>
          ← Back
        </Button>

        <span style={{ fontSize: 12, color: "var(--muted)" }}>
          Step {step} of {STEPS.length}
        </span>

        {step < STEPS.length ? (
          <Button variant="primary" onClick={goNext}>
            Continue →
          </Button>
        ) : (
          <Button variant="accent" onClick={handleSubmit} disabled={loading}
            style={{ minWidth: 160, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {loading ? <><Spinner size={16} /> Generating…</> : "🚀 Generate Report"}
          </Button>
        )}
      </div>
    </Shell>
  );
}
