import React from "react";
import { 
  Wrench, Package, Users, Receipt, ShieldCheck, Calendar, 
  FileText, Money, WhatsappLogo, Gear, ChartBar
} from "@phosphor-icons/react";

export const MenuAdmin = ({ onNavigate }) => {
  const secciones = [
    {
      titulo: "Gestión de Datos",
      items: [
        { id: "trabajos-custom", icon: <Wrench size={24} />, nombre: "Trabajos Custom", desc: "Servicios personalizados" },
        { id: "materiales", icon: <Package size={24} />, nombre: "Materiales", desc: "Catálogo de materiales" },
        { id: "proveedores", icon: <Users size={24} />, nombre: "Proveedores", desc: "Red de proveedores" },
        { id: "plantillas", icon: <FileText size={24} />, nombre: "Plantillas", desc: "Presupuestos predefinidos" },
      ]
    },
    {
      titulo: "Operaciones",
      items: [
        { id: "agenda", icon: <Calendar size={24} />, nombre: "Agenda", desc: "Calendario de obras" },
        { id: "facturas", icon: <Receipt size={24} />, nombre: "Facturas", desc: "Gestión de cobros" },
        { id: "garantias", icon: <ShieldCheck size={24} />, nombre: "Garantías", desc: "Control de garantías" },
        { id: "crm", icon: <Users size={24} />, nombre: "CRM Clientes", desc: "Reputación y seguimiento" },
      ]
    },
    {
      titulo: "Avanzado",
      items: [
        { id: "catalogo-admin", icon: <FileText size={24} />, nombre: "Catálogo", desc: "Fotos de trabajos" },
        { id: "whatsapp", icon: <WhatsappLogo size={24} />, nombre: "WhatsApp", desc: "Plantillas de mensajes" },
        { id: "configuracion", icon: <Gear size={24} />, nombre: "Configuración", desc: "Empresa y datos" },
      ]
    }
  ];

  return (
    <div className="pb-24">
      <div className="hero-header" style={{ padding: "24px 20px" }}>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div className="flex items-center gap-2 mb-2">
            <Gear size={28} weight="fill" style={{ color: "var(--brand-accent)" }} />
          </div>
          <div className="text-h2 font-display">Administración</div>
          <div className="text-small" style={{ opacity: 0.8, marginTop: 4 }}>
            Gestiona tu negocio
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: -20, position: "relative", zIndex: 2 }}>
        {secciones.map((seccion, idx) => (
          <div key={idx} className="mb-6">
            <div className="text-label mb-3" style={{ color: "var(--brand-primary)" }}>
              {seccion.titulo}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {seccion.items.map(item => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className="card p-4 card-interactive text-left"
                >
                  <div style={{ color: "var(--brand-accent)", marginBottom: 8 }}>
                    {item.icon}
                  </div>
                  <div className="font-bold text-small mb-1">{item.nombre}</div>
                  <div className="text-tiny text-secondary">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};