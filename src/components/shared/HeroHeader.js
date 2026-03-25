import React from "react";
import { Badge } from "../shared/Badge";

export const HeroHeader = ({ empresa }) => (
  <div className="hero-header" data-testid="hero-header">
    <div style={{ position: "relative", zIndex: 1 }}>
      <div className="flex items-center gap-2 mb-3">
        <Badge variant="accent">
          <span className="animate-pulse" style={{ width: 6, height: 6, background: "#4ade80", borderRadius: "50%", display: "inline-block" }} />
          Disponible
        </Badge>
        <span className="text-tiny" style={{ opacity: 0.7 }}>{empresa?.direccion || "Lleida"}</span>
      </div>
      
      <h1 className="text-hero font-display" style={{ marginBottom: 8 }}>
        {empresa?.nombre?.split(" ")[0] || "Andy"}{" "}
        <span style={{ color: "var(--brand-accent)" }}>{empresa?.nombre?.split(" ")[1] || "Gonzaga"}</span>
      </h1>
      
      <p className="text-small" style={{ opacity: 0.8, marginBottom: 16 }}>
        {empresa?.slogan || "Instalaciones y Reformas"}
      </p>
      
      <div className="flex gap-2 flex-wrap">
        <Badge variant="outline">⭐ +10 años experiencia</Badge>
        <Badge variant="outline">📋 Presupuesto 24h</Badge>
        <Badge variant="outline">✅ Garantía escrita</Badge>
      </div>
    </div>
  </div>
);
