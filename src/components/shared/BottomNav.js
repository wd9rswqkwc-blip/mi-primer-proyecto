import React from "react";
import { House, MagnifyingGlass, Calculator, Money, Camera, ChartBar, Plus, FileText, Gear } from "@phosphor-icons/react";

export const BottomNav = ({ activeTab, onNavigate, isAdmin }) => {
  const clientTabs = [
    { id: "portada", icon: <House size={22} weight={activeTab === "portada" ? "fill" : "regular"} />, label: "Inicio" },
    { id: "diagnostico", icon: <MagnifyingGlass size={22} weight={activeTab === "diagnostico" ? "fill" : "regular"} />, label: "Diagnóstico" },
    { id: "presupuesto", icon: <Calculator size={22} weight={activeTab === "presupuesto" ? "fill" : "regular"} />, label: "Presupuesto" },
    { id: "precios", icon: <Money size={22} weight={activeTab === "precios" ? "fill" : "regular"} />, label: "Precios" },
    { id: "catalogo", icon: <Camera size={22} weight={activeTab === "catalogo" ? "fill" : "regular"} />, label: "Catálogo" },
  ];

  const adminTabs = [
    { id: "dashboard", icon: <ChartBar size={22} weight={activeTab === "dashboard" ? "fill" : "regular"} />, label: "Panel" },
    { id: "presupuesto", icon: <Plus size={22} weight="bold" />, label: "Nuevo" },
    { id: "historial", icon: <FileText size={22} weight={activeTab === "historial" ? "fill" : "regular"} />, label: "Historial" },
    { id: "precios", icon: <Money size={22} weight={activeTab === "precios" ? "fill" : "regular"} />, label: "Precios" },
    { id: "admin", icon: <Gear size={22} weight={activeTab === "admin" ? "fill" : "regular"} />, label: "Admin" },
  ];

  const tabs = isAdmin ? adminTabs : clientTabs;

  return (
    <nav className="bottom-nav" data-testid="bottom-nav">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onNavigate(tab.id)}
          className={`nav-item ${activeTab === tab.id ? "nav-item-active" : ""}`}
          data-testid={`nav-${tab.id}`}
        >
          <span className="nav-item-icon">{tab.icon}</span>
          <span className="nav-item-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};
