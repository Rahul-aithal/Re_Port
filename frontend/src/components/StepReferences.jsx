import { Textarea } from "../components/UI.jsx";

const EXAMPLE = `my-article:
  type: article
  title: "Deep Learning for Image Recognition"
  author: "LeCun, Yann"
  date: 2015
  journal: Nature
  volume: 521
  page-range: 436-444

my-website:
  type: web
  title: "OpenCV Documentation"
  url: "https://docs.opencv.org"
  date: 2024`;

export default function StepReferences({ form, setField }) {
  return (
    <div className="fade-up">
      <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 6 }}>
        Paste your references in{" "}
        <a
          href="https://github.com/typst/hayagriva/blob/main/docs/file-format.md"
          target="_blank"
          rel="noreferrer"
          style={{ color: "var(--accent)", textDecoration: "underline" }}
        >
          Hayagriva YAML format
        </a>{" "}
        (Typst's bibliography format). Leave blank if no references needed.
      </p>

      <div style={{
        background: "var(--cream)", borderRadius: 8, padding: "12px 16px",
        marginBottom: 16, border: "1px solid var(--border)",
      }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Example format
        </p>
        <pre style={{ fontSize: 12, color: "var(--blue)", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
          {EXAMPLE}
        </pre>
      </div>

      <Textarea
        label="References (Hayagriva YAML)"
        rows={14}
        value={form.citations}
        onChange={e => setField("citations", e.target.value)}
        placeholder={EXAMPLE}
        style={{ fontFamily: "monospace", fontSize: 13 }}
      />
    </div>
  );
}
