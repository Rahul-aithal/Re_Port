import { STEPS } from "../utils/constants.js";

export default function Stepper({ currentStep, onGoTo }) {
  return (
    <div style={{
      display: "flex", alignItems: "flex-start",
      justifyContent: "center", gap: 0, marginBottom: 36,
      position: "relative",
    }}>
      {/* Connector line behind steps */}
      <div style={{
        position: "absolute", top: 16, left: "calc(8.33% + 16px)",
        width: "calc(83.33% - 32px)", height: 2,
        background: "var(--border)", zIndex: 0,
      }} />
      {/* Filled portion */}
      <div style={{
        position: "absolute", top: 16, left: "calc(8.33% + 16px)",
        width: `calc((83.33% - 32px) * ${(currentStep - 1) / (STEPS.length - 1)})`,
        height: 2, background: "var(--accent)", zIndex: 0,
        transition: "width 0.4s ease",
      }} />

      {STEPS.map(step => {
        const done    = currentStep > step.id;
        const active  = currentStep === step.id;
        const canClick = step.id < currentStep;

        return (
          <div key={step.id} style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", gap: 8, zIndex: 1,
            cursor: canClick ? "pointer" : "default",
          }} onClick={() => canClick && onGoTo(step.id)}>

            {/* Circle */}
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: done ? 14 : 13, fontWeight: 700,
              background: done ? "var(--success)" : active ? "var(--accent)" : "var(--white)",
              border: `2px solid ${done ? "var(--success)" : active ? "var(--accent)" : "var(--border)"}`,
              color: (done || active) ? "var(--white)" : "var(--muted)",
              transition: "all 0.3s",
              boxShadow: active ? "0 0 0 4px rgba(200,64,26,0.15)" : "none",
            }}>
              {done ? "✓" : step.icon}
            </div>

            {/* Label */}
            <span style={{
              fontSize: 11, fontWeight: active ? 700 : 400,
              color: active ? "var(--accent)" : done ? "var(--success)" : "var(--muted)",
              textAlign: "center", lineHeight: 1.3,
              transition: "color 0.3s",
            }}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
