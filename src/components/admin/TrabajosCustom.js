import React, { useState, useEffect } from "react";
import { Plus, Trash, Wrench, Eye, EyeSlash } from "@phosphor-icons/react";
import { api } from "../../utils/api";
import { Button } from "../shared/Button";
import { Input, Select } from "../shared/Input";
import { Modal } from "../shared/Modal";
import { Loading, EmptyState } from "../shared/EmptyState";
import { Badge } from "../shared/Badge";

export const TrabajosCustom = () => {
  const [trabajos, setTrabajos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAdd, setModalAdd] = useState(false);
  const [nuevoTrab, setNuevoTrab] = useState({ nombre: "", modulo: "bano", unidad: "m2", precio_eco: "", precio_std: "", precio_prem: "", visible: true });

  useEffect(() => {
    cargarTrabajos();
  }, []);

  const cargarTrabajos = async () => {
    try {
      const data = await api.get("/trabajos-custom");
      setTrabajos(data);
    } catch (e) {
      console.error("Error:", e);
    } finally {
      setLoading(false);
    }
  };

  const guardarTrabajo = async () => {
    try {
      await api.post("/trabajos-custom", nuevoTrab);
      setModalAdd(false);
      setNuevoTrab({ nombre: "", modulo: "bano", unidad: "m2", precio_eco: "", precio_std: "", precio_prem: "", visible: true });
      cargarTrabajos();
    } catch (e) {
      console.error("Error:", e);
    }
  };

  const toggleVisibilidad = async (id, visible) => {
    try {
      await api.put(`/trabajos-custom/${id}`, { visible: !visible });
      cargarTrabajos();
    } catch (e) {
      console.error("Error:", e);
    }
  };

  const eliminarTrabajo = async (id) => {
    if (!window.confirm("¿Eliminar trabajo?")) return;
    try {
      await api.delete(`/trabajos-custom/${id}`);
      cargarTrabajos();
    } catch (e) {
      console.error("Error:", e);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="pb-24">
      <div className="container pt-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-h2 font-display">Trabajos Custom</h1>
          <Button variant="accent" onClick={() => setModalAdd(true)} icon={<Plus size={20} />}>Nuevo</Button>
        </div>

        {trabajos.length === 0 ? (
          <EmptyState icon="🔧" title="Sin trabajos" description="Añade servicios personalizados" action={<Button variant="accent" onClick={() => setModalAdd(true)}>Añadir trabajo</Button>} />
        ) : (
          <div className="card">
            {trabajos.map(trab => (
              <div key={trab.id} className="list-item">
                <div className="list-item-icon"><Wrench size={20} /></div>
                <div className="list-item-content">
                  <div className="list-item-title">{trab.nombre} {!trab.visible && <Badge variant="outline">Oculto</Badge>}</div>
                  <div className="list-item-subtitle">{trab.modulo} • ECO: {trab.precio_eco}€ | STD: {trab.precio_std}€ | PREM: {trab.precio_prem}€ / {trab.unidad}</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => toggleVisibilidad(trab.id, trab.visible)} icon={trab.visible ? <Eye size={16} /> : <EyeSlash size={16} />} />
                  <Button variant="ghost" size="sm" onClick={() => eliminarTrabajo(trab.id)} icon={<Trash size={16} />} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={modalAdd} onClose={() => setModalAdd(false)} title="Nuevo Trabajo">
        <div>
          <Input label="Nombre" placeholder="Ej: Instalación mampara especial" value={nuevoTrab.nombre} onChange={(e) => setNuevoTrab(prev => ({ ...prev, nombre: e.target.value }))} />
          <Select label="Módulo" value={nuevoTrab.modulo} onChange={(e) => setNuevoTrab(prev => ({ ...prev, modulo: e.target.value }))} options={[{value:"bano",label:"Baño"},{value:"cocina",label:"Cocina"},{value:"suelo",label:"Suelo"},{value:"pintura",label:"Pintura"},{value:"puertas",label:"Puertas"}]} />
          <Select label="Unidad" value={nuevoTrab.unidad} onChange={(e) => setNuevoTrab(prev => ({ ...prev, unidad: e.target.value }))} options={[{value:"m2",label:"m²"},{value:"ml",label:"ml"},{value:"ud",label:"ud"}]} />
          <div className="grid grid-cols-3 gap-2">
            <Input label="ECO €" type="number" placeholder="0" value={nuevoTrab.precio_eco} onChange={(e) => setNuevoTrab(prev => ({ ...prev, precio_eco: e.target.value }))} />
            <Input label="STD €" type="number" placeholder="0" value={nuevoTrab.precio_std} onChange={(e) => setNuevoTrab(prev => ({ ...prev, precio_std: e.target.value }))} />
            <Input label="PREM €" type="number" placeholder="0" value={nuevoTrab.precio_prem} onChange={(e) => setNuevoTrab(prev => ({ ...prev, precio_prem: e.target.value }))} />
          </div>
          <Button variant="accent" className="btn-full mt-4" onClick={guardarTrabajo} disabled={!nuevoTrab.nombre}>Guardar</Button>
        </div>
      </Modal>
    </div>
  );
};