import { Input, Select } from "../components/UI.jsx";
import { SEMESTER_WORDS } from "../utils/constants.js";

export default function StepProject({ form, setField, errors }) {
  const semOptions = [1,2,3,4,5,6,7,8].map(n => ({
    value: n, label: `Semester ${n} — ${SEMESTER_WORDS[n-1]}`,
  }));

  function handleSemester(e) {
    const n = parseInt(e.target.value);
    setField("semesterNumber", n);
    setField("semesterWord", SEMESTER_WORDS[n - 1]);
  }

  return (
    <div className="fade-up">
      <Input
        label="Project Title"
        required
        value={form.title}
        onChange={e => setField("title", e.target.value)}
        placeholder="e.g. Smart Attendance System using Face Recognition"
        error={errors.title}
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Input
          label="Subject Name"
          required
          value={form.subject}
          onChange={e => setField("subject", e.target.value)}
          placeholder="e.g. Mini Project"
          error={errors.subject}
        />
        <Input
          label="Subject Code"
          required
          value={form.subjectCode}
          onChange={e => setField("subjectCode", e.target.value)}
          placeholder="e.g. 21CSL66"
          error={errors.subjectCode}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 16 }}>
        <Input
          label="Academic Year"
          required
          value={form.year}
          onChange={e => setField("year", e.target.value)}
          placeholder="2025-26"
          hint="Format: YYYY-YY"
          error={errors.year}
        />
        <Select
          label="Semester"
          required
          value={form.semesterNumber}
          onChange={handleSemester}
          options={semOptions}
        />
        <Input
          label="Section"
          required
          value={form.section}
          onChange={e => setField("section", e.target.value.toUpperCase())}
          placeholder="A"
          error={errors.section}
        />
      </div>
    </div>
  );
}
