import React, { useState, useEffect } from "react";
import { Calendar, Plus, Trash, WhatsappLogo, Clock } from "@phosphor-icons/react";
import { api } from "../../utils/api";
import { Button } from "../shared/Button";
import { Input, Textarea } from "../shared/Input";
import { Modal } from "../shared/Modal";
import { Loading, EmptyState } from "../shared/EmptyState";
import { Badge } from "../shared/Badge";
import { formatDate } from "../../utils/api";

export const Agenda = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalNuevo, setModalNuevo] = useState(false);
  const [nuevoEvento, setNuevoEvento] = useState({
    fecha: "",
    hora: "",
    titulo: "",
    cliente: "",
    telefono: "",
    direccion: "",
    notas: ""
  });

  useEffect(() => {
    cargarEventos();
  }, []);

  const cargarEventos = async () => {
    try {
      const data = await api.get("/agenda");
      setEventos(data);
    } catch (e) {
      console.error("Error:", e);
    } finally {
      setLoading(false);
    }
  };

  const guardarEvento = async () => {
    try {
      await api.post("/agenda", nuevoEvento);
      setModalNuevo(false);
      setNuevoEvento({ fecha: "", hora: "", titulo: "", cliente: "", telefono: "", direccion: "", notas: "" });
      cargarEventos();
    } catch (e) {
      console.error("Error:", e);
    }
  };

  const eliminarEvento = async (id) => {
    if (!window.confirm("¿Eliminar evento?")) return;
    try {
      await api.delete(`/agenda/${id}`);
      cargarEventos();
    } catch (e) {
      console.error("Error:", e);
    }
  };

  const enviarWhatsApp = (evento) => {
    const mensaje = `Hola ${evento.cliente}, te recordamos tu cita: ${evento.titulo}\nFecha: ${evento.fecha} a las ${evento.hora}\nDirección: ${evento.direccion}`;
    window.open(`https://wa.me/${evento.telefono.replace(/\s/g, "")}?text=${encodeURIComponent(mensaje)}`, "_blank");
  };

  if (loading) return <Loading />;

  return (
    <div className="pb-24">
      <div className="container pt-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-h2 font-display">Agenda de Obras</h1>
            <p className="text-small text-secondary">Gestiona citas y visitas</p>
          </div>
          <Button variant="accent" onClick={() => setModalNuevo(true)} icon={<Plus size={20} />}>
            Nuevo
          </Button>
        </div>

        {eventos.length === 0 ? (
          <EmptyState
            icon="📅"
            title="Agenda vacía"
            description="No hay eventos programados"
            action={<Button variant="accent" onClick={() => setModalNuevo(true)}>Añadir evento</Button>}
          />
        ) : (
          <div className="space-y-3">
            {eventos.map(evento => (
              <div key={evento.id} className="card p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-bold text-small mb-1">{evento.titulo}</div>
                    <div className="text-tiny text-secondary">{evento.cliente}</div>
                  </div>
                  <Badge variant="accent">
                    {formatDate(evento.fecha)}
                  </Badge>
                </div>
                <div className="space-y-1 mb-3">
                  <div className="flex items-center gap-2 text-tiny">
                    <Clock size={16} />
                    <span>{evento.hora}</span>
                  </div>
                  {evento.direccion && (
                    <div className="text-tiny text-secondary">📍 {evento.direccion}</div>
                  )}
                  {evento.notas && (
                    <div className="text-tiny text-secondary">📝 {evento.notas}</div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => enviarWhatsApp(evento)}
                    icon={<WhatsappLogo size={16} />}
                  >
                    WhatsApp
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => eliminarEvento(evento.id)}
                    icon={<Trash size={16} />}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal nuevo evento */}
      <Modal isOpen={modalNuevo} onClose={() => setModalNuevo(false)} title="Nuevo Evento">
        <div>
          <Input
            label="Título"
            placeholder="Ej: Visita técnica baño"
            value={nuevoEvento.titulo}
            onChange={(e) => setNuevoEvento(prev => ({ ...prev, titulo: e.target.value }))}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Fecha"
              type="date"
              value={nuevoEvento.fecha}
              onChange={(e) => setNuevoEvento(prev => ({ ...prev, fecha: e.target.value }))}
            />
            <Input
              label="Hora"
              type="time"
              value={nuevoEvento.hora}
              onChange={(e) => setNuevoEvento(prev => ({ ...prev, hora: e.target.value }))}
            />
          </div>
          <Input
            label="Cliente"
            placeholder="Nombre del cliente"
            value={nuevoEvento.cliente}
            onChange={(e) => setNuevoEvento(prev => ({ ...prev, cliente: e.target.value }))}
          />
          <Input
            label="Teléfono"
            type="tel"
            placeholder="6XX XXX XXX"
            value={nuevoEvento.telefono}
            onChange={(e) => setNuevoEvento(prev => ({ ...prev, telefono: e.target.value }))}
          />
          <Input
            label="Dirección"
            placeholder="Dirección de la obra"
            value={nuevoEvento.direccion}
            onChange={(e) => setNuevoEvento(prev => ({ ...prev, direccion: e.target.value }))}
          />
          <Textarea
            label="Notas"
            placeholder="Notas adicionales"
            value={nuevoEvento.notas}
            onChange={(e) => setNuevoEvento(prev => ({ ...prev, notas: e.target.value }))}
            rows={2}
          />
          <Button
            variant="accent"
            className="btn-full mt-4"
            onClick={guardarEvento}
            disabled={!nuevoEvento.titulo || !nuevoEvento.fecha}
          >
            Guardar evento
          </Button>
        </div>
      </Modal>
    </div>
  );
};