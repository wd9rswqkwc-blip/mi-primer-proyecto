import React, { useState } from "react";
import { motion } from "framer-motion";
import { MagnifyingGlass, ArrowRight, ArrowLeft } from "@phosphor-icons/react";
import { Button } from "../shared/Button";
import { Input, Textarea, Select } from "../shared/Input";
import { Chip } from "../shared/Badge";

const tiposTrabajo = [
  { id: "bano", emoji: "🚿", nombre: "Baño completo" },
  { id: "cocina", emoji: "🍳", nombre: "Cocina" },
  { id: "suelo", emoji: "🏠", nombre: "Suelo/Parquet" },
  { id: "pintura", emoji: "🎨", nombre: "Pintura" },
  { id: "puertas", emoji: "🚪", nombre: "Puertas" },
  { id: "ventanas", emoji: "🪟", nombre: "Ventanas" },
];

export const Diagnostico = ({ onNavigate }) => {
  const [paso, setPaso] = useState(1);
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null);
  const [datos, setDatos] = useState({
    nombre: "",
    telefono: "",
    metros: "",
    estado: [],
    acceso: []
  });

  const factoresEstado = [
    { id: "humedad", label: "Problemas de humedad", impacto: 1.15 },
    { id: "moho", label: "Moho visible", impacto: 1.20 },
    { id: "mal_estado", label: "Muy mal estado", impacto: 1.25 },
    { id: "nuevo", label: "Estado aceptable", impacto: 0.95 },
  ];

  const factoresAcceso = [
    { id: "piso_alto", label: "Piso alto sin ascensor", impacto: 1.10 },
    { id: "calle_estrecha", label: "Calle estrecha/peatonal", impacto: 1.05 },
    { id: "sin_parking", label: "Sin aparcamiento cercano", impacto: 1.08 },
  ];

  const toggleFactor = (tipo, id) => {
    setDatos(prev => ({
      ...prev,
      [tipo]: prev[tipo].includes(id)
        ? prev[tipo].filter(f => f !== id)
        : [...prev[tipo], id]
    }));
  };

  const calcularPresupuestoEstimado = () => {
    const preciosBase = {
      bano: 4500,
      cocina: 6000,
      suelo: 35,
      pintura: 25,
      puertas: 200,
      ventanas: 350
    };

    let base = preciosBase[tipoSeleccionado] || 1000;
    if (datos.metros) {
      base *= parseFloat(datos.metros);
    }

    let multiplicador = 1;
    [...datos.estado, ...datos.acceso].forEach(factorId => {
      const factor = [...factoresEstado, ...factoresAcceso].find(f => f.id === factorId);
      if (factor) multiplicador *= factor.impacto;
    });

    return Math.round(base * multiplicador);
  };

  return (
    <div className="pb-24">
      <div className="hero-header" style={{ padding: "24px 20px" }}>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div className="flex items-center gap-2 mb-2">
            <MagnifyingGlass size={28} weight="fill" style={{ color: "var(--brand-accent)" }} />
          </div>
          <div className="text-h2 font-display">Diagnóstico Inteligente</div>
          <div className="text-small" style={{ opacity: 0.8, marginTop: 4 }}>
            Obtén un presupuesto preciso en 3 pasos
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: -20, position: "relative", zIndex: 2 }}>
        {/* Paso 1: Tipo de trabajo */}
        {paso === 1 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="card p-5 mb-4">
              <div className="text-label mb-3" style={{ color: "var(--brand-primary)" }}>PASO 1 DE 3</div>
              <h3 className="text-h3 font-display mb-4">¿Qué tipo de trabajo necesitas?</h3>
              <div className="grid grid-cols-2 gap-3">
                {tiposTrabajo.map(tipo => (
                  <button
                    key={tipo.id}
                    onClick={() => setTipoSeleccionado(tipo.id)}
                    className={`card p-4 card-interactive ${tipoSeleccionado === tipo.id ? 'card-selected' : ''}`}
                    style={{ textAlign: "center" }}
                  >
                    <div style={{ fontSize: "2rem", marginBottom: 8 }}>{tipo.emoji}</div>
                    <div className="font-bold text-small">{tipo.nombre}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="card p-5 mb-4">
              <Input
                label="Tu nombre"
                placeholder="Ej: Juan García"
                value={datos.nombre}
                onChange={(e) => setDatos({ ...datos, nombre: e.target.value })}
              />
              <Input
                label="Teléfono"
                type="tel"
                placeholder="6XX XXX XXX"
                value={datos.telefono}
                onChange={(e) => setDatos({ ...datos, telefono: e.target.value })}
              />
            </div>

            <Button
              variant="accent"
              className="btn-full"
              onClick={() => setPaso(2)}
              disabled={!tipoSeleccionado || !datos.nombre || !datos.telefono}
              icon={<ArrowRight size={20} />}
            >
              Continuar → Describir estado
            </Button>
          </motion.div>
        )}

        {/* Paso 2: Estado y medidas */}
        {paso === 2 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="card p-5 mb-4">
              <div className="text-label mb-3" style={{ color: "var(--brand-primary)" }}>PASO 2 DE 3</div>
              <h3 className="text-h3 font-display mb-4">Estado actual del espacio</h3>
              
              <Input
                label="Metros cuadrados"
                type="number"
                placeholder="Ej: 15"
                value={datos.metros}
                onChange={(e) => setDatos({ ...datos, metros: e.target.value })}
              />

              <div className="mt-4">
                <div className="text-label mb-2">ESTADO DEL ÁREA</div>
                <div className="space-y-2">
                  {factoresEstado.map(factor => (
                    <Chip
                      key={factor.id}
                      active={datos.estado.includes(factor.id)}
                      onClick={() => toggleFactor('estado', factor.id)}
                    >
                      {factor.label} {factor.impacto !== 1 && `(${factor.impacto > 1 ? '+' : ''}${Math.round((factor.impacto - 1) * 100)}%)`}
                    </Chip>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <div className="text-label mb-2">CONDICIONES DE ACCESO</div>
                <div className="space-y-2">
                  {factoresAcceso.map(factor => (
                    <Chip
                      key={factor.id}
                      active={datos.acceso.includes(factor.id)}
                      onClick={() => toggleFactor('acceso', factor.id)}
                    >
                      {factor.label} (+{Math.round((factor.impacto - 1) * 100)}%)
                    </Chip>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setPaso(1)}
                icon={<ArrowLeft size={20} />}
              >
                Volver
              </Button>
              <Button
                variant="accent"
                className="flex-1"
                onClick={() => setPaso(3)}
                icon={<ArrowRight size={20} />}
              >
                Ver diagnóstico
              </Button>
            </div>
          </motion.div>
        )}

        {/* Paso 3: Resultado */}
        {paso === 3 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="card card-accent p-6 mb-4 text-center">
              <div className="text-label mb-2" style={{ color: "var(--brand-accent)" }}>PRESUPUESTO ESTIMADO</div>
              <div className="text-hero font-display" style={{ color: "var(--brand-accent)" }}>
                {calcularPresupuestoEstimado().toLocaleString()}€
              </div>
              <div className="text-tiny" style={{ opacity: 0.7, marginTop: 8 }}>
                *Precio aproximado, sujeto a valoración final
              </div>
            </div>

            <div className="card p-5 mb-4">
              <div className="text-label mb-3">RESUMEN DEL DIAGNÓSTICO</div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-secondary">Tipo de trabajo:</span>
                  <span className="font-bold">{tiposTrabajo.find(t => t.id === tipoSeleccionado)?.nombre}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Superficie:</span>
                  <span className="font-bold">{datos.metros} m²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Factores aplicados:</span>
                  <span className="font-bold">{datos.estado.length + datos.acceso.length}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                variant="accent"
                className="btn-full"
                onClick={() => onNavigate('presupuesto')}
              >
                Solicitar presupuesto detallado
              </Button>
              <Button
                variant="outline"
                className="btn-full"
                onClick={() => setPaso(1)}
              >
                Hacer otro diagnóstico
              </Button>
              <Button
                variant="ghost"
                className="btn-full"
                onClick={() => onNavigate('portada')}
              >
                Volver al inicio
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};