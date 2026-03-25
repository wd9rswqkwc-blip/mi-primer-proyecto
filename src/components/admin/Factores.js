import React, { useState, useEffect } from "react";
import { Warning, Plus, Trash, PencilSimple } from "@phosphor-icons/react";
import { api } from "../../utils/api";
import { Button } from "../shared/Button";
import { Input } from "../shared/Input";
import { Modal } from "../shared/Modal";
import { Loading, EmptyState } from "../shared/EmptyState";

export const Factores = () => {
  const [factores, setFactores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAdd, setModalAdd] = useState(false);
  const [nuevoFactor, setNuevoFactor] = useState({ nombre: "", multiplicador: "", descripcion: "" });

  useEffect(() => {
    cargarFactores();
  }, []);

  const cargarFactores = async () => {
    try {
      const data = await api.get("/factores");
      setFactores(data);
    } catch (e) {
      console.error("Error:", e);
    } finally {
      setLoading(false);
    }
  };

  const guardarFactor = async () => {
    try {
      await api.post("/factores", nuevoFactor);
      setModalAdd(false);
      setNuevoFactor({ nombre: "", multiplicador: "", descripcion: "" });
      cargarFactores();
    } catch (e) {
      console.error("Error:", e);
    }
  };

  const eliminarFactor = async (id) => {
    if (!window.confirm("¿Eliminar factor?")) return;
    try {
      await api.delete(`/factores/${id}`);
      cargarFactores();
    } catch (e) {
      console.error("Error:", e);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="pb-24">
      <div className="container pt-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-h2 font-display">Factores e Imprevistos</h1>
          <Button variant="accent" onClick={() => setModalAdd(true)} icon={<Plus size={20} />}>Nuevo</Button>
        </div>

        <div className="card p-4 mb-4" style={{ background: "var(--warning-bg)", border: "1px solid var(--warning)" }}>
          <div className="text-small">
            ⚠️ Los factores actúan como multiplicadores en el precio final. Ej: -5% = 0.95, +10% = 1.10
          </div>
        </div>

        {factores.length === 0 ? (
          <EmptyState icon="⚠️" title="Sin factores" description="Añade factores que afecten el precio" action={<Button variant="accent" onClick={() => setModalAdd(true)}>Añadir factor</Button>} />
        ) : (
          <div className="card">
            {factores.map(factor => {
              const porcentaje = ((parseFloat(factor.multiplicador) - 1) * 100).toFixed(0);
              return (
                <div key={factor.id} className="list-item">
                  <div className="list-item-icon"><Warning size={20} /></div>
                  <div className="list-item-content">
                    <div className="list-item-title">{factor.nombre}</div>
                    <div className="list-item-subtitle">{factor.descripcion} • {porcentaje > 0 ? '+' : ''}{porcentaje}%</div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => eliminarFactor(factor.id)} icon={<Trash size={16} />} />
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Modal isOpen={modalAdd} onClose={() => setModalAdd(false)} title="Nuevo Factor">
        <div>
          <Input label="Nombre" placeholder="Ej: Acceso difícil" value={nuevoFactor.nombre} onChange={(e) => setNuevoFactor(prev => ({ ...prev, nombre: e.target.value }))} />
          <Input label="Multiplicador" type="number" step="0.01" placeholder="0.95 para -5%, 1.10 para +10%" value={nuevoFactor.multiplicador} onChange={(e) => setNuevoFactor(prev => ({ ...prev, multiplicador: e.target.value }))} />
          <Input label="Descripción" placeholder="Descripción del factor" value={nuevoFactor.descripcion} onChange={(e) => setNuevoFactor(prev => ({ ...prev, descripcion: e.target.value }))} />
          <Button variant="accent" className="btn-full mt-4" onClick={guardarFactor} disabled={!nuevoFactor.nombre || !nuevoFactor.multiplicador}>Guardar</Button>
        </div>
      </Modal>
    </div>
  );
};