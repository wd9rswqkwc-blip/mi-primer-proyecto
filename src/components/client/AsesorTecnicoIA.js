import React, { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Sparkle, Lightning, X } from "@phosphor-icons/react";
import { api } from "../../utils/api";
import { Button } from "../shared/Button";
import { Textarea } from "../shared/Input";
import { Modal } from "../shared/Modal";

export const AsesorTecnicoIA = ({ isOpen, onClose }) => {
  const [pregunta, setPregunta] = useState("");
  const [respuesta, setRespuesta] = useState("");
  const [loading, setLoading] = useState(false);
  const [historial, setHistorial] = useState([]);

  const preguntasRapidas = [
    "¿Qué suelo es mejor para el salón?",
    "¿Cuánto cuesta reformar un baño?",
    "¿Qué pintura usar en la cocina?",
    "¿Cuánto dura una obra de baño?",
  ];

  const consultar = async (preguntaTexto = null) => {
    const texto = preguntaTexto || pregunta;
    if (!texto.trim()) return;

    setLoading(true);
    try {
      const res = await api.post("/asesor-tecnico", { pregunta: texto });
      setRespuesta(res.respuesta);
      setHistorial([...historial, { pregunta: texto, respuesta: res.respuesta }]);
      setPregunta("");
    } catch (e) {
      setRespuesta("Error al consultar. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🧠 Asesor Técnico IA">
      <div>
        {/* Preguntas rápidas */}
        {!respuesta && (
          <div className="mb-4">
            <div className="text-label mb-2" style={{ color: "var(--brand-primary)" }}>PREGUNTAS FRECUENTES</div>
            <div className="space-y-2">
              {preguntasRapidas.map((p, i) => (
                <button
                  key={i}
                  onClick={() => consultar(p)}
                  className="card p-3 w-full text-left card-interactive"
                  style={{ background: "var(--surface-secondary)" }}
                >
                  <div className="text-small font-bold">{p}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input consulta */}
        <Textarea
          label="Tu pregunta"
          placeholder="Ej: ¿Qué tipo de mampara recomiendan?"
          value={pregunta}
          onChange={(e) => setPregunta(e.target.value)}
          rows={3}
        />

        <Button
          variant="accent"
          className="btn-full mb-4"
          onClick={() => consultar()}
          disabled={loading || !pregunta.trim()}
          icon={<Lightning size={20} weight="fill" />}
        >
          {loading ? "Consultando..." : "Consultar Asesor"}
        </Button>

        {/* Respuesta */}
        {respuesta && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card card-dark p-4 mb-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <Brain size={24} weight="fill" style={{ color: "var(--brand-accent)" }} />
              <div className="text-label" style={{ color: "var(--brand-accent)" }}>RESPUESTA</div>
            </div>
            <div className="text-small" style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
              {respuesta}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => setRespuesta("")}
            >
              Nueva consulta
            </Button>
          </motion.div>
        )}

        {/* Historial */}
        {historial.length > 0 && !respuesta && (
          <div>
            <div className="text-label mb-2" style={{ color: "var(--brand-primary)" }}>CONSULTAS ANTERIORES</div>
            <div className="space-y-2" style={{ maxHeight: 200, overflowY: "auto" }}>
              {historial.slice(-5).reverse().map((item, i) => (
                <div key={i} className="card p-3" style={{ background: "var(--surface-secondary)" }}>
                  <div className="text-tiny font-bold mb-1">{item.pregunta}</div>
                  <div className="text-tiny text-secondary">{item.respuesta.substring(0, 100)}...</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
