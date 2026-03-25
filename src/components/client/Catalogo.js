import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Camera, Plus, Trash, ArrowLeft } from "@phosphor-icons/react";
import { api } from "../../utils/api";
import { Button } from "../shared/Button";
import { Loading, EmptyState } from "../shared/EmptyState";
import { Modal } from "../shared/Modal";
import { Input, Textarea } from "../shared/Input";

export const Catalogo = ({ isAdmin }) => {
  const [fotos, setFotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAdd, setModalAdd] = useState(false);
  const [nuevaFoto, setNuevaFoto] = useState({ titulo: "", descripcion: "", imagen: null, imagenPreview: null });

  useEffect(() => {
    cargarCatalogo();
  }, []);

  const cargarCatalogo = async () => {
    try {
      const data = await api.get("/catalogo");
      setFotos(data);
    } catch (e) {
      console.error("Error cargando catálogo:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNuevaFoto(prev => ({ ...prev, imagen: reader.result, imagenPreview: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const guardarFoto = async () => {
    if (!nuevaFoto.titulo || !nuevaFoto.imagen) return;
    try {
      await api.post("/catalogo", nuevaFoto);
      setModalAdd(false);
      setNuevaFoto({ titulo: "", descripcion: "", imagen: null, imagenPreview: null });
      cargarCatalogo();
    } catch (e) {
      console.error("Error guardando foto:", e);
    }
  };

  const eliminarFoto = async (id) => {
    if (!window.confirm("¿Eliminar esta foto?")) return;
    try {
      await api.delete(`/catalogo/${id}`);
      cargarCatalogo();
    } catch (e) {
      console.error("Error eliminando foto:", e);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="pb-24">
      <div className="hero-header" style={{ padding: "24px 20px" }}>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div className="flex items-center gap-2 mb-2">
            <Camera size={28} weight="fill" style={{ color: "var(--brand-accent)" }} />
          </div>
          <div className="text-h2 font-display">Trabajos Realizados</div>
          <div className="text-small" style={{ opacity: 0.8, marginTop: 4 }}>
            Galería de nuestros proyectos
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: -20, position: "relative", zIndex: 2 }}>
        {isAdmin && (
          <Button
            variant="accent"
            className="btn-full mb-4"
            onClick={() => setModalAdd(true)}
            icon={<Plus size={20} />}
          >
            Añadir foto al catálogo
          </Button>
        )}

        {fotos.length === 0 ? (
          <EmptyState
            icon="📷"
            title="Sin fotos aún"
            description="Próximamente añadiremos trabajos realizados"
          />
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {fotos.map((foto, i) => (
              <motion.div
                key={foto.id || i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card p-0 overflow-hidden"
              >
                <img
                  src={foto.imagen}
                  alt={foto.titulo}
                  style={{ width: "100%", height: 250, objectFit: "cover" }}
                />
                <div className="p-4">
                  <div className="font-bold text-small mb-1">{foto.titulo}</div>
                  {foto.descripcion && (
                    <div className="text-tiny text-secondary">{foto.descripcion}</div>
                  )}
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2"
                      onClick={() => eliminarFoto(foto.id)}
                      icon={<Trash size={16} />}
                    >
                      Eliminar
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal añadir foto */}
      <Modal isOpen={modalAdd} onClose={() => setModalAdd(false)} title="Añadir Foto">
        <div>
          <Input
            label="Título del trabajo"
            placeholder="Ej: Reforma baño completo"
            value={nuevaFoto.titulo}
            onChange={(e) => setNuevaFoto(prev => ({ ...prev, titulo: e.target.value }))}
          />
          <Textarea
            label="Descripción (opcional)"
            placeholder="Detalles del trabajo realizado"
            value={nuevaFoto.descripcion}
            onChange={(e) => setNuevaFoto(prev => ({ ...prev, descripcion: e.target.value }))}
            rows={3}
          />
          <div className="input-group">
            <label className="input-label">Foto</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImagenChange}
              style={{ display: "none" }}
              id="file-catalogo"
            />
            {!nuevaFoto.imagenPreview ? (
              <Button
                variant="outline"
                className="btn-full"
                onClick={() => document.getElementById('file-catalogo').click()}
                icon={<Camera size={20} />}
              >
                Seleccionar foto
              </Button>
            ) : (
              <div>
                <img src={nuevaFoto.imagenPreview} alt="Preview" style={{ width: "100%", borderRadius: 8, marginBottom: 8 }} />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setNuevaFoto(prev => ({ ...prev, imagen: null, imagenPreview: null }))}
                >
                  Cambiar foto
                </Button>
              </div>
            )}
          </div>
          <Button
            variant="accent"
            className="btn-full mt-4"
            onClick={guardarFoto}
            disabled={!nuevaFoto.titulo || !nuevaFoto.imagen}
          >
            Guardar foto
          </Button>
        </div>
      </Modal>
    </div>
  );
};