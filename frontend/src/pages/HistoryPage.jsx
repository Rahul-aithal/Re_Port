import { useState, useEffect } from "react";
import { api } from "../utils/api.js";
import { Button, Spinner } from "../components/UI.jsx";

function StatusBadge({ status }) {
  const cfg = {
    ready:      { bg: "#e8f5ee", color: "#1a6b4a", label: "✓ Ready"      },
    generating: { bg: "#fff4e8", color: "#b06000", label: "⏳ Generating" },
    failed:     { bg: "#fdf0ee", color: "#b03020", label: "✗ Failed"      },
    pending:    { bg: "#f0f4fa", color: "#4a6080", label: "○ Pending"     },
  };
  const c = cfg[status] || cfg.pending;
  return (
    <span style={{
      padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
      background: c.bg, color: c.color,
    }}>
      {c.label}
    </span>
  );
}

export default function HistoryPage({ onBack, onEdit }) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [deleting, setDeleting] = useState(null);

  async function load() {
    try {
      setLoading(true);
      const res = await api.listReports();
      setData(res);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id, title) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await api.deleteReport(id);
      setData(d => ({ ...d, reports: d.reports.filter(r => r._id !== id) }));
    } catch (e) {
      alert("Delete failed: " + e.message);
    } finally {
      setDeleting(null);
    }
  }

  async function handleRegenerate(id) {
    try {
      const res = await api.regenerateReport(id);
      setData(d => ({
        ...d,
        reports: d.reports.map(r => r._id === id ? { ...r, status: res.status, pdfUrl: res.pdfUrl } : r),
      }));
    } catch (e) {
      alert("Regenerate failed: " + e.message);
    }
  }

  return (
    <div className="fade-up">
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <button onClick={onBack} style={{
          background: "none", border: "1.5px solid var(--border)", borderRadius: 8,
          padding: "8px 16px", cursor: "pointer", color: "var(--blue)", fontSize: 13, fontWeight: 600,
        }}>
          ← Back
        </button>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "var(--navy)" }}>
          All Reports
        </h2>
        <button onClick={load} style={{
          marginLeft: "auto", background: "none", border: "none",
          cursor: "pointer", color: "var(--muted)", fontSize: 13,
        }}>
          ↻ Refresh
        </button>
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: 60 }}>
          <Spinner size={32} />
          <p style={{ marginTop: 12, color: "var(--muted)" }}>Loading reports…</p>
        </div>
      )}

      {error && (
        <div style={{ color: "var(--error)", padding: 20, background: "#fdf0ee", borderRadius: 8 }}>
          ⚠ {error}
        </div>
      )}

      {data && data.reports.length === 0 && (
        <div style={{ textAlign: "center", padding: 60, color: "var(--muted)" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📂</div>
          <p>No reports yet. Create your first one!</p>
        </div>
      )}

      {data && data.reports.map(r => (
        <div key={r._id} style={{
          background: "var(--white)", border: "1px solid var(--border)",
          borderRadius: 12, padding: "18px 20px", marginBottom: 12,
          display: "flex", alignItems: "flex-start", gap: 16,
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "var(--navy)",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {r.title}
              </h3>
              <StatusBadge status={r.status} />
            </div>
            <p style={{ fontSize: 13, color: "var(--muted)" }}>
              {r.subject} · {r.year} · Section {r.section}
            </p>
            <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 3 }}>
              {r.authors?.map(a => a.name).join(", ")} ·{" "}
              {new Date(r.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}
            </p>
          </div>

          <div style={{ display: "flex", gap: 8, flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end" }}>
            {r.status === "ready" && r.pdfUrl && (
              <a href={r.pdfUrl} target="_blank" rel="noreferrer" style={{
                padding: "7px 14px", borderRadius: 7, fontSize: 13, fontWeight: 600,
                background: "var(--accent)", color: "var(--white)", textDecoration: "none",
              }}>
                ⬇ PDF
              </a>
            )}
            {(r.status === "failed" || r.status === "pending") && (
              <button onClick={() => handleRegenerate(r._id)} style={{
                padding: "7px 14px", borderRadius: 7, fontSize: 13, fontWeight: 600,
                background: "none", border: "1.5px solid var(--border)", color: "var(--blue)", cursor: "pointer",
              }}>
                ↻ Retry
              </button>
            )}
            <button onClick={() => handleDelete(r._id, r.title)} disabled={deleting === r._id} style={{
              padding: "7px 14px", borderRadius: 7, fontSize: 13, fontWeight: 600,
              background: "none", border: "1.5px solid var(--error)", color: "var(--error)",
              cursor: deleting === r._id ? "not-allowed" : "pointer", opacity: deleting === r._id ? 0.5 : 1,
            }}>
              {deleting === r._id ? "…" : "🗑"}
            </button>
          </div>
        </div>
      ))}

      {data && data.total > 20 && (
        <p style={{ textAlign: "center", color: "var(--muted)", fontSize: 13 }}>
          Showing 20 of {data.total} reports
        </p>
      )}
    </div>
  );
}
