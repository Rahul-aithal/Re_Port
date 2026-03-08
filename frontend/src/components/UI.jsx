import { useState } from "react";

// ── Field Label ──────────────────────────────────────────────────────────────
export function Label({ children, required, htmlFor }) {
  return (
    <label htmlFor={htmlFor} style={{
      display: "block", marginBottom: 5,
      fontSize: 11, fontWeight: 600, letterSpacing: "0.08em",
      textTransform: "uppercase", color: "var(--muted)",
    }}>
      {children}
      {required && <span style={{ color: "var(--accent)", marginLeft: 2 }}>*</span>}
    </label>
  );
}

// ── Input ────────────────────────────────────────────────────────────────────
export function Input({ label, required, hint, error, id, ...props }) {
  const [focused, setFocused] = useState(false);
  const fid = id || label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div style={{ marginBottom: 20 }}>
      {label && <Label required={required} htmlFor={fid}>{label}</Label>}
      <input
        id={fid}
        required={required}
        {...props}
        onFocus={e => { setFocused(true); props.onFocus?.(e); }}
        onBlur={e  => { setFocused(false); props.onBlur?.(e); }}
        style={{
          width: "100%", padding: "10px 14px",
          border: `1.5px solid ${error ? "var(--error)" : focused ? "var(--accent)" : "var(--border)"}`,
          borderRadius: 8, fontSize: 14, color: "var(--text)",
          background: "var(--white)", outline: "none",
          transition: "border-color 0.2s, box-shadow 0.2s",
          boxShadow: focused ? `0 0 0 3px rgba(200,64,26,0.1)` : "none",
          ...props.style,
        }}
      />
      {hint  && !error && <p style={{ marginTop: 4, fontSize: 12, color: "var(--muted)" }}>{hint}</p>}
      {error && <p style={{ marginTop: 4, fontSize: 12, color: "var(--error)" }}>⚠ {error}</p>}
    </div>
  );
}

// ── Textarea ─────────────────────────────────────────────────────────────────
export function Textarea({ label, required, hint, error, id, rows = 6, ...props }) {
  const [focused, setFocused] = useState(false);
  const fid = id || label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div style={{ marginBottom: 20 }}>
      {label && <Label required={required} htmlFor={fid}>{label}</Label>}
      <textarea
        id={fid}
        rows={rows}
        required={required}
        {...props}
        onFocus={e => { setFocused(true); props.onFocus?.(e); }}
        onBlur={e  => { setFocused(false); props.onBlur?.(e); }}
        style={{
          width: "100%", padding: "10px 14px",
          border: `1.5px solid ${error ? "var(--error)" : focused ? "var(--accent)" : "var(--border)"}`,
          borderRadius: 8, fontSize: 14, color: "var(--text)",
          background: "var(--white)", outline: "none",
          resize: "vertical", lineHeight: 1.65,
          transition: "border-color 0.2s, box-shadow 0.2s",
          boxShadow: focused ? `0 0 0 3px rgba(200,64,26,0.1)` : "none",
          ...props.style,
        }}
      />
      {hint  && !error && <p style={{ marginTop: 4, fontSize: 12, color: "var(--muted)" }}>{hint}</p>}
      {error && <p style={{ marginTop: 4, fontSize: 12, color: "var(--error)" }}>⚠ {error}</p>}
    </div>
  );
}

// ── Select ───────────────────────────────────────────────────────────────────
export function Select({ label, required, options, hint, error, id, ...props }) {
  const [focused, setFocused] = useState(false);
  const fid = id || label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div style={{ marginBottom: 20 }}>
      {label && <Label required={required} htmlFor={fid}>{label}</Label>}
      <div style={{ position: "relative" }}>
        <select
          id={fid}
          required={required}
          {...props}
          onFocus={e => { setFocused(true); props.onFocus?.(e); }}
          onBlur={e  => { setFocused(false); props.onBlur?.(e); }}
          style={{
            width: "100%", padding: "10px 36px 10px 14px",
            border: `1.5px solid ${error ? "var(--error)" : focused ? "var(--accent)" : "var(--border)"}`,
            borderRadius: 8, fontSize: 14, color: "var(--text)",
            background: "var(--white)", outline: "none", appearance: "none",
            transition: "border-color 0.2s", cursor: "pointer",
            ...props.style,
          }}
        >
          {options.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
          pointerEvents: "none", color: "var(--muted)", fontSize: 12 }}>▼</span>
      </div>
      {hint  && !error && <p style={{ marginTop: 4, fontSize: 12, color: "var(--muted)" }}>{hint}</p>}
      {error && <p style={{ marginTop: 4, fontSize: 12, color: "var(--error)" }}>⚠ {error}</p>}
    </div>
  );
}

// ── Button ───────────────────────────────────────────────────────────────────
export function Button({ children, variant = "primary", disabled, onClick, style = {} }) {
  const [hovered, setHovered] = useState(false);
  const variants = {
    primary:   { bg: "var(--navy)",    color: "var(--white)",  border: "var(--navy)"   },
    accent:    { bg: "var(--accent)",  color: "var(--white)",  border: "var(--accent)" },
    secondary: { bg: "transparent",    color: "var(--blue)",   border: "var(--border)" },
    danger:    { bg: "transparent",    color: "var(--error)",  border: "var(--error)"  },
  };
  const v = variants[variant] || variants.primary;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "11px 26px", borderRadius: 8,
        border: `1.5px solid ${v.border}`,
        background: disabled ? "var(--border)" : (hovered && variant !== "secondary" ? v.bg + "dd" : v.bg),
        color: disabled ? "var(--muted)" : v.color,
        fontWeight: 600, fontSize: 14, cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.2s", whiteSpace: "nowrap",
        opacity: disabled ? 0.7 : 1,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

// ── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, style = {} }) {
  return (
    <div style={{
      background: "var(--white)", borderRadius: 12,
      border: `1px solid var(--border)`,
      padding: "20px 22px", marginBottom: 16,
      ...style,
    }}>
      {children}
    </div>
  );
}

// ── Section heading inside a step ────────────────────────────────────────────
export function SectionTitle({ children }) {
  return (
    <p style={{
      fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 600,
      color: "var(--blue)", marginBottom: 14, letterSpacing: "0.03em",
      textTransform: "uppercase", borderBottom: "1px solid var(--border)", paddingBottom: 8,
    }}>
      {children}
    </p>
  );
}

// ── Spinner ──────────────────────────────────────────────────────────────────
export function Spinner({ size = 20 }) {
  return (
    <span style={{
      display: "inline-block", width: size, height: size,
      border: `2px solid var(--border)`,
      borderTopColor: "var(--accent)",
      borderRadius: "50%",
      animation: "spin 0.7s linear infinite",
    }} />
  );
}

// ── Accordion item ────────────────────────────────────────────────────────────
export function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{
      border: `1.5px solid ${open ? "var(--accent)" : "var(--border)"}`,
      borderRadius: 10, marginBottom: 10, overflow: "hidden",
      transition: "border-color 0.2s",
    }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: "100%", textAlign: "left",
        background: open ? "var(--navy)" : "var(--cream)",
        border: "none", padding: "13px 18px", cursor: "pointer",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{ fontWeight: 600, fontSize: 14, color: open ? "var(--white)" : "var(--text)" }}>
          {title}
        </span>
        <span style={{ color: open ? "var(--gold)" : "var(--muted)", fontSize: 20, lineHeight: 1 }}>
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <div style={{ padding: "18px 18px 4px", background: "var(--white)" }}>
          {children}
        </div>
      )}
    </div>
  );
}
