import React from "react";

export const Input = ({ label, error, ...props }) => (
  <div className="input-group">
    {label && <label className="input-label">{label}</label>}
    <input className={`input ${error ? "input-error" : ""}`} {...props} />
    {error && <span className="text-tiny" style={{ color: "var(--error)" }}>{error}</span>}
  </div>
);

export const Textarea = ({ label, ...props }) => (
  <div className="input-group">
    {label && <label className="input-label">{label}</label>}
    <textarea className="input textarea" {...props} />
  </div>
);

export const Select = ({ label, options, ...props }) => (
  <div className="input-group">
    {label && <label className="input-label">{label}</label>}
    <select className="input select" {...props}>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);
