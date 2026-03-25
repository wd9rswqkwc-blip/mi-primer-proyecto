import React from "react";

export const EmptyState = ({ icon, title, description, action }) => (
  <div className="empty-state">
    <div className="empty-state-icon">{icon}</div>
    <div className="empty-state-title">{title}</div>
    <div className="empty-state-description">{description}</div>
    {action && <div style={{ marginTop: 16 }}>{action}</div>}
  </div>
);

export const Loading = () => (
  <div className="empty-state">
    <div className="animate-spin" style={{ fontSize: "2rem" }}>⏳</div>
    <div className="empty-state-title">Cargando...</div>
  </div>
);
