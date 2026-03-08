import { Button } from "../components/UI.jsx";

export default function ResultScreen({ result, onNew, onViewHistory }) {
  const success = result.status === "ready";

  return (
    <div className="fade-up" style={{ textAlign: "center", padding: "32px 20px" }}>
      {/* Icon */}
      <div style={{
        width: 80, height: 80, borderRadius: "50%", margin: "0 auto 20px",
        background: success ? "rgba(26,107,74,0.1)" : "rgba(176,48,32,0.1)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 36,
      }}>
        {success ? "🎓" : "⚠️"}
      </div>

      <h2 style={{
        fontFamily: "var(--font-display)", fontSize: 26,
        color: success ? "var(--success)" : "var(--error)", marginBottom: 8,
      }}>
        {success ? "Report Generated!" : "Generation Failed"}
      </h2>

      <p style={{ fontSize: 15, color: "var(--muted)", marginBottom: 32, maxWidth: 420, margin: "0 auto 32px" }}>
        {success
          ? "Your BNMIT project report PDF is ready. Click below to download."
          : "Your data was saved but PDF compilation failed. Check the error below."}
      </p>

      {success && (
        <a
          href={result.pdfUrl}
          target="_blank"
          rel="noreferrer"
          style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: "var(--accent)", color: "var(--white)",
            padding: "14px 36px", borderRadius: 10, fontWeight: 700,
            fontSize: 15, textDecoration: "none", marginBottom: 20,
            boxShadow: "0 4px 16px rgba(200,64,26,0.3)",
            transition: "opacity 0.2s",
          }}
        >
          ⬇ Download PDF
        </a>
      )}

      {!success && result.error && (
        <div style={{
          background: "#fdf0ee", border: "1px solid var(--error)",
          borderRadius: 10, padding: "16px 20px", margin: "0 auto 24px",
          maxWidth: 600, textAlign: "left",
        }}>
          <p style={{ fontWeight: 700, color: "var(--error)", marginBottom: 8, fontSize: 13 }}>
            Compiler Output:
          </p>
          <pre style={{ fontSize: 12, color: "var(--error)", whiteSpace: "pre-wrap", maxHeight: 200, overflow: "auto" }}>
            {result.error}
          </pre>
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 12 }}>
            Common causes: Typst not installed, missing fonts, or invalid YAML in References.
          </p>
        </div>
      )}

      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 12 }}>
        <Button variant="secondary" onClick={onNew}>
          + New Report
        </Button>
        <Button variant="secondary" onClick={onViewHistory}>
          📋 View All Reports
        </Button>
      </div>
    </div>
  );
}
