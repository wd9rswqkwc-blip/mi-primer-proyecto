import React, { useState, useEffect } from "react";
import { Plus, Trash, Package } from "@phosphor-icons/react";
import { api } from "../../utils/api";
import { Button } from "../shared/Button";
import { Input, Select } from "../shared/Input";
import { Modal } from "../shared/Modal";
import { Loading, EmptyState } from "../shared/EmptyState";

export const MaterialesCustom = () => {
  const [materiales, setMateriales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAdd, setModalAdd] = useState(false);
  const [nuevoMat, setNuevoMat] = useState({ nombre: "", categoria: "", unidad: "m2", precio_eco: "", precio_std: "", precio_prem: "" });

  useEffect(() => {
    cargarMateriales();
  }, []);

  const cargarMateriales = async () => {
    try {
      const data = await api.get("/materiales");
      setMateriales(data);
    } catch (e) {
      console.error("Error:", e);
    } finally {
      setLoading(false);
    }
  };

  const guardarMaterial = async () => {
    try {
      await api.post("/materiales", nuevoMat);
      setModalAdd(false);
      setNuevoMat({ nombre: "", categoria: "", unidad: "m2", precio_eco: "", precio_std: "", precio_prem: "" });
      cargarMateriales();
    } catch (e) {
      console.error("Error:", e);
    }
  };

  const eliminarMaterial = async (id) => {
    if (!window.confirm("¿Eliminar material?")) return;
    try {
      await api.delete(`/materiales/${id}`);
      cargarMateriales();
    } catch (e) {
      console.error("Error:", e);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="pb-24">
      <div className="container pt-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-h2 font-display">Materiales Custom</h1>
          <Button variant="accent" onClick={() => setModalAdd(true)} icon={<Plus size={20} />}>Nuevo</Button>
        </div>

        {materiales.length === 0 ? (
          <EmptyState icon="📦" title="Sin materiales" description="Añade materiales personalizados" action={<Button variant="accent" onClick={() => setModalAdd(true)}>Añadir material</Button>} />
        ) : (
          <div className="card">
            {materiales.map(mat => (
              <div key={mat.id} className="list-item">
                <div className="list-item-icon"><Package size={20} /></div>
                <div className="list-item-content">
                  <div className="list-item-title">{mat.nombre}</div>
                  <div className="list-item-subtitle">{mat.categoria} • ECO: {mat.precio_eco}€ | STD: {mat.precio_std}€ | PREM: {mat.precio_prem}€ / {mat.unidad}</div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => eliminarMaterial(mat.id)} icon={<Trash size={16} />} />
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={modalAdd} onClose={() => setModalAdd(false)} title="Nuevo Material">
        <div>
          <Input label="Nombre" placeholder="Ej: Azulejo porcelánico" value={nuevoMat.nombre} onChange={(e) => setNuevoMat(prev => ({ ...prev, nombre: e.target.value }))} />
          <Input label="Categoría" placeholder="Ej: Revestimientos" value={nuevoMat.categoria} onChange={(e) => setNuevoMat(prev => ({ ...prev, categoria: e.target.value }))} />
          <Select label="Unidad" value={nuevoMat.unidad} onChange={(e) => setNuevoMat(prev => ({ ...prev, unidad: e.target.value }))} options={[{value:"m2",label:"m²"},{value:"ml",label:"ml"},{value:"ud",label:"ud"},{value:"kg",label:"kg"}]} />
          <div className="grid grid-cols-3 gap-2">
            <Input label="ECO €" type="number" placeholder="0" value={nuevoMat.precio_eco} onChange={(e) => setNuevoMat(prev => ({ ...prev, precio_eco: e.target.value }))} />
            <Input label="STD €" type="number" placeholder="0" value={nuevoMat.precio_std} onChange={(e) => setNuevoMat(prev => ({ ...prev, precio_std: e.target.value }))} />
            <Input label="PREM €" type="number" placeholder="0" value={nuevoMat.precio_prem} onChange={(e) => setNuevoMat(prev => ({ ...prev, precio_prem: e.target.value }))} />
          </div>
          <Button variant="accent" className="btn-full mt-4" onClick={guardarMaterial} disabled={!nuevoMat.nombre}>Guardar</Button>
        </div>
      </Modal>
    </div>
  );
};