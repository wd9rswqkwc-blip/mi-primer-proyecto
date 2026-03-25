import React, { useState, useEffect, useCallback, createContext, useContext, useRef } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  House, Wrench, Calculator, Clock, Users, Receipt, 
  CaretRight, CaretLeft, Check, X, Plus, Minus,
  WhatsappLogo, Phone, Envelope, MapPin, Calendar,
  MagnifyingGlass, Funnel, DotsThree, Trash, PencilSimple,
  Camera, Signature, Download, Share, QrCode,
  Gear, Lock, Bell, ChartBar, Money, Package,
  FileText, Warning, CheckCircle, Info, Star, Brain, Sparkle
} from "@phosphor-icons/react";
import SignatureCanvas from "react-signature-canvas";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./App.css";

// Nuevos componentes modulares
import { TarjetaDigital } from "./components/client/TarjetaDigital";
import { AsesorTecnicoIA } from "./components/client/AsesorTecnicoIA";
import { Diagnostico } from "./components/client/Diagnostico";
import { Catalogo } from "./components/client/Catalogo";
import { GestoraAutomatica } from "./components/admin/GestoraAutomatica";
import { Plantillas } from "./components/admin/Plantillas";
import { Agenda } from "./components/admin/Agenda";
import { MaterialesCustom } from "./components/admin/MaterialesCustom";
import { TrabajosCustom } from "./components/admin/TrabajosCustom";
import { Proveedores } from "./components/admin/Proveedores";
import { Facturas } from "./components/admin/Facturas";
import { Garantias } from "./components/admin/Garantias";
import { CRMClientes } from "./components/admin/CRMClientes";
import { MenuAdmin } from "./components/admin/MenuAdmin";
import { Factores } from "./components/admin/Factores";
import { PlantillasWhatsApp } from "./components/admin/PlantillasWhatsApp";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "";
const API = `${BACKEND_URL}/api`;

// ==========================================
// CONTEXT & HELPERS
// ==========================================

const AppContext = createContext();
const useApp = () => useContext(AppContext);

const api = {
  get: async (url) => {
    const res = await fetch(`${API}${url}`);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  post: async (url, data, token = null) => {
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch(`${API}${url}`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  put: async (url, data, token = null) => {
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch(`${API}${url}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  delete: async (url, token = null) => {
    const headers = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch(`${API}${url}`, { method: "DELETE", headers });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value || 0);
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
};

// ==========================================
// COMPONENTES COMUNES
// ==========================================

const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle size={20} weight="fill" />,
    error: <Warning size={20} weight="fill" />,
    info: <Info size={20} weight="fill" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className={`toast toast-${type}`}
      data-testid="toast"
    >
      {icons[type]}
      <span>{message}</span>
    </motion.div>
  );
};

const Modal = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="modal-backdrop"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-handle" />
          {title && (
            <div className="modal-header">
              <h3 className="text-h3">{title}</h3>
              <button onClick={onClose} className="btn-icon-sm btn-ghost">
                <X size={20} />
              </button>
            </div>
          )}
          <div className="modal-body">{children}</div>
          {footer && <div className="modal-footer">{footer}</div>}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const Button = ({ children, variant = "primary", size = "", className = "", icon, ...props }) => {
  return (
    <button
      className={`btn btn-${variant} ${size ? `btn-${size}` : ""} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
};

const Input = ({ label, error, ...props }) => (
  <div className="input-group">
    {label && <label className="input-label">{label}</label>}
    <input className={`input ${error ? "input-error" : ""}`} {...props} />
    {error && <span className="text-tiny" style={{ color: "var(--error)" }}>{error}</span>}
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div className="input-group">
    {label && <label className="input-label">{label}</label>}
    <textarea className="input textarea" {...props} />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div className="input-group">
    {label && <label className="input-label">{label}</label>}
    <select className="input select" {...props}>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

const Badge = ({ children, variant = "primary" }) => (
  <span className={`badge badge-${variant}`}>{children}</span>
);

const Chip = ({ children, active, onClick }) => (
  <button
    className={`chip chip-interactive ${active ? "chip-active" : ""}`}
    onClick={onClick}
  >
    {children}
  </button>
);

const EmptyState = ({ icon, title, description, action }) => (
  <div className="empty-state">
    <div className="empty-state-icon">{icon}</div>
    <div className="empty-state-title">{title}</div>
    <div className="empty-state-description">{description}</div>
    {action && <div style={{ marginTop: 16 }}>{action}</div>}
  </div>
);

const Loading = () => (
  <div className="empty-state">
    <div className="animate-spin" style={{ fontSize: "2rem" }}>⏳</div>
    <div className="empty-state-title">Cargando...</div>
  </div>
);

// ==========================================
// HERO HEADER
// ==========================================

const HeroHeader = ({ empresa }) => (
  <div className="hero-header" data-testid="hero-header">
    <div style={{ position: "relative", zIndex: 1 }}>
      <div className="flex items-center gap-2 mb-3">
        <Badge variant="accent">
          <span className="animate-pulse" style={{ width: 6, height: 6, background: "#4ade80", borderRadius: "50%", display: "inline-block" }} />
          Disponible
        </Badge>
        <span className="text-tiny" style={{ opacity: 0.7 }}>{empresa?.direccion || "Lleida"}</span>
      </div>
      
      <h1 className="text-hero font-display" style={{ marginBottom: 8 }}>
        {empresa?.nombre?.split(" ")[0] || "Andy"}{" "}
        <span style={{ color: "var(--brand-accent)" }}>{empresa?.nombre?.split(" ")[1] || "Gonzaga"}</span>
      </h1>
      
      <p className="text-small" style={{ opacity: 0.8, marginBottom: 16 }}>
        {empresa?.slogan || "Instalaciones y Reformas"}
      </p>
      
      <div className="flex gap-2 flex-wrap">
        <Badge variant="outline">⭐ +10 años experiencia</Badge>
        <Badge variant="outline">📋 Presupuesto 24h</Badge>
        <Badge variant="outline">✅ Garantía escrita</Badge>
      </div>
    </div>
  </div>
);

// ==========================================
// NAVEGACIÓN INFERIOR
// ==========================================

const BottomNav = ({ activeTab, onNavigate, isAdmin }) => {
  const clientTabs = [
    { id: "portada", icon: <House size={22} weight={activeTab === "portada" ? "fill" : "regular"} />, label: "Inicio" },
    { id: "diagnostico", icon: <MagnifyingGlass size={22} weight={activeTab === "diagnostico" ? "fill" : "regular"} />, label: "Diagnóstico" },
    { id: "presupuesto", icon: <Calculator size={22} weight={activeTab === "presupuesto" ? "fill" : "regular"} />, label: "Presupuesto" },
    { id: "precios", icon: <Money size={22} weight={activeTab === "precios" ? "fill" : "regular"} />, label: "Precios" },
    { id: "catalogo", icon: <Camera size={22} weight={activeTab === "catalogo" ? "fill" : "regular"} />, label: "Catálogo" },
  ];

  const adminTabs = [
    { id: "dashboard", icon: <ChartBar size={22} weight={activeTab === "dashboard" ? "fill" : "regular"} />, label: "Panel" },
    { id: "gestora", icon: <Sparkle size={22} weight={activeTab === "gestora" ? "fill" : "regular"} />, label: "Gestora" },
    { id: "admin", icon: <Gear size={22} weight={activeTab === "admin" ? "fill" : "regular"} />, label: "M\u00e1s" },
    { id: "presupuesto", icon: <Plus size={22} weight="bold" />, label: "Nuevo" },
    { id: "historial", icon: <FileText size={22} weight={activeTab === "historial" ? "fill" : "regular"} />, label: "Historial" },
  ];

  const tabs = isAdmin ? adminTabs : clientTabs;

  return (
    <nav className="bottom-nav" data-testid="bottom-nav">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onNavigate(tab.id)}
          className={`nav-item ${activeTab === tab.id ? "nav-item-active" : ""}`}
          data-testid={`nav-${tab.id}`}
        >
          <span className="nav-item-icon">{tab.icon}</span>
          <span className="nav-item-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};

// ==========================================
// PORTADA (LANDING)
// ==========================================

const Portada = ({ empresa, onNavigate, onAbrirAsesor }) => {
  const servicios = [
    { icon: "🏠", nombre: "Instalación de parquet", desc: "Madera, vinilo y todo tipo de suelos" },
    { icon: "🚪", nombre: "Montaje de puertas", desc: "Abatibles y correderas" },
    { icon: "🪟", nombre: "Ventanas y persianas", desc: "Instalación completa" },
    { icon: "🍳", nombre: "Muebles de cocina", desc: "Montaje y módulos" },
    { icon: "🚿", nombre: "Mamparas de baño", desc: "Instalación profesional" },
    { icon: "🎨", nombre: "Pintura", desc: "Pisos y habitaciones" },
  ];

  return (
    <div className="pb-24" data-testid="portada-screen">
      <HeroHeader empresa={empresa} />
      
      <div className="container" style={{ marginTop: -20, position: "relative", zIndex: 2 }}>
        {/* Beneficios */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { icon: "📋", title: "Presupuesto gratis", desc: "Sin compromiso" },
            { icon: "🏆", title: "Calidad garantizada", desc: "Por escrito" },
            { icon: "💬", title: "Asesor técnico", desc: "Te aconsejamos" },
            { icon: "🛡️", title: "Precio cerrado", desc: "Sin sorpresas" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card card-elevated p-4"
            >
              <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>{item.icon}</div>
              <div className="font-bold text-small">{item.title}</div>
              <div className="text-tiny text-secondary">{item.desc}</div>
            </motion.div>
          ))}
        </div>

        {/* CTAs principales */}
        <div className="space-y-3 mb-8">
          <Button 
            variant="accent" 
            className="btn-full btn-lg"
            onClick={() => onNavigate("presupuesto")}
            data-testid="btn-nuevo-presupuesto"
          >
            🆕 Solicitar presupuesto gratis
          </Button>
          <Button 
            variant="primary" 
            className="btn-full"
            onClick={() => onAbrirAsesor()}
            icon={<Brain size={20} weight="fill" />}
          >
            🧠 Consultar Asesor Técnico IA
          </Button>
          <Button 
            variant="outline" 
            className="btn-full"
            onClick={() => onNavigate("diagnostico")}
          >
            🔍 Diagnóstico rápido de tu obra
          </Button>
          <Button 
            variant="outline" 
            className="btn-full"
            onClick={() => onNavigate("precios")}
          >
            💰 Ver lista de precios
          </Button>
          <Button 
            variant="ghost" 
            className="btn-full"
            onClick={() => onNavigate("tarjeta-digital")}
            icon={<QrCode size={20} />}
          >
            📱 Ver tarjeta digital
          </Button>
        </div>

        {/* Servicios */}
        <div className="section">
          <h2 className="section-title">
            <Wrench size={20} />
            Servicios profesionales
          </h2>
          <div className="card">
            {servicios.map((s, i) => (
              <div key={i} className="list-item">
                <div className="list-item-icon">{s.icon}</div>
                <div className="list-item-content">
                  <div className="list-item-title">{s.nombre}</div>
                  <div className="list-item-subtitle">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contacto */}
        <div className="card card-dark p-5 text-center">
          <p className="text-tiny" style={{ opacity: 0.7, marginBottom: 8 }}>¿Prefieres llamar?</p>
          <a 
            href={`tel:${empresa?.telefono}`} 
            className="text-h2 font-display block mb-2"
            style={{ color: "var(--brand-accent)" }}
          >
            {empresa?.telefono || "6XX XXX XXX"}
          </a>
          <p className="text-tiny" style={{ opacity: 0.5 }}>
            {empresa?.email || "info@andygonzaga.com"}
          </p>
          <p className="text-tiny" style={{ opacity: 0.5, marginTop: 4 }}>
            📅 Disponibilidad: Sábados y Domingos
          </p>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// LISTA DE PRECIOS
// ==========================================

const ListaPrecios = ({ trabajos, modulos, isAdmin, onEdit }) => {
  const [moduloActivo, setModuloActivo] = useState(modulos[0]?.id || "suelos");
  const [busqueda, setBusqueda] = useState("");

  const trabajosFiltrados = trabajos.filter((t) => {
    const matchModulo = t.modulo === moduloActivo;
    const matchBusqueda = !busqueda || t.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return matchModulo && matchBusqueda;
  });

  return (
    <div className="pb-24" data-testid="precios-screen">
      <div className="container pt-4">
        <h1 className="text-h2 font-display mb-4">
          <Money size={28} style={{ display: "inline", marginRight: 8 }} />
          Consulta de Precios
        </h1>

        {/* Búsqueda */}
        <div className="relative mb-4">
          <MagnifyingGlass 
            size={20} 
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "var(--text-light)" }}
          />
          <input
            type="text"
            placeholder="Buscar trabajo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="input"
            style={{ paddingLeft: 44 }}
          />
        </div>

        {/* Tabs módulos */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
          {modulos.map((mod) => (
            <Chip
              key={mod.id}
              active={moduloActivo === mod.id}
              onClick={() => setModuloActivo(mod.id)}
            >
              {mod.icono} {mod.nombre}
            </Chip>
          ))}
        </div>

        {/* Lista */}
        <div className="card">
          {trabajosFiltrados.length === 0 ? (
            <EmptyState
              icon="🔍"
              title="Sin resultados"
              description="No hay trabajos que coincidan"
            />
          ) : (
            trabajosFiltrados.map((trabajo) => (
              <div 
                key={trabajo.id} 
                className={`list-item ${isAdmin ? "list-item-interactive" : ""}`}
                onClick={() => isAdmin && onEdit && onEdit(trabajo)}
              >
                <div className="list-item-content">
                  <div className="list-item-title">{trabajo.nombre}</div>
                  <div className="list-item-subtitle">{trabajo.unidad}</div>
                </div>
                <div className="flex gap-2">
                  <span className="price-tag price-eco">{trabajo.precio_eco}€</span>
                  <span className="price-tag price-std">{trabajo.precio_std}€</span>
                  <span className="price-tag price-prem">{trabajo.precio_prem}€</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// CREAR PRESUPUESTO (4 PASOS)
// ==========================================

const CrearPresupuesto = ({ trabajos, modulos, factores, plantillas, empresa, onCrear, onBack }) => {
  const [paso, setPaso] = useState(1);
  const [cliente, setCliente] = useState({ nombre: "", telefono: "", email: "", direccion: "" });
  const [calidad, setCalidad] = useState("std");
  const [tipoPresupuesto, setTipoPresupuesto] = useState("mo");
  const [lineas, setLineas] = useState([]);
  const [factoresSeleccionados, setFactoresSeleccionados] = useState([]);
  const [descuento, setDescuento] = useState(0);
  const [incluyeIva, setIncluyeIva] = useState(true);
  const [descripcion, setDescripcion] = useState("");
  const [moduloActivo, setModuloActivo] = useState(modulos[0]?.id || "suelos");
  const [modalTrabajo, setModalTrabajo] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [totales, setTotales] = useState({});
  const [firma, setFirma] = useState(null);
  const [fotoEstado, setFotoEstado] = useState(null);
  const sigCanvas = useRef(null);

  // Calcular totales
  useEffect(() => {
    const calcular = async () => {
      if (lineas.length === 0) {
        setTotales({});
        return;
      }
      try {
        const res = await api.post("/calcular-presupuesto", {
          lineas,
          factores_aplicados: factoresSeleccionados.map((f) => ({
            factor_id: f.id,
            nombre: f.nombre,
            multiplicador: f.multiplicador,
            tipo: f.tipo || "multiplicador",
            valor: f.valor_fijo || 0,
          })),
          descuento_porcentaje: descuento,
          incluye_iva: incluyeIva,
        });
        setTotales(res);
      } catch (e) {
        console.error(e);
      }
    };
    calcular();
  }, [lineas, factoresSeleccionados, descuento, incluyeIva]);

  const agregarLinea = () => {
    if (!modalTrabajo || cantidad <= 0) return;
    const precioKey = `precio_${calidad}`;
    const precioUnitario = modalTrabajo[precioKey];
    const nuevaLinea = {
      trabajo_id: modalTrabajo.id,
      trabajo_nombre: modalTrabajo.nombre,
      cantidad,
      unidad: modalTrabajo.unidad,
      precio_unitario: precioUnitario,
      subtotal: precioUnitario * cantidad,
      calidad,
      incluye_material: tipoPresupuesto === "mo_material",
      precio_material: 0,
      tiempo_estimado: (modalTrabajo.tiempo_base_horas || 0.5) * cantidad,
    };
    setLineas([...lineas, nuevaLinea]);
    setModalTrabajo(null);
    setCantidad(1);
  };

  const eliminarLinea = (index) => {
    setLineas(lineas.filter((_, i) => i !== index));
  };

  const toggleFactor = (factor) => {
    const exists = factoresSeleccionados.find((f) => f.id === factor.id);
    if (exists) {
      setFactoresSeleccionados(factoresSeleccionados.filter((f) => f.id !== factor.id));
    } else {
      setFactoresSeleccionados([...factoresSeleccionados, factor]);
    }
  };

  const aplicarPlantilla = (plantilla) => {
    const nuevasLineas = plantilla.items.map((item) => {
      const trabajo = trabajos.find((t) => t.nombre === item.trabajo_nombre);
      if (!trabajo) return null;
      const precioKey = `precio_${calidad}`;
      return {
        trabajo_id: trabajo.id,
        trabajo_nombre: trabajo.nombre,
        cantidad: item.cantidad_default,
        unidad: trabajo.unidad,
        precio_unitario: trabajo[precioKey],
        subtotal: trabajo[precioKey] * item.cantidad_default,
        calidad,
        incluye_material: tipoPresupuesto === "mo_material",
        precio_material: 0,
        tiempo_estimado: (trabajo.tiempo_base_horas || 0.5) * item.cantidad_default,
      };
    }).filter(Boolean);
    setLineas([...lineas, ...nuevasLineas]);
  };

  const guardarPresupuesto = async () => {
    try {
      let firmaData = null;
      if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
        firmaData = sigCanvas.current.toDataURL();
      }

      const data = {
        cliente_nombre: cliente.nombre,
        cliente_telefono: cliente.telefono,
        cliente_email: cliente.email,
        cliente_direccion: cliente.direccion,
        calidad,
        tipo_presupuesto: tipoPresupuesto,
        lineas,
        factores_aplicados: factoresSeleccionados.map((f) => ({
          factor_id: f.id,
          nombre: f.nombre,
          multiplicador: f.multiplicador,
          tipo: f.tipo || "multiplicador",
          valor: f.valor_fijo || 0,
        })),
        descuento_porcentaje: descuento,
        incluye_iva: incluyeIva,
        descripcion_cliente: descripcion,
        firma_cliente: firmaData,
        foto_estado_inicial: fotoEstado,
      };
      
      const res = await api.post("/presupuestos", data);
      onCrear(res);
    } catch (e) {
      console.error(e);
      alert("Error al guardar");
    }
  };

  const trabajosFiltrados = trabajos.filter((t) => t.modulo === moduloActivo);

  const factoresPorCategoria = {
    acceso: factores.filter((f) => f.categoria === "acceso"),
    ubicacion: factores.filter((f) => f.categoria === "ubicacion"),
    urgencia: factores.filter((f) => f.categoria === "urgencia"),
    estado: factores.filter((f) => f.categoria?.startsWith("estado")),
  };

  return (
    <div className="pb-24" data-testid="presupuesto-screen">
      <div className="container pt-4">
        {/* Progress */}
        <div className="progress-bar mb-6">
          {[1, 2, 3, 4].map((p) => (
            <div 
              key={p} 
              className={`progress-step ${paso >= p ? "progress-step-active" : ""}`}
            />
          ))}
        </div>

        {/* PASO 1: Cliente y Calidad */}
        {paso === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-h2 font-display mb-4">
              <Badge variant="primary">1</Badge> Cliente y calidad
            </h2>

            <div className="card p-4 mb-4">
              <Input
                label="Nombre / Empresa"
                placeholder="Nombre del cliente"
                value={cliente.nombre}
                onChange={(e) => setCliente({ ...cliente, nombre: e.target.value })}
              />
              <Input
                label="Teléfono"
                type="tel"
                placeholder="6XX XXX XXX"
                value={cliente.telefono}
                onChange={(e) => setCliente({ ...cliente, telefono: e.target.value })}
              />
              <Input
                label="Email (opcional)"
                type="email"
                placeholder="email@ejemplo.com"
                value={cliente.email}
                onChange={(e) => setCliente({ ...cliente, email: e.target.value })}
              />
              <Input
                label="Dirección de la obra"
                placeholder="Calle, número, población"
                value={cliente.direccion}
                onChange={(e) => setCliente({ ...cliente, direccion: e.target.value })}
              />

              <label className="input-label mt-4">Calidad del trabajo</label>
              <div className="quality-selector">
                {[
                  { id: "eco", label: "💚 ECO", desc: "Económico" },
                  { id: "std", label: "🔵 STD", desc: "Recomendado" },
                  { id: "prem", label: "🟠 PREMIUM", desc: "Alta gama" },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCalidad(c.id)}
                    className={`quality-option quality-option-${c.id} ${calidad === c.id ? "quality-option-active" : ""}`}
                  >
                    <div className="font-bold text-small">{c.label}</div>
                    <div className="text-tiny text-secondary">{c.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Factores de acceso */}
            <div className="card card-dark p-4 mb-4">
              <h3 className="font-bold mb-3" style={{ color: "var(--brand-accent)" }}>
                📍 Condiciones de acceso
              </h3>
              <div className="space-y-2">
                {factoresPorCategoria.acceso.slice(0, 6).map((factor) => {
                  const isSelected = factoresSeleccionados.find((f) => f.id === factor.id);
                  const isAumento = factor.multiplicador > 1;
                  return (
                    <div
                      key={factor.id}
                      onClick={() => toggleFactor(factor)}
                      className={`factor-card ${isSelected ? "factor-card-selected" : ""}`}
                    >
                      <div className={`factor-checkbox ${isSelected ? "factor-checkbox-checked" : ""}`}>
                        {isSelected && <Check size={14} weight="bold" style={{ color: "var(--brand-primary)" }} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div className="font-bold text-small">{factor.icono} {factor.nombre}</div>
                        <div className="text-tiny" style={{ opacity: 0.7 }}>{factor.descripcion}</div>
                      </div>
                      <span className={`factor-percentage ${isAumento ? "factor-increase" : "factor-decrease"}`}>
                        {isAumento ? "+" : ""}{((factor.multiplicador - 1) * 100).toFixed(0)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <Button
              variant="accent"
              className="btn-full"
              onClick={() => setPaso(2)}
              disabled={!cliente.nombre}
              data-testid="btn-continuar-paso2"
            >
              Continuar → Elegir trabajos
            </Button>
          </motion.div>
        )}

        {/* PASO 2: Trabajos */}
        {paso === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-h2 font-display mb-4">
              <Badge variant="primary">2</Badge> Trabajos del presupuesto
            </h2>

            {/* Plantillas rápidas */}
            <div className="mb-4">
              <label className="input-label">Plantillas rápidas</label>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {plantillas.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => aplicarPlantilla(p)}
                    className="card p-3 flex-shrink-0"
                    style={{ minWidth: 120 }}
                  >
                    <div style={{ fontSize: "1.5rem", marginBottom: 4 }}>{p.icono}</div>
                    <div className="font-bold text-tiny">{p.nombre}</div>
                    <div className="text-tiny text-secondary">{p.descripcion}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tabs módulos */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-3 scrollbar-hide">
              {modulos.map((mod) => (
                <Chip
                  key={mod.id}
                  active={moduloActivo === mod.id}
                  onClick={() => setModuloActivo(mod.id)}
                >
                  {mod.icono} {mod.nombre}
                </Chip>
              ))}
            </div>

            {/* Lista de trabajos */}
            <div className="card mb-4" style={{ maxHeight: 250, overflowY: "auto" }}>
              {trabajosFiltrados.map((trabajo) => (
                <div
                  key={trabajo.id}
                  onClick={() => {
                    setModalTrabajo(trabajo);
                    setCantidad(1);
                  }}
                  className="list-item list-item-interactive"
                >
                  <div className="list-item-content">
                    <div className="list-item-title">{trabajo.nombre}</div>
                    <div className="list-item-subtitle">
                      {trabajo.unidad} · {calidad.toUpperCase()}: {trabajo[`precio_${calidad}`]}€
                    </div>
                  </div>
                  <button className="btn-icon btn-accent">
                    <Plus size={20} weight="bold" />
                  </button>
                </div>
              ))}
            </div>

            {/* Líneas añadidas */}
            {lineas.length > 0 && (
              <div className="mb-4">
                <label className="input-label">Líneas añadidas ({lineas.length})</label>
                <div className="space-y-2">
                  {lineas.map((linea, idx) => (
                    <div key={idx} className="card p-3 flex items-center gap-3">
                      <div style={{ flex: 1 }}>
                        <div className="font-bold text-small">{linea.trabajo_nombre}</div>
                        <div className="text-tiny text-secondary">
                          {linea.cantidad} {linea.unidad} × {linea.precio_unitario}€
                        </div>
                      </div>
                      <div className="font-bold">{formatCurrency(linea.subtotal)}</div>
                      <button
                        onClick={() => eliminarLinea(idx)}
                        className="btn-icon-sm"
                        style={{ background: "rgba(193,41,46,0.1)", color: "var(--error)" }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Totales */}
                <div className="totals-card mt-3">
                  <div className="totals-row">
                    <span className="text-secondary">Base imponible</span>
                    <span className="font-bold">{formatCurrency(totales.base_imponible)}</span>
                  </div>
                  {totales.factor_total && totales.factor_total !== 1 && (
                    <div className="totals-row">
                      <span className="text-secondary">Factor (×{totales.factor_total?.toFixed(2)})</span>
                      <span className="font-bold">{formatCurrency(totales.base_con_factores)}</span>
                    </div>
                  )}
                  {incluyeIva && (
                    <div className="totals-row">
                      <span className="text-secondary">IVA 21%</span>
                      <span className="font-bold">{formatCurrency(totales.iva_importe)}</span>
                    </div>
                  )}
                  <div className="totals-row totals-row-main">
                    <span>TOTAL</span>
                    <span>{formatCurrency(totales.total)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tipo presupuesto */}
            <div className="card p-4 mb-4">
              <label className="input-label">Tipo de presupuesto</label>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <button
                  onClick={() => setTipoPresupuesto("mo")}
                  className={`quality-option ${tipoPresupuesto === "mo" ? "quality-option-active" : ""}`}
                >
                  <div className="font-bold text-small">🔧 Solo mano obra</div>
                </button>
                <button
                  onClick={() => setTipoPresupuesto("mo_material")}
                  className={`quality-option ${tipoPresupuesto === "mo_material" ? "quality-option-active" : ""}`}
                >
                  <div className="font-bold text-small">📦 MO + Material</div>
                </button>
              </div>

              <label className="input-label">IVA</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setIncluyeIva(true)}
                  className={`quality-option ${incluyeIva ? "quality-option-active" : ""}`}
                >
                  <div className="font-bold text-small">Con IVA (21%)</div>
                </button>
                <button
                  onClick={() => setIncluyeIva(false)}
                  className={`quality-option ${!incluyeIva ? "quality-option-active" : ""}`}
                >
                  <div className="font-bold text-small">Sin IVA</div>
                </button>
              </div>
            </div>

            {/* Descripción */}
            <Textarea
              label="Descripción del trabajo (opcional)"
              placeholder="Describe qué necesitas..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />

            <div className="flex gap-3 mt-4">
              <Button variant="outline" onClick={() => setPaso(1)} className="flex-1">
                <CaretLeft size={18} /> Volver
              </Button>
              <Button 
                variant="accent" 
                onClick={() => setPaso(3)} 
                disabled={lineas.length === 0}
                className="flex-1"
              >
                Continuar <CaretRight size={18} />
              </Button>
            </div>
          </motion.div>
        )}

        {/* PASO 3: Foto y Firma */}
        {paso === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-h2 font-display mb-4">
              <Badge variant="primary">3</Badge> Foto y firma
            </h2>

            {/* Foto estado inicial */}
            <div className="card p-4 mb-4">
              <label className="input-label">📷 Foto del estado actual (opcional)</label>
              <p className="text-tiny text-secondary mb-3">
                Toma una foto para documentar el estado antes de la obra
              </p>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setFotoEstado(reader.result);
                    reader.readAsDataURL(file);
                  }
                }}
                className="hidden"
                id="foto-input"
              />
              <label htmlFor="foto-input">
                <Button variant="outline" className="btn-full" as="span">
                  <Camera size={20} /> Tomar foto
                </Button>
              </label>
              {fotoEstado && (
                <img src={fotoEstado} alt="Estado" className="mt-3 rounded-lg w-full h-40 object-cover" />
              )}
            </div>

            {/* Firma digital */}
            <div className="card p-4 mb-4">
              <label className="input-label">✍️ Firma del cliente (opcional)</label>
              <p className="text-tiny text-secondary mb-3">
                Firma con el dedo para confirmar el presupuesto
              </p>
              <SignatureCanvas
                ref={sigCanvas}
                canvasProps={{
                  className: "signature-canvas",
                }}
                backgroundColor="white"
              />
              <div className="flex gap-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => sigCanvas.current?.clear()}
                  className="flex-1"
                >
                  Borrar firma
                </Button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setPaso(2)} className="flex-1">
                <CaretLeft size={18} /> Volver
              </Button>
              <Button variant="accent" onClick={() => setPaso(4)} className="flex-1">
                Ver resumen <CaretRight size={18} />
              </Button>
            </div>
          </motion.div>
        )}

        {/* PASO 4: Resumen */}
        {paso === 4 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-h2 font-display mb-4">
              <Badge variant="primary">4</Badge> Resumen final
            </h2>

            {/* Cabecera cliente */}
            <div className="card card-dark p-4 mb-4">
              <div className="text-tiny" style={{ opacity: 0.6 }}>Presupuesto para</div>
              <div className="text-h3 font-display" style={{ color: "var(--brand-accent)" }}>
                {cliente.nombre}
              </div>
              <div className="text-small" style={{ opacity: 0.7, marginTop: 4 }}>
                <MapPin size={14} style={{ display: "inline", marginRight: 4 }} />
                {cliente.direccion}
              </div>
              {cliente.telefono && (
                <div className="text-small" style={{ opacity: 0.7 }}>
                  <Phone size={14} style={{ display: "inline", marginRight: 4 }} />
                  {cliente.telefono}
                </div>
              )}
            </div>

            {/* Detalle líneas */}
            <div className="card p-4 mb-4">
              <label className="input-label">Trabajos incluidos</label>
              {lineas.map((linea, idx) => (
                <div key={idx} className="flex justify-between py-2 border-b border-subtle">
                  <div>
                    <div className="font-bold text-small">{linea.trabajo_nombre}</div>
                    <div className="text-tiny text-secondary">
                      {linea.cantidad} {linea.unidad} × {linea.precio_unitario}€
                    </div>
                  </div>
                  <div className="font-bold">{formatCurrency(linea.subtotal)}</div>
                </div>
              ))}

              {/* Factores */}
              {factoresSeleccionados.length > 0 && (
                <div className="mt-4 pt-4 border-t border-subtle">
                  <label className="input-label">Factores aplicados</label>
                  {factoresSeleccionados.map((f) => (
                    <div key={f.id} className="flex justify-between text-tiny py-1">
                      <span>{f.nombre}</span>
                      <span style={{ color: f.multiplicador > 1 ? "var(--error)" : "var(--success)" }}>
                        ×{f.multiplicador.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Totales finales */}
            <div className="card p-4 mb-4">
              <div className="totals-row">
                <span className="text-secondary">Base</span>
                <span className="font-bold">{formatCurrency(totales.base_imponible)}</span>
              </div>
              {totales.factor_total !== 1 && (
                <div className="totals-row">
                  <span className="text-secondary">Con factores</span>
                  <span className="font-bold">{formatCurrency(totales.base_con_factores)}</span>
                </div>
              )}
              {descuento > 0 && (
                <div className="totals-row" style={{ color: "var(--success)" }}>
                  <span>Descuento ({descuento}%)</span>
                  <span className="font-bold">-{formatCurrency(totales.descuento_importe)}</span>
                </div>
              )}
              {incluyeIva && (
                <div className="totals-row">
                  <span className="text-secondary">IVA 21%</span>
                  <span className="font-bold">{formatCurrency(totales.iva_importe)}</span>
                </div>
              )}
              <div className="totals-row totals-row-main">
                <span>TOTAL</span>
                <span>{formatCurrency(totales.total)}</span>
              </div>
            </div>

            {/* Forma de pago */}
            <div className="card p-4 mb-4" style={{ background: "rgba(201,162,39,0.1)", border: "1px solid var(--brand-accent)" }}>
              <label className="input-label" style={{ color: "var(--brand-accent)" }}>💳 Forma de pago</label>
              <div className="flex justify-between text-small mb-1">
                <span>Anticipo al inicio (40%)</span>
                <span className="font-bold" style={{ color: "var(--brand-accent)" }}>{formatCurrency(totales.anticipo_importe)}</span>
              </div>
              <div className="flex justify-between text-small mb-1">
                <span>Mitad de obra (30%)</span>
                <span className="font-bold">{formatCurrency(totales.mitad_obra_importe)}</span>
              </div>
              <div className="flex justify-between text-small">
                <span>Resto al finalizar (30%)</span>
                <span className="font-bold">{formatCurrency(totales.resto_importe)}</span>
              </div>
            </div>

            {/* Tiempo estimado */}
            {totales.tiempo_total_horas > 0 && (
              <div className="card p-4 mb-4">
                <label className="input-label">⏱️ Tiempo estimado</label>
                <div className="text-h3 font-display">
                  {totales.tiempo_total_horas < 8 
                    ? `${totales.tiempo_total_horas.toFixed(1)} horas`
                    : `${Math.ceil(totales.tiempo_total_horas / 8)} días laborables`
                  }
                </div>
              </div>
            )}

            {/* Botones finales */}
            <div className="space-y-3">
              <Button 
                variant="success" 
                className="btn-full btn-lg"
                onClick={guardarPresupuesto}
                data-testid="btn-guardar-presupuesto"
              >
                <Check size={20} /> Guardar presupuesto
              </Button>
              <Button variant="outline" onClick={() => setPaso(3)} className="btn-full">
                <CaretLeft size={18} /> Volver a editar
              </Button>
            </div>
          </motion.div>
        )}

        {/* Modal cantidad */}
        <Modal
          isOpen={!!modalTrabajo}
          onClose={() => setModalTrabajo(null)}
          title="Añadir trabajo"
        >
          {modalTrabajo && (
            <div>
              <div className="text-h3 font-display mb-1">{modalTrabajo.nombre}</div>
              <div className="text-secondary mb-4">{modalTrabajo.unidad}</div>

              <div className="flex items-center justify-center gap-4 mb-6">
                <button
                  onClick={() => setCantidad(Math.max(0.5, cantidad - 0.5))}
                  className="btn-icon btn-outline"
                  style={{ width: 48, height: 48 }}
                >
                  <Minus size={20} weight="bold" />
                </button>
                <input
                  type="number"
                  value={cantidad}
                  onChange={(e) => setCantidad(Number(e.target.value))}
                  className="input"
                  style={{ 
                    width: 100, 
                    textAlign: "center", 
                    fontSize: "1.5rem", 
                    fontWeight: 800,
                    fontFamily: "Chivo, sans-serif"
                  }}
                />
                <button
                  onClick={() => setCantidad(cantidad + 0.5)}
                  className="btn-icon btn-outline"
                  style={{ width: 48, height: 48 }}
                >
                  <Plus size={20} weight="bold" />
                </button>
              </div>

              <div className="text-center mb-4">
                <div className="text-tiny text-secondary">Precio unitario ({calidad.toUpperCase()})</div>
                <div className="text-h3 font-display">{modalTrabajo[`precio_${calidad}`]}€/{modalTrabajo.unidad}</div>
              </div>

              <div className="text-center mb-6">
                <div className="text-tiny text-secondary">Total línea</div>
                <div className="text-h2 font-display" style={{ color: "var(--brand-accent)" }}>
                  {formatCurrency(modalTrabajo[`precio_${calidad}`] * cantidad)}
                </div>
              </div>

              <Button variant="accent" className="btn-full" onClick={agregarLinea}>
                <Check size={20} /> Añadir al presupuesto
              </Button>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

// ==========================================
// RESUMEN PRESUPUESTO CREADO
// ==========================================

const ResumenPresupuestoCreado = ({ presupuesto, empresa, onNuevo }) => {
  const generarPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(empresa?.nombre || "Andy Gonzaga", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Instalaciones y Reformas", 105, 28, { align: "center" });
    
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(`PRESUPUESTO ${presupuesto.numero}`, 20, 45);
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Fecha: ${presupuesto.fecha}`, 20, 55);
    doc.text(`Cliente: ${presupuesto.cliente_nombre}`, 20, 62);
    doc.text(`Teléfono: ${presupuesto.cliente_telefono}`, 20, 69);
    doc.text(`Dirección: ${presupuesto.cliente_direccion}`, 20, 76);
    
    const tableData = presupuesto.lineas.map((l) => [
      l.trabajo_nombre,
      `${l.cantidad} ${l.unidad}`,
      `${l.precio_unitario}€`,
      `${l.subtotal.toFixed(2)}€`,
    ]);
    
    doc.autoTable({
      startY: 90,
      head: [["Trabajo", "Cantidad", "Precio/ud", "Subtotal"]],
      body: tableData,
      theme: "striped",
      headStyles: { fillColor: [26, 58, 74] },
    });
    
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFont("helvetica", "bold");
    doc.text(`Base: ${presupuesto.base_imponible.toFixed(2)}€`, 140, finalY);
    if (presupuesto.incluye_iva) {
      doc.text(`IVA 21%: ${presupuesto.iva_importe.toFixed(2)}€`, 140, finalY + 7);
    }
    doc.setFontSize(14);
    doc.text(`TOTAL: ${presupuesto.total.toFixed(2)}€`, 140, finalY + 17);
    
    doc.save(`Presupuesto_${presupuesto.numero}.pdf`);
  };

  const enviarWhatsApp = () => {
    const texto = `*PRESUPUESTO ${presupuesto.numero}*%0A%0A` +
      `Cliente: ${presupuesto.cliente_nombre}%0A` +
      `Dirección: ${presupuesto.cliente_direccion}%0A%0A` +
      `*Trabajos:*%0A` +
      presupuesto.lineas.map((l) => `• ${l.trabajo_nombre}: ${l.cantidad} ${l.unidad} - ${l.subtotal.toFixed(2)}€`).join("%0A") +
      `%0A%0A*TOTAL: ${presupuesto.total.toFixed(2)}€*%0A%0A` +
      `${empresa?.nombre || "Andy Gonzaga"} - Instalaciones y Reformas`;
    
    window.open(`https://wa.me/${presupuesto.cliente_telefono?.replace(/\s/g, "")}?text=${texto}`, "_blank");
  };

  return (
    <div className="pb-24">
      <div className="container pt-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="card card-accent p-6 text-center mb-6"
        >
          <CheckCircle size={56} weight="fill" style={{ margin: "0 auto 12px" }} />
          <div className="text-h2 font-display">¡Presupuesto creado!</div>
          <div className="text-small" style={{ opacity: 0.8, marginTop: 4 }}>{presupuesto.numero}</div>
        </motion.div>

        <div className="card p-4 mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-secondary">Cliente</span>
            <span className="font-bold">{presupuesto.cliente_nombre}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-secondary">Trabajos</span>
            <span className="font-bold">{presupuesto.lineas.length}</span>
          </div>
          <div className="flex justify-between text-h3 font-display border-t border-subtle pt-3 mt-2">
            <span>Total</span>
            <span style={{ color: "var(--brand-accent)" }}>{formatCurrency(presupuesto.total)}</span>
          </div>
        </div>

        <div className="space-y-3">
          <Button variant="primary" className="btn-full" onClick={generarPDF}>
            <Download size={20} /> Descargar PDF
          </Button>
          <Button variant="whatsapp" className="btn-full" onClick={enviarWhatsApp}>
            <WhatsappLogo size={20} weight="fill" /> Enviar por WhatsApp
          </Button>
          <Button variant="outline" className="btn-full" onClick={onNuevo}>
            <Plus size={20} /> Crear otro presupuesto
          </Button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// APP CLIENTE
// ==========================================

const ClienteApp = () => {
  const [activeTab, setActiveTab] = useState("portada");
  const [empresa, setEmpresa] = useState(null);
  const [trabajos, setTrabajos] = useState([]);
  const [modulos, setModulos] = useState([]);
  const [factores, setFactores] = useState([]);
  const [plantillas, setPlantillas] = useState([]);
  const [catalogo, setCatalogo] = useState([]);
  const [presupuestoCreado, setPresupuestoCreado] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [asesorAbierto, setAsesorAbierto] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [empRes, trabRes, modRes, facRes, planRes, catRes] = await Promise.all([
          api.get("/empresa"),
          api.get("/trabajos"),
          api.get("/modulos"),
          api.get("/factores"),
          api.get("/plantillas"),
          api.get("/catalogo"),
        ]);
        setEmpresa(empRes);
        setTrabajos(trabRes);
        setModulos(modRes);
        setFactores(facRes);
        setPlantillas(planRes);
        setCatalogo(catRes);
      } catch (e) {
        console.error("Error cargando datos:", e);
        setToast({ message: "Error cargando datos", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);

  const handlePresupuestoCreado = (presupuesto) => {
    setPresupuestoCreado(presupuesto);
    setToast({ message: "¡Presupuesto guardado!", type: "success" });
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base)" }}>
      {activeTab === "portada" && (
        <Portada 
          empresa={empresa} 
          onNavigate={setActiveTab}
          onAbrirAsesor={() => setAsesorAbierto(true)}
        />
      )}

      {activeTab === "tarjeta-digital" && <TarjetaDigital />}

      {activeTab === "diagnostico" && <Diagnostico onNavigate={setActiveTab} />}

      {activeTab === "catalogo" && <Catalogo isAdmin={false} />}

      {activeTab === "presupuesto" && !presupuestoCreado && (
        <CrearPresupuesto
          trabajos={trabajos}
          modulos={modulos}
          factores={factores}
          plantillas={plantillas}
          empresa={empresa}
          onCrear={handlePresupuestoCreado}
          onBack={() => setActiveTab("portada")}
        />
      )}

      {activeTab === "presupuesto" && presupuestoCreado && (
        <ResumenPresupuestoCreado
          presupuesto={presupuestoCreado}
          empresa={empresa}
          onNuevo={() => setPresupuestoCreado(null)}
        />
      )}

      {activeTab === "precios" && (
        <ListaPrecios trabajos={trabajos} modulos={modulos} isAdmin={false} />
      )}

      {activeTab === "catalogo" && <Catalogo fotos={catalogo} />}

      {activeTab === "diagnostico" && (
        <div className="pb-24">
          <div className="container pt-4">
            <h1 className="text-h2 font-display mb-4">
              <MagnifyingGlass size={28} style={{ display: "inline", marginRight: 8 }} />
              Diagnóstico Rápido
            </h1>
            <p className="text-secondary mb-6">
              Describe tu obra y te daremos un presupuesto estimado al instante.
            </p>
            <Button 
              variant="accent" 
              className="btn-full"
              onClick={() => setActiveTab("presupuesto")}
            >
              Comenzar diagnóstico →
            </Button>
          </div>
        </div>
      )}

      <BottomNav activeTab={activeTab} onNavigate={setActiveTab} isAdmin={false} />

      {/* Asesor IA Modal */}
      <AsesorTecnicoIA 
        isOpen={asesorAbierto} 
        onClose={() => setAsesorAbierto(false)} 
      />

      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ==========================================
// APP ADMIN (Simplificada por ahora)
// ==========================================

const AdminApp = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("admin_token"));
  const [pin, setPin] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({});
  const [presupuestos, setPresupuestos] = useState([]);
  const [trabajos, setTrabajos] = useState([]);
  const [modulos, setModulos] = useState([]);
  const [factores, setFactores] = useState([]);
  const [plantillas, setPlantillas] = useState([]);
  const [empresa, setEmpresa] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminConfigured, setAdminConfigured] = useState(null);
  const [setupData, setSetupData] = useState({ pin: "", pregunta: "", respuesta: "" });

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const res = await api.get("/admin/check");
      setAdminConfigured(res.configured);
      if (res.configured && token) {
        setAuthenticated(true);
        cargarDatos();
      } else {
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const cargarDatos = async () => {
    try {
      const [statsRes, presRes, trabRes, modRes, facRes, planRes, empRes] = await Promise.all([
        api.get("/admin/stats").catch(() => ({})),
        api.get("/presupuestos"),
        api.get("/trabajos"),
        api.get("/modulos"),
        api.get("/factores"),
        api.get("/plantillas"),
        api.get("/empresa"),
      ]);
      setStats(statsRes);
      setPresupuestos(presRes);
      setTrabajos(trabRes);
      setModulos(modRes);
      setFactores(facRes);
      setPlantillas(planRes);
      setEmpresa(empRes);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSetup = async () => {
    if (setupData.pin.length !== 4) {
      setToast({ message: "El PIN debe tener 4 dígitos", type: "error" });
      return;
    }
    try {
      const res = await api.post("/admin/setup", {
        pin: setupData.pin,
        pregunta_secreta: setupData.pregunta,
        respuesta_secreta: setupData.respuesta,
      });
      localStorage.setItem("admin_token", res.token);
      setToken(res.token);
      setAuthenticated(true);
      setAdminConfigured(true);
      cargarDatos();
      setToast({ message: "Admin configurado", type: "success" });
    } catch (e) {
      setToast({ message: "Error configurando", type: "error" });
    }
  };

  const handleLogin = async (pinValue) => {
    if (pinValue.length !== 4) return;
    try {
      const res = await api.post("/admin/login", { pin: pinValue });
      localStorage.setItem("admin_token", res.token);
      setToken(res.token);
      setAuthenticated(true);
      cargarDatos();
    } catch (e) {
      setToast({ message: "PIN incorrecto", type: "error" });
      setPin("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setToken(null);
    setAuthenticated(false);
  };

  // PIN Pad
  const PinPad = () => (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))" }}
    >
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Lock size={56} weight="duotone" style={{ color: "var(--brand-accent)", margin: "0 auto 16px" }} />
          <div className="text-h2 font-display text-white">Panel Admin</div>
          <div className="text-small text-white" style={{ opacity: 0.6 }}>Andy Gonzaga</div>
        </div>

        <div className="card p-6">
          <div className="text-center font-bold mb-2">Introduce tu PIN</div>
          <div className="text-center text-tiny text-secondary mb-6">4 dígitos</div>

          <div className="pin-dots mb-6">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`pin-dot ${pin.length > i ? "pin-dot-filled" : ""}`}
              />
            ))}
          </div>

          <div className="pin-pad">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, "C", 0, "⌫"].map((key) => (
              <button
                key={key}
                onClick={() => {
                  if (key === "C") setPin("");
                  else if (key === "⌫") setPin(pin.slice(0, -1));
                  else if (pin.length < 4) {
                    const newPin = pin + key;
                    setPin(newPin);
                    if (newPin.length === 4) {
                      setTimeout(() => handleLogin(newPin), 200);
                    }
                  }
                }}
                className="pin-key"
              >
                {key}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Setup
  const SetupScreen = () => (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))" }}
    >
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Gear size={56} weight="duotone" style={{ color: "var(--brand-accent)", margin: "0 auto 16px" }} />
          <div className="text-h2 font-display text-white">Configurar Admin</div>
        </div>

        <div className="card p-6">
          <Input
            label="PIN (4 dígitos)"
            type="password"
            maxLength={4}
            value={setupData.pin}
            onChange={(e) => setSetupData({ ...setupData, pin: e.target.value })}
            placeholder="****"
          />
          <Input
            label="Pregunta secreta"
            value={setupData.pregunta}
            onChange={(e) => setSetupData({ ...setupData, pregunta: e.target.value })}
            placeholder="¿Tu pregunta?"
          />
          <Input
            label="Respuesta"
            value={setupData.respuesta}
            onChange={(e) => setSetupData({ ...setupData, respuesta: e.target.value })}
            placeholder="Tu respuesta"
          />
          <Button variant="accent" className="btn-full mt-4" onClick={handleSetup}>
            Configurar
          </Button>
        </div>
      </div>
    </div>
  );

  // Dashboard
  const Dashboard = () => (
    <div className="pb-24">
      <div className="hero-header">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-tiny" style={{ opacity: 0.6 }}>Panel Admin</div>
            <div className="text-h2 font-display">{empresa?.nombre || "Andy Gonzaga"}</div>
          </div>
          <button onClick={handleLogout} className="btn btn-sm btn-outline" style={{ borderColor: "rgba(255,255,255,0.3)", color: "white" }}>
            Salir
          </button>
        </div>
      </div>

      <div className="container" style={{ marginTop: -20, position: "relative", zIndex: 2 }}>
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="card card-elevated stat-card">
            <div className="stat-value">{stats.total_presupuestos || 0}</div>
            <div className="stat-label">Presupuestos</div>
          </div>
          <div className="card stat-card" style={{ background: "var(--success)", color: "white" }}>
            <div className="stat-value">{formatCurrency(stats.facturado_mes)}</div>
            <div className="stat-label" style={{ color: "rgba(255,255,255,0.8)" }}>Este mes</div>
          </div>
          <div className="card card-elevated stat-card">
            <div className="stat-value">{stats.pendientes || 0}</div>
            <div className="stat-label">Pendientes</div>
          </div>
          <div className="card card-elevated stat-card">
            <div className="stat-value">{stats.finalizados || 0}</div>
            <div className="stat-label">Finalizados</div>
          </div>
        </div>

        {/* Tasa cierre */}
        <div className="card p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold">Tasa de cierre</span>
            <span className="text-h3 font-display">{stats.tasa_cierre || 0}%</span>
          </div>
          <div className="progress-step" style={{ height: 8 }}>
            <div className="progress-step-fill" style={{ width: `${stats.tasa_cierre || 0}%` }} />
          </div>
        </div>

        {/* Últimos presupuestos */}
        <div className="section">
          <h3 className="section-title">
            <FileText size={20} /> Últimos presupuestos
          </h3>
          <div className="card">
            {presupuestos.slice(0, 5).map((p) => (
              <div key={p.id} className="list-item list-item-interactive">
                <div className="list-item-content">
                  <div className="list-item-title">{p.cliente_nombre}</div>
                  <div className="list-item-subtitle">{p.numero} · {formatDate(p.fecha)}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{formatCurrency(p.total)}</div>
                  <Badge variant={p.estado === "finalizado" ? "success" : p.estado === "aceptado" ? "primary" : "outline"}>
                    {p.estado}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) return <Loading />;
  if (adminConfigured === false) return <SetupScreen />;
  if (!authenticated) return (
    <>
      <PinPad />
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </>
  );

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base)" }}>
      {activeTab === "dashboard" && <Dashboard />}
      
      {activeTab === "gestora" && <GestoraAutomatica />}
      
      {activeTab === "presupuesto" && (
        <CrearPresupuesto
          trabajos={trabajos}
          modulos={modulos}
          factores={factores}
          plantillas={plantillas}
          empresa={empresa}
          onCrear={(p) => {
            setToast({ message: "Presupuesto creado", type: "success" });
            setActiveTab("historial");
            cargarDatos();
          }}
        />
      )}

      {activeTab === "historial" && (
        <div className="pb-24">
          <div className="container pt-4">
            <h1 className="text-h2 font-display mb-4">
              <FileText size={28} style={{ display: "inline", marginRight: 8 }} />
              Historial
            </h1>
            <div className="card">
              {presupuestos.map((p) => (
                <div key={p.id} className="list-item">
                  <div className="list-item-content">
                    <div className="list-item-title">{p.cliente_nombre}</div>
                    <div className="list-item-subtitle">{p.numero} · {p.lineas?.length || 0} trabajos</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{formatCurrency(p.total)}</div>
                    <Badge variant={p.estado === "finalizado" ? "success" : "outline"}>{p.estado}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "precios" && (
        <ListaPrecios trabajos={trabajos} modulos={modulos} isAdmin={true} />
      )}

      {activeTab === "admin" && <MenuAdmin onNavigate={setActiveTab} />}

      {activeTab === "trabajos-custom" && <TrabajosCustom />}
      {activeTab === "materiales" && <MaterialesCustom />}
      {activeTab === "proveedores" && <Proveedores />}
      {activeTab === "plantillas" && <Plantillas />}
      {activeTab === "agenda" && <Agenda />}
      {activeTab === "facturas" && <Facturas />}
      {activeTab === "garantias" && <Garantias />}
      {activeTab === "crm" && <CRMClientes />}
      {activeTab === "catalogo-admin" && <Catalogo isAdmin={true} />}

      {activeTab === "whatsapp" && <PlantillasWhatsApp />}

      {activeTab === "factores" && <Factores />}

      {activeTab === "configuracion" && (
        <div className="pb-24">
          <div className="container pt-4">
            <h1 className="text-h2 font-display mb-4">
              <Gear size={28} style={{ display: "inline", marginRight: 8 }} />
              Configuración
            </h1>
            <div className="space-y-3">
              {[
                { icon: "🏢", label: "Datos de empresa", desc: "Nombre, contacto, logo" },
                { icon: "💰", label: "Tarifas", desc: "Precios ECO/STD/PREM" },
                { icon: "📦", label: "Materiales", desc: "Costes y proveedores" },
                { icon: "📋", label: "Plantillas", desc: "Presupuestos rápidos" },
                { icon: "💬", label: "Mensajes WhatsApp", desc: "Plantillas de mensajes" },
                { icon: "🖼️", label: "Catálogo", desc: "Fotos de trabajos" },
                { icon: "📊", label: "Estadísticas", desc: "Informes y métricas" },
                { icon: "🔐", label: "Seguridad", desc: "Cambiar PIN" },
                { icon: "🌐", label: "Servidor/Dominio", desc: "Configuración técnica" },
              ].map((item, i) => (
                <div key={i} className="card list-item list-item-interactive">
                  <div className="list-item-icon">{item.icon}</div>
                  <div className="list-item-content">
                    <div className="list-item-title">{item.label}</div>
                    <div className="list-item-subtitle">{item.desc}</div>
                  </div>
                  <CaretRight size={20} style={{ color: "var(--text-light)" }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <BottomNav activeTab={activeTab} onNavigate={setActiveTab} isAdmin={true} />

      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
};

// ==========================================
// ROUTER
// ==========================================

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ClienteApp />} />
        <Route path="/admin" element={<AdminApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
