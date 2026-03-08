import { Input, Select, Card, SectionTitle } from "../components/UI.jsx";
import { DEPARTMENTS } from "../utils/constants.js";

export default function StepGuide({ form, setField, errors }) {
  const deptOptions = DEPARTMENTS.map(d => ({
    value: d.abbr,
    label: `${d.abbr} — ${d.name}`,
  }));

  function handleDeptChange(abbr) {
    const dept = DEPARTMENTS.find(d => d.abbr === abbr);
    setField("departmentAbbr", abbr);
    setField("departmentName", dept?.name || "");
    // Keep guide department in sync
    setField("guide", {
      ...form.guide,
      departmentAbbr: abbr,
      departmentFull: dept?.name || "",
    });
  }

  function setGuide(field, val) {
    setField("guide", { ...form.guide, [field]: val });
  }

  return (
    <div className="fade-up">
      <Card style={{ background: "var(--cream)" }}>
        <SectionTitle>Guide / Mentor</SectionTitle>

        <Input
          label="Guide Full Name"
          required
          value={form.guide.name}
          onChange={e => setGuide("name", e.target.value)}
          placeholder="e.g. Dr. Priya Nair"
          error={errors["guide.name"]}
        />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Input
            label="Designation"
            value={form.guide.designation}
            onChange={e => setGuide("designation", e.target.value)}
            placeholder="Professor"
          />
          <Select
            label="Guide Department"
            required
            value={form.guide.departmentAbbr}
            onChange={e => {
              const dept = DEPARTMENTS.find(d => d.abbr === e.target.value);
              setGuide("departmentAbbr", e.target.value);
              setGuide("departmentFull", dept?.name || "");
            }}
            options={deptOptions}
          />
        </div>
      </Card>

      <Card style={{ background: "var(--cream)" }}>
        <SectionTitle>Department</SectionTitle>

        <Select
          label="Student Department"
          required
          value={form.departmentAbbr}
          onChange={e => handleDeptChange(e.target.value)}
          options={deptOptions}
          hint="This is the department appearing on the cover page"
        />
        <Input
          label="HOD Full Name"
          required
          value={form.hod}
          onChange={e => setField("hod", e.target.value)}
          placeholder="e.g. Dr. Anand Kumar M"
          hint="Name printed on the certificate page"
          error={errors.hod}
        />
      </Card>
    </div>
  );
}
