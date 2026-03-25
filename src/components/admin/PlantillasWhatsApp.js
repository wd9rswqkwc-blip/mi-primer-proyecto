import React, { useState } from "react";
import { WhatsappLogo, Plus, Copy } from "@phosphor-icons/react";
import { Button } from "../shared/Button";
import { Input, Textarea } from "../shared/Input";
import { Modal } from "../shared/Modal";
import { Badge } from "../shared/Badge";

export const PlantillasWhatsApp = () => {
  const [plantillas, setPlantillas] = useState([
    { id: 1, nombre: "Confirmación cita", texto: "Hola {cliente}, confirmamos tu cita para el {fecha} a las {hora}. ¡Te esperamos!" },
    { id: 2, nombre: "Presupuesto enviado", texto: "Hola {cliente}, te hemos enviado el presupuesto nº {numero}. Total: {total}€. ¿Tienes dudas?" },
    { id: 3, nombre: "Recordatorio pago", texto: "Hola {cliente}, te recordamos el pago pendiente de {total}€ del presupuesto {numero}." },
    { id: 4, nombre: "Obra finalizada", texto: "Hola {cliente}, hemos finalizado la obra. ¡Esperamos que estés satisfecho! Valoración: {link}" },
  ]);
  const [modalAdd, setModalAdd] = useState(false);
  const [nueva, setNueva] = useState({ nombre: "", texto: "" });

  const copiarPlantilla = (texto) => {
    navigator.clipboard.writeText(texto);
    alert("Plantilla copiada");
  };

  return (
    <div className="pb-24">
      <div className="container pt-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-h2 font-display">Mensajes WhatsApp</h1>
          <Button variant="accent" onClick={() => setModalAdd(true)} icon={<Plus size={20} />}>Nueva</Button>
        </div>

        <div className="card p-4 mb-4" style={{ background: "#25D366", color: "white" }}>
          <div className="text-small font-bold mb-2">💡 Variables disponibles</div>
          <div className="text-tiny">Use {"{cliente}"}, {"{fecha}"}, {"{hora}"}, {"{numero}"}, {"{total}"}, {"{link}"} en sus plantillas</div>
        </div>

        <div className="space-y-3">
          {plantillas.map(p => (
            <div key={p.id} className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="font-bold text-small">{p.nombre}</div>
                <Badge variant="success"><WhatsappLogo size={14} /> WhatsApp</Badge>
              </div>
              <div className="text-small text-secondary mb-3" style={{ whiteSpace: "pre-wrap" }}>{p.texto}</div>
              <Button variant="outline" size="sm" onClick={() => copiarPlantilla(p.texto)} icon={<Copy size={16} />}>Copiar plantilla</Button>
            </div>
          ))}
        </div>
      </div>

      <Modal isOpen={modalAdd} onClose={() => setModalAdd(false)} title="Nueva Plantilla WhatsApp">
        <div>
          <Input label="Nombre" placeholder="Ej: Recordatorio visita" value={nueva.nombre} onChange={(e) => setNueva({ ...nueva, nombre: e.target.value })} />
          <Textarea label="Texto" placeholder="Usa {cliente}, {fecha}, {total}..." value={nueva.texto} onChange={(e) => setNueva({ ...nueva, texto: e.target.value })} rows={5} />
          <Button variant="accent" className="btn-full mt-4" onClick={() => { setPlantillas([...plantillas, { ...nueva, id: Date.now() }]); setModalAdd(false); setNueva({ nombre: "", texto: "" }); }}>Guardar</Button>
        </div>
      </Modal>
    </div>
  );
};