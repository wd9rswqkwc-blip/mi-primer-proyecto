import React, { useState, useEffect } from "react";
import { ShieldCheck, Plus, Trash, Warning } from "@phosphor-icons/react";
import { api, formatDate } from "../../utils/api";
import { Button } from "../shared/Button";
import { Input } from "../shared/Input";
import { Modal } from "../shared/Modal";
import { Loading, EmptyState } from "../shared/EmptyState";
import { Badge } from "../shared/Badge";

export const Garantias = () => {
  const [garantias, setGarantias] = useState([]);
  const [tiposGarantia, setTiposGarantia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalTipos, setModalTipos] = useState(false);
  const [nuevoTipo, setNuevoTipo] = useState({ tipo: "", meses: "" });

  useEffect(() => {
    cargarGarantias();
    cargarTipos();
  }, []);

  const cargarGarantias = async () => {
    try {
      const data = await api.get("/garantias");
      setGarantias(data);
    } catch (e) {
      console.error("Error:", e);
    } finally {
      setLoading(false);
    }
  };

  const cargarTipos = async () => {
    try {
      const data = await api.get("/garantias/tipos");
      setTiposGarantia(data);
    } catch (e) {
      console.error("Error:", e);
    }
  };

  const guardarTipo = async () => {
    try {
      await api.post("/garantias/tipos", nuevoTipo);
      setModalTipos(false);
      setNuevoTipo({ tipo: "", meses: "" });
      cargarTipos();
    } catch (e) {
      console.error("Error:", e);
    }
  };

  const eliminarTipo = async (id) => {
    if (!window.confirm("¿Eliminar tipo de garantía?")) return;
    try {
      await api.delete(`/garantias/tipos/${id}`);
      cargarTipos();
    } catch (e) {
      console.error("Error:", e);
    }
  };

  const calcularEstado = (fechaFin) => {
    const hoy = new Date();
    const fin = new Date(fechaFin);
    if (fin < hoy) return "vencida";
    const diasRestantes = Math.ceil((fin - hoy) / (1000 * 60 * 60 * 24));
    if (diasRestantes <= 30) return "proxima";
    return "vigente";
  };

  if (loading) return <Loading />;

  return (
    <div className="pb-24">
      <div className="container pt-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-h2 font-display">Garantías</h1>
          <Button variant="accent" onClick={() => setModalTipos(true)} icon={<Plus size={20} />}>Tipos</Button>
        </div>

        {/* Tipos de garantía */}
        <div className="card p-4 mb-4">
          <div className="text-label mb-3">TIPOS DE GARANTÍA</div>
          {tiposGarantia.length === 0 ? (
            <div className="text-tiny text-secondary">No hay tipos configurados</div>
          ) : (
            <div className="space-y-2">
              {tiposGarantia.map(tipo => (
                <div key={tipo.id} className="flex items-center justify-between p-2 rounded" style={{ background: "var(--surface-secondary)" }}>
                  <div className="text-small font-bold">{tipo.tipo}</div>
                  <div className="flex items-center gap-2">
                    <Badge variant="primary">{tipo.meses} meses</Badge>
                    <Button variant="ghost" size="sm" onClick={() => eliminarTipo(tipo.id)} icon={<Trash size={14} />} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Garantías activas */}
        <div className="text-label mb-3">GARANTÍAS ACTIVAS</div>
        {garantias.length === 0 ? (
          <EmptyState icon="🛑" title="Sin garantías" description="Las garantías se crean automáticamente al finalizar obras" />
        ) : (
          <div className="space-y-3">
            {garantias.map(gar => {
              const estado = calcularEstado(gar.fecha_fin);
              return (
                <div key={gar.id} className="card p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-bold text-small">{gar.presupuesto_numero}</div>
                      <div className="text-tiny text-secondary">{gar.cliente}</div>
                    </div>
                    <Badge variant={estado === "vigente" ? "success" : estado === "proxima" ? "warning" : "error"}>
                      {estado === "vigente" ? "Vigente" : estado === "proxima" ? "Por vencer" : "Vencida"}
                    </Badge>
                  </div>
                  <div className="text-tiny">
                    Vence: {formatDate(gar.fecha_fin)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Modal isOpen={modalTipos} onClose={() => setModalTipos(false)} title="Nuevo Tipo de Garantía">
        <div>
          <Input label="Tipo de trabajo" placeholder="Ej: Fontanería" value={nuevoTipo.tipo} onChange={(e) => setNuevoTipo(prev => ({ ...prev, tipo: e.target.value }))} />
          <Input label="Duración (meses)" type="number" placeholder="12" value={nuevoTipo.meses} onChange={(e) => setNuevoTipo(prev => ({ ...prev, meses: e.target.value }))} />
          <Button variant="accent" className="btn-full mt-4" onClick={guardarTipo} disabled={!nuevoTipo.tipo || !nuevoTipo.meses}>Guardar</Button>
        </div>
      </Modal>
    </div>
  );
};