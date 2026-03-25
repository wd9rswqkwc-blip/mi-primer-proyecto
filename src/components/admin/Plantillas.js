import React, { useState, useEffect } from "react";
import { Plus, Trash, PencilSimple, Copy } from "@phosphor-icons/react";
import { api } from "../../utils/api";
import { Button } from "../shared/Button";
import { Input, Textarea, Select } from "../shared/Input";
import { Modal } from "../shared/Modal";
import { Loading, EmptyState } from "../shared/EmptyState";
import { Badge } from "../shared/Badge";

export const Plantillas = () => {
  const [plantillas, setPlantillas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalEdit, setModalEdit] = useState(false);
  const [plantillaActual, setPlantillaActual] = useState(null);

  useEffect(() => {
    cargarPlantillas();
  }, []);

  const cargarPlantillas = async () => {
    try {
      const data = await api.get("/plantillas");
      setPlantillas(data);
    } catch (e) {
      console.error("Error:", e);
    } finally {
      setLoading(false);
    }
  };

  const nuevaPlantilla = () => {
    setPlantillaActual({
      id: null,
      nombre: "",
      descripcion: "",
      lineas: []
    });
    setModalEdit(true);
  };

  const editarPlantilla = (plantilla) => {
    setPlantillaActual({ ...plantilla });
    setModalEdit(true);
  };

  const guardarPlantilla = async () => {
    try {
      if (plantillaActual.id) {
        await api.put(`/plantillas/${plantillaActual.id}`, plantillaActual);
      } else {
        await api.post("/plantillas", plantillaActual);
      }
      setModalEdit(false);
      cargarPlantillas();
    } catch (e) {
      console.error("Error:", e);
    }
  };

  const eliminarPlantilla = async (id) => {
    if (!window.confirm("¿Eliminar plantilla?")) return;
    try {
      await api.delete(`/plantillas/${id}`);
      cargarPlantillas();
    } catch (e) {
      console.error("Error:", e);
    }
  };

  const duplicarPlantilla = async (plantilla) => {
    const copia = { ...plantilla, nombre: `${plantilla.nombre} (copia)`, id: null };
    try {
      await api.post("/plantillas", copia);
      cargarPlantillas();
    } catch (e) {
      console.error("Error:", e);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="pb-24">
      <div className="container pt-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-h2 font-display">Plantillas de Presupuesto</h1>
          <Button variant="accent" onClick={nuevaPlantilla} icon={<Plus size={20} />}>
            Nueva
          </Button>
        </div>

        <div className="card p-4 mb-4" style={{ background: "var(--info-bg)", border: "1px solid var(--info)" }}>
          <div className="text-small">
            💡 Las plantillas te permiten crear presupuestos predefinidos para agilizar tu trabajo
          </div>
        </div>

        {plantillas.length === 0 ? (
          <EmptyState
            icon="📋"
            title="Sin plantillas"
            description="Crea plantillas para presupuestos recurrentes"
            action={<Button variant="accent" onClick={nuevaPlantilla}>Crear primera plantilla</Button>}
          />
        ) : (
          <div className="space-y-3">
            {plantillas.map(p => (
              <div key={p.id} className="card p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-bold text-small">{p.nombre}</div>
                    {p.descripcion && <div className="text-tiny text-secondary">{p.descripcion}</div>}
                  </div>
                  <Badge variant="primary">{p.lineas?.length || 0} trabajos</Badge>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" onClick={() => editarPlantilla(p)} icon={<PencilSimple size={16} />}>
                    Editar
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => duplicarPlantilla(p)} icon={<Copy size={16} />}>
                    Duplicar
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => eliminarPlantilla(p.id)} icon={<Trash size={16} />}>
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal editar */}
      <Modal
        isOpen={modalEdit}
        onClose={() => setModalEdit(false)}
        title={plantillaActual?.id ? "Editar Plantilla" : "Nueva Plantilla"}
      >
        {plantillaActual && (
          <div>
            <Input
              label="Nombre de la plantilla"
              placeholder="Ej: Reforma baño estándar"
              value={plantillaActual.nombre}
              onChange={(e) => setPlantillaActual(prev => ({ ...prev, nombre: e.target.value }))}
            />
            <Textarea
              label="Descripción"
              placeholder="Descripción opcional"
              value={plantillaActual.descripcion}
              onChange={(e) => setPlantillaActual(prev => ({ ...prev, descripcion: e.target.value }))}
              rows={2}
            />
            <div className="text-small text-secondary mb-4">
              Los trabajos se añaden al crear presupuestos desde esta plantilla
            </div>
            <Button
              variant="accent"
              className="btn-full"
              onClick={guardarPlantilla}
              disabled={!plantillaActual.nombre}
            >
              Guardar plantilla
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};