import React, { useState, useEffect } from "react";
import { Users, Star, Phone, Envelope } from "@phosphor-icons/react";
import { api, formatCurrency } from "../../utils/api";
import { Button } from "../shared/Button";
import { Badge } from "../shared/Badge";
import { Loading, EmptyState } from "../shared/EmptyState";

export const CRMClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("todos");

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      const data = await api.get("/clientes");
      setClientes(data);
    } catch (e) {
      console.error("Error:", e);
    } finally {
      setLoading(false);
    }
  };

  const cambiarReputacion = async (id, reputacion) => {
    try {
      await api.put(`/clientes/${id}`, { reputacion });
      cargarClientes();
    } catch (e) {
      console.error("Error:", e);
    }
  };

  const clientesFiltrados = clientes.filter(c => {
    if (filtro === "todos") return true;
    if (filtro === "top") return c.total_gastado > 5000;
    if (filtro === "recurrentes") return c.total_presupuestos > 1;
    return c.reputacion === filtro;
  });

  if (loading) return <Loading />;

  return (
    <div className="pb-24">
      <div className="container pt-4">
        <h1 className="text-h2 font-display mb-4">CRM Clientes</h1>

        {/* Filtros */}
        <div className="tabs mb-4">
          {[
            { id: "todos", label: "Todos" },
            { id: "top", label: "🏆 TOP" },
            { id: "recurrentes", label: "Recurrentes" },
            { id: "bueno", label: "⭐ Buenos" },
            { id: "regular", label: "Regulares" },
            { id: "malo", label: "⚠️ Problemáticos" },
          ].map(f => (
            <button key={f.id} onClick={() => setFiltro(f.id)} className={`tab ${filtro === f.id ? "tab-active" : ""}`}>
              {f.label}
            </button>
          ))}
        </div>

        {clientesFiltrados.length === 0 ? (
          <EmptyState icon="👥" title="Sin clientes" description="Los clientes se registran automáticamente al crear presupuestos" />
        ) : (
          <div className="space-y-3">
            {clientesFiltrados.map(cliente => (
              <div key={cliente.id} className="card p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-bold text-small">{cliente.nombre}</div>
                    <div className="text-tiny text-secondary flex items-center gap-2 mt-1">
                      <Phone size={12} /> {cliente.telefono}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {["bueno", "regular", "malo"].map(rep => (
                      <button
                        key={rep}
                        onClick={() => cambiarReputacion(cliente.id, rep)}
                        style={{
                          fontSize: "1.2rem",
                          opacity: cliente.reputacion === rep ? 1 : 0.3,
                          cursor: "pointer",
                          border: "none",
                          background: "none"
                        }}
                      >
                        {rep === "bueno" ? "⭐" : rep === "regular" ? "🟡" : "🔴"}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-4 text-tiny">
                  <div>
                    <span className="text-secondary">Presupuestos:</span> <span className="font-bold">{cliente.total_presupuestos || 0}</span>
                  </div>
                  <div>
                    <span className="text-secondary">Total gastado:</span> <span className="font-bold" style={{ color: "var(--brand-accent)" }}>{formatCurrency(cliente.total_gastado || 0)}</span>
                  </div>
                </div>
                {cliente.ultima_obra && (
                  <div className="text-tiny text-secondary mt-2">Última obra: {cliente.ultima_obra}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};