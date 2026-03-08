import { Input, Button, Card, SectionTitle } from "../components/UI.jsx";

export default function StepAuthors({ form, setField, errors }) {
  const authors = form.authors;

  function update(i, field, val) {
    const next = authors.map((a, idx) => idx === i ? { ...a, [field]: val } : a);
    setField("authors", next);
  }

  function add() {
    if (authors.length < 4) setField("authors", [...authors, { name: "", usn: "" }]);
  }

  function remove(i) {
    if (authors.length > 1) setField("authors", authors.filter((_, idx) => idx !== i));
  }

  return (
    <div className="fade-up">
      <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20 }}>
        Add between 1 and 4 students who authored this report.
      </p>

      {authors.map((a, i) => (
        <Card key={i} style={{ background: "var(--cream)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <SectionTitle>Author {i + 1}</SectionTitle>
            {authors.length > 1 && (
              <button onClick={() => remove(i)} style={{
                background: "none", border: "none", cursor: "pointer",
                color: "var(--error)", fontSize: 20, lineHeight: 1, padding: "0 4px",
              }} title="Remove author">×</button>
            )}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Input
              label="Full Name"
              required
              value={a.name}
              onChange={e => update(i, "name", e.target.value)}
              placeholder="e.g. Riya Sharma"
            />
            <Input
              label="USN"
              required
              value={a.usn}
              onChange={e => update(i, "usn", e.target.value.toUpperCase())}
              placeholder="e.g. 1BG23CS042"
              hint="Will be auto-uppercased"
            />
          </div>
        </Card>
      ))}

      {errors.authors && (
        <p style={{ color: "var(--error)", fontSize: 13, marginBottom: 12 }}>⚠ {errors.authors}</p>
      )}

      {authors.length < 4 && (
        <button onClick={add} style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "none", border: "1.5px dashed var(--accent)",
          borderRadius: 8, padding: "10px 20px", color: "var(--accent)",
          fontSize: 13, fontWeight: 600, cursor: "pointer",
          transition: "background 0.2s",
        }}>
          <span style={{ fontSize: 18 }}>+</span> Add Another Author
        </button>
      )}
    </div>
  );
}
