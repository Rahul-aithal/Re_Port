import { Textarea } from "../components/UI.jsx";

export default function StepAbstract({ form, setField, errors }) {
  const wordCount = form.abstract.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="fade-up">
      <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>
        Write a concise summary of your project. Typically 150–250 words.
      </p>

      <Textarea
        label="Abstract"
        required
        rows={12}
        value={form.abstract}
        onChange={e => setField("abstract", e.target.value)}
        placeholder="This project presents... The proposed system... Results demonstrate..."
        error={errors.abstract}
      />

      <p style={{
        fontSize: 12, color: wordCount < 100 ? "var(--accent)" : "var(--success)",
        marginTop: -12, textAlign: "right",
      }}>
        {wordCount} word{wordCount !== 1 ? "s" : ""}{wordCount < 100 ? " (aim for 150–250)" : " ✓"}
      </p>
    </div>
  );
}
