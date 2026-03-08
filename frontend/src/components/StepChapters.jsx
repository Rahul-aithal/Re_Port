import { Textarea, Accordion } from "../components/UI.jsx";
import { CHAPTER_KEYS } from "../utils/constants.js";

export default function StepChapters({ form, setField }) {
  return (
    <div className="fade-up">
      <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 18 }}>
        Fill in each chapter. Use blank lines to separate paragraphs. You can leave a section empty and add content later.
      </p>

      {CHAPTER_KEYS.map((ch, i) => {
        const wordCount = (form[ch.key] || "").trim().split(/\s+/).filter(Boolean).length;
        return (
          <Accordion key={ch.key} title={`${ch.label} ${wordCount > 0 ? `— ${wordCount} words` : ""}`} defaultOpen={i === 0}>
            <Textarea
              rows={10}
              value={form[ch.key]}
              onChange={e => setField(ch.key, e.target.value)}
              placeholder={ch.placeholder}
            />
          </Accordion>
        );
      })}
    </div>
  );
}
