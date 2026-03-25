import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ChartBar, TrendUp, TrendDown, Calendar, Bell, FileText, 
  Receipt, Money, Warning, CheckCircle, Calculator, Download,
  Brain, Sparkle, Lightning
} from "@phosphor-icons/react";
import { api, formatCurrency, formatDate } from "../../utils/api";
import { Button } from "../shared/Button";
import { Loading, EmptyState } from "../shared/EmptyState";
import { Badge } from "../shared/Badge";
import { Modal } from "../shared/Modal";
import { Input, Textarea } from "../shared/Input";

export const GestoraAutomatica = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [datosGestora, setDatosGestora] = useState(null);
  const [modalIA, setModalIA] = useState(false);
  const [preguntaIA, setPreguntaIA] = useState("");
  const [respuestaIA, setRespuestaIA] = useState("");
  const [loadingIA, setLoadingIA] = useState(false);

  useEffect(() => {
    cargarDatosGestora();
  }, []);

  const cargarDatosGestora = async () => {
    try {
      const datos = await api.get("/gestora/dashboard");
      setDatosGestora(datos);
    } catch (e) {
      console.error("Error cargando gestora:", e);
    } finally {
      setLoading(false);
    }
  };

  const consultarIA = async () => {
    if (!preguntaIA.trim()) return;
    setLoadingIA(true);
    try {
      const res = await api.post("/gestora/consulta-ia", { pregunta: preguntaIA });
      setRespuestaIA(res.respuesta);
    } catch (e) {
      setRespuestaIA("Error al consultar. Intenta de nuevo.");
    } finally {
      setLoadingIA(false);
    }
  };

  const generarInforme = async (tipo) => {
    try {
      const res = await api.post("/gestora/generar-informe", { tipo });
      // Descargar PDF generado
      window.open(res.url, "_blank");
    } catch (e) {
      alert("Error generando informe");
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="pb-24">
      <div className="hero-header" style={{ padding: "24px 20px" }}>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div className="flex items-center gap-2 mb-2">
            <Sparkle size={24} weight="fill" style={{ color: "var(--brand-accent)" }} />
            <Badge variant="accent">IA Automática</Badge>
          </div>
          <div className="text-h2 font-display">Gestora Inteligente</div>
          <div className="text-small" style={{ opacity: 0.8, marginTop: 4 }}>
            Automatiza tu gestión administrativa
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: -20, position: "relative", zIndex: 2 }}>
        {/* Tabs */}
        <div className="tabs mb-4">
          {[
            { id: "dashboard", label: "📊 Panel" },
            { id: "fiscal", label: "💰 Fiscal" },
            { id: "recordatorios", label: "🔔 Alertas" },
            { id: "facturas", label: "📄 Facturas" },
            { id: "informes", label: "📈 Informes" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab ${activeTab === tab.id ? "tab-active" : ""}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Resumen financiero */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="card card-elevated stat-card" style={{ background: "var(--success)", color: "white" }}>
                <div className="stat-value">{formatCurrency(datosGestora?.ingresos_mes || 0)}</div>
                <div className="stat-label" style={{ color: "rgba(255,255,255,0.8)" }}>Ingresos mes</div>
              </div>
              <div className="card card-elevated stat-card" style={{ background: "var(--error)", color: "white" }}>
                <div className="stat-value">{formatCurrency(datosGestora?.gastos_mes || 0)}</div>
                <div className="stat-label" style={{ color: "rgba(255,255,255,0.8)" }}>Gastos mes</div>
              </div>
              <div className="card card-elevated stat-card" style={{ background: "var(--brand-primary)", color: "white" }}>
                <div className="stat-value">{formatCurrency(datosGestora?.beneficio_mes || 0)}</div>
                <div className="stat-label" style={{ color: "rgba(255,255,255,0.8)" }}>Beneficio neto</div>
              </div>
              <div className="card card-elevated stat-card">
                <div className="stat-value" style={{ color: "var(--brand-accent)" }}>
                  {datosGestora?.rentabilidad_mes || 0}%
                </div>
                <div className="stat-label">Rentabilidad</div>
              </div>
            </div>

            {/* Asistente IA */}
            <div className="card card-accent p-5 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <Brain size={28} weight="fill" />
                <div>
                  <div className="font-bold">Asistente Gestor IA</div>
                  <div className="text-tiny" style={{ opacity: 0.8 }}>Pregunta lo que necesites</div>
                </div>
              </div>
              <Button
                variant="primary"
                className="btn-full"
                onClick={() => setModalIA(true)}
                icon={<Lightning size={20} weight="fill" />}
              >
                Consultar Gestor IA
              </Button>
            </div>

            {/* Alertas pendientes */}
            <div className="card p-4 mb-4">
              <div className="font-bold mb-3 flex items-center gap-2">
                <Bell size={20} />
                Alertas Pendientes ({datosGestora?.alertas?.length || 0})
              </div>
              {datosGestora?.alertas?.slice(0, 5).map((alerta, i) => (
                <div key={i} className="list-item">
                  <div className="list-item-icon" style={{ background: alerta.urgente ? "var(--error)" : "var(--warning)" }}>
                    <Warning size={20} style={{ color: "white" }} weight="fill" />
                  </div>
                  <div className="list-item-content">
                    <div className="list-item-title">{alerta.titulo}</div>
                    <div className="list-item-subtitle">{alerta.descripcion}</div>
                  </div>
                  <Badge variant={alerta.urgente ? "error" : "warning"}>
                    {alerta.urgente ? "Urgente" : "Pendiente"}
                  </Badge>
                </div>
              )) || (
                <EmptyState
                  icon="✅"
                  title="Todo al día"
                  description="No hay alertas pendientes"
                />
              )}
            </div>
          </motion.div>
        )}

        {/* Fiscal */}
        {activeTab === "fiscal" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="card p-5 mb-4">
              <div className="font-bold mb-4 flex items-center gap-2">
                <Calculator size={20} />
                Cálculo Trimestral IVA
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-secondary">IVA Repercutido (facturas emitidas)</span>
                  <span className="font-bold">{formatCurrency(datosGestora?.iva_repercutido || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">IVA Soportado (gastos)</span>
                  <span className="font-bold" style={{ color: "var(--success)" }}>-{formatCurrency(datosGestora?.iva_soportado || 0)}</span>
                </div>
                <div className="divider" />
                <div className="flex justify-between text-h3 font-display">
                  <span>A pagar/devolver</span>
                  <span style={{ color: "var(--brand-accent)" }}>
                    {formatCurrency((datosGestora?.iva_repercutido || 0) - (datosGestora?.iva_soportado || 0))}
                  </span>
                </div>
              </div>
              <Button variant="primary" className="btn-full mt-4" onClick={() => generarInforme("iva_trimestral")}>
                <Download size={20} /> Descargar Modelo 303
              </Button>
            </div>

            <div className="card p-5 mb-4">
              <div className="font-bold mb-4 flex items-center gap-2">
                <Receipt size={20} />
                IRPF Estimado
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-secondary">Ingresos anuales</span>
                  <span className="font-bold">{formatCurrency(datosGestora?.ingresos_año || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Gastos deducibles</span>
                  <span className="font-bold" style={{ color: "var(--success)" }}>-{formatCurrency(datosGestora?.gastos_deducibles_año || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Base imponible</span>
                  <span className="font-bold">{formatCurrency((datosGestora?.ingresos_año || 0) - (datosGestora?.gastos_deducibles_año || 0))}</span>
                </div>
                <div className="flex justify-between text-h3 font-display" style={{ marginTop: 12, paddingTop: 12, borderTop: "2px solid var(--border-subtle)" }}>
                  <span>IRPF estimado (20%)</span>
                  <span style={{ color: "var(--brand-accent)" }}>
                    {formatCurrency(((datosGestora?.ingresos_año || 0) - (datosGestora?.gastos_deducibles_año || 0)) * 0.20)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Recordatorios */}
        {activeTab === "recordatorios" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="card">
              {datosGestora?.recordatorios?.map((rec, i) => (
                <div key={i} className="list-item">
                  <div className="list-item-icon">
                    <Calendar size={20} />
                  </div>
                  <div className="list-item-content">
                    <div className="list-item-title">{rec.titulo}</div>
                    <div className="list-item-subtitle">{formatDate(rec.fecha)} • {rec.tipo}</div>
                  </div>
                  <Badge variant={rec.completado ? "success" : "warning"}>
                    {rec.completado ? "✓" : "Pendiente"}
                  </Badge>
                </div>
              )) || (
                <EmptyState
                  icon="📅"
                  title="Sin recordatorios"
                  description="No hay eventos próximos"
                />
              )}
            </div>
          </motion.div>
        )}

        {/* Facturas */}
        {activeTab === "facturas" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button variant="accent" className="btn-full mb-4" icon={<FileText size={20} />}>
              Generar Nueva Factura
            </Button>
            <div className="card">
              {datosGestora?.facturas?.map((fac, i) => (
                <div key={i} className="list-item list-item-interactive">
                  <div className="list-item-content">
                    <div className="list-item-title">{fac.numero}</div>
                    <div className="list-item-subtitle">{fac.cliente} • {formatDate(fac.fecha)}</div>
                  </div>
                  <div className="font-bold">{formatCurrency(fac.total)}</div>
                </div>
              )) || (
                <EmptyState
                  icon="📄"
                  title="Sin facturas"
                  description="Genera facturas desde presupuestos"
                />
              )}
            </div>
          </motion.div>
        )}

        {/* Informes */}
        {activeTab === "informes" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="space-y-3">
              {[
                { tipo: "balance", titulo: "Balance de Situación", desc: "Estado financiero actual" },
                { tipo: "resultados", titulo: "Cuenta de Resultados", desc: "Ingresos y gastos del período" },
                { tipo: "rentabilidad", titulo: "Análisis de Rentabilidad", desc: "Por obra y global" },
                { tipo: "fiscal", titulo: "Resumen Fiscal", desc: "IVA, IRPF, retenciones" },
                { tipo: "tesoreria", titulo: "Flujo de Tesorería", desc: "Previsión de caja" },
              ].map((informe, i) => (
                <div key={i} className="card p-4 card-interactive" onClick={() => generarInforme(informe.tipo)}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-small">{informe.titulo}</div>
                      <div className="text-tiny text-secondary">{informe.desc}</div>
                    </div>
                    <Download size={24} style={{ color: "var(--brand-accent)" }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Modal IA */}
      <Modal
        isOpen={modalIA}
        onClose={() => {
          setModalIA(false);
          setPreguntaIA("");
          setRespuestaIA("");
        }}
        title="🤖 Gestor IA"
      >
        <div>
          <Textarea
            label="Pregunta al gestor"
            placeholder="Ej: ¿Cuánto debo declarar este trimestre de IVA?"
            value={preguntaIA}
            onChange={(e) => setPreguntaIA(e.target.value)}
            rows={3}
          />
          <Button
            variant="accent"
            className="btn-full mb-4"
            onClick={consultarIA}
            disabled={loadingIA || !preguntaIA.trim()}
          >
            {loadingIA ? "Consultando..." : "Consultar"}
          </Button>

          {respuestaIA && (
            <div className="card p-4" style={{ background: "var(--surface-secondary)" }}>
              <div className="text-label mb-2" style={{ color: "var(--brand-primary)" }}>RESPUESTA</div>
              <div className="text-small" style={{ whiteSpace: "pre-wrap" }}>{respuestaIA}</div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
