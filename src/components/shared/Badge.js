import React from "react";

export const Badge = ({ children, variant = "primary" }) => (
  <span className={`badge badge-${variant}`}>{children}</span>
);

export const Chip = ({ children, active, onClick }) => (
  <button
    className={`chip chip-interactive ${active ? "chip-active" : ""}`}
    onClick={onClick}
  >
    {children}
  </button>
);
