import React, { useState, useEffect } from "react";
import { Plus, Trash, Phone, Envelope } from "@phosphor-icons/react";
import { api } from "../../utils/api";
import { Button } from "../shared/Button";
import { Input, Textarea } from "../shared/Input";
import { Modal } from "../shared/Modal";
import { Loading, EmptyState } from "../shared/EmptyState";

export const Proveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAdd, setModalAdd] = useState(false);
  const [nuevoProv, setNuevoProv] = useState({ nombre: "", contacto: "", telefono: "", email: "", categoria: "", notas: "" });

  useEffect(() => {
    cargarProveedores();
  }, []);

  const cargarProveedores = async () => {
    try {
      const data = await api.get("/proveedores");
      setProveedores(data);
    } catch (e) {
      console.error("Error:", e);
    } finally {
      setLoading(false);
    }
  };

  const guardarProveedor = async () => {
    try {
      await api.post("/proveedores", nuevoProv);
      setModalAdd(false);
      setNuevoProv({ nombre: "", contacto: "", telefono: "", email: "", categoria: "", notas: "" });
      cargarProveedores();
    } catch (e) {
      console.error("Error:", e);
    }
  };

  const eliminarProveedor = async (id) => {
    if (!window.confirm("¿Eliminar proveedor?")) return;
    try {
      await api.delete(`/proveedores/${id}`);
      cargarProveedores();
    } catch (e) {
      console.error("Error:", e);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="pb-24">
      <div className="container pt-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-h2 font-display">Proveedores</h1>
          <Button variant="accent" onClick={() => setModalAdd(true)} icon={<Plus size={20} />}>Nuevo</Button>
        </div>

        {proveedores.length === 0 ? (
          <EmptyState icon="🏪" title="Sin proveedores" description="Gestiona tu red de proveedores" action={<Button variant="accent" onClick={() => setModalAdd(true)}>Añadir proveedor</Button>} />
        ) : (
          <div className="space-y-3">
            {proveedores.map(prov => (
              <div key={prov.id} className="card p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-bold text-small">{prov.nombre}</div>
                    <div className="text-tiny text-secondary">{prov.categoria}</div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => eliminarProveedor(prov.id)} icon={<Trash size={16} />} />
                </div>
                {prov.contacto && <div className="text-tiny mb-1">👤 {prov.contacto}</div>}
                <div className="flex gap-3 text-tiny">
                  {prov.telefono && <a href={`tel:${prov.telefono}`} className="flex items-center gap-1"><Phone size={14} /> {prov.telefono}</a>}
                  {prov.email && <a href={`mailto:${prov.email}`} className="flex items-center gap-1"><Envelope size={14} /> {prov.email}</a>}
                </div>
                {prov.notas && <div className="text-tiny text-secondary mt-2">📝 {prov.notas}</div>}
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={modalAdd} onClose={() => setModalAdd(false)} title="Nuevo Proveedor">
        <div>
          <Input label="Nombre empresa" placeholder="Ej: Materiales López" value={nuevoProv.nombre} onChange={(e) => setNuevoProv(prev => ({ ...prev, nombre: e.target.value }))} />
          <Input label="Persona de contacto" placeholder="Nombre" value={nuevoProv.contacto} onChange={(e) => setNuevoProv(prev => ({ ...prev, contacto: e.target.value }))} />
          <Input label="Teléfono" type="tel" placeholder="6XX XXX XXX" value={nuevoProv.telefono} onChange={(e) => setNuevoProv(prev => ({ ...prev, telefono: e.target.value }))} />
          <Input label="Email" type="email" placeholder="email@ejemplo.com" value={nuevoProv.email} onChange={(e) => setNuevoProv(prev => ({ ...prev, email: e.target.value }))} />
          <Input label="Categoría" placeholder="Ej: Azulejos, Fontanería..." value={nuevoProv.categoria} onChange={(e) => setNuevoProv(prev => ({ ...prev, categoria: e.target.value }))} />
          <Textarea label="Notas" placeholder="Notas adicionales" value={nuevoProv.notas} onChange={(e) => setNuevoProv(prev => ({ ...prev, notas: e.target.value }))} rows={2} />
          <Button variant="accent" className="btn-full mt-4" onClick={guardarProveedor} disabled={!nuevoProv.nombre}>Guardar</Button>
        </div>
      </Modal>
    </div>
  );
};