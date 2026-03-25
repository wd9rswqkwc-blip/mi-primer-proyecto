import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { Phone, Envelope, MapPin, Calendar, WhatsappLogo, Star } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { api } from "../../utils/api";
import { Loading } from "../shared/EmptyState";

export const TarjetaDigital = () => {
  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarEmpresa = async () => {
      try {
        const data = await api.get("/empresa");
        setEmpresa(data);
      } catch (e) {
        console.error("Error cargando empresa:", e);
      } finally {
        setLoading(false);
      }
    };
    cargarEmpresa();
  }, []);

  if (loading) return <Loading />;

  const currentUrl = window.location.href;
  const appUrl = currentUrl.includes("localhost") 
    ? "http://localhost:3000" 
    : window.location.origin;

  return (
    <div className="min-h-screen pb-24" style={{ background: "var(--bg-base)" }}>
      <div className="hero-header" style={{ padding: "32px 20px 40px" }}>
        <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <div className="text-h1 font-display mb-2" style={{ color: "var(--brand-accent)" }}>
            {empresa?.nombre?.split(" ")[0] || "Andy"}
          </div>
          <div className="text-h2 font-display" style={{ color: "white" }}>
            {empresa?.nombre?.split(" ")[1] || "Gonzaga"}
          </div>
          <div className="text-small" style={{ opacity: 0.8, marginTop: 12 }}>
            {empresa?.slogan || "Instalaciones y Reformas"}
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: -30, position: "relative", zIndex: 2 }}>
        {/* QR Code Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="card card-elevated p-6 mb-6"
          style={{ background: "white", textAlign: "center" }}
        >
          <div className="text-label mb-4" style={{ color: "var(--brand-accent)" }}>
            📱 ESCANEA PARA GUARDAR
          </div>
          <div style={{ 
            background: "white", 
            padding: 24, 
            borderRadius: 16, 
            margin: "0 auto",
            maxWidth: 280
          }}>
            <QRCode
              value={appUrl}
              size={256}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              viewBox="0 0 256 256"
              bgColor="#ffffff"
              fgColor="#1a3a4a"
            />
          </div>
          <p className="text-tiny text-secondary mt-4">
            Escanea este código QR para acceder a nuestra app<br />y solicitar tu presupuesto
          </p>
        </motion.div>

        {/* Info Cards */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Contacto */}
          <div className="card p-5 mb-4">
            <div className="text-label mb-4" style={{ color: "var(--brand-primary)" }}>
              📞 CONTACTO
            </div>
            <div className="space-y-3">
              <a 
                href={`tel:${empresa?.telefono}`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-secondary transition-colors"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div style={{ 
                  width: 44, 
                  height: 44, 
                  background: "var(--brand-primary)", 
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white"
                }}>
                  <Phone size={20} weight="fill" />
                </div>
                <div style={{ flex: 1 }}>
                  <div className="font-bold text-small">{empresa?.telefono || "6XX XXX XXX"}</div>
                  <div className="text-tiny text-secondary">Teléfono</div>
                </div>
              </a>

              <a 
                href={`https://wa.me/${empresa?.telefono?.replace(/\s/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-secondary transition-colors"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div style={{ 
                  width: 44, 
                  height: 44, 
                  background: "#25D366", 
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white"
                }}>
                  <WhatsappLogo size={20} weight="fill" />
                </div>
                <div style={{ flex: 1 }}>
                  <div className="font-bold text-small">WhatsApp</div>
                  <div className="text-tiny text-secondary">Respuesta rápida</div>
                </div>
              </a>

              <a 
                href={`mailto:${empresa?.email}`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-secondary transition-colors"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div style={{ 
                  width: 44, 
                  height: 44, 
                  background: "var(--brand-accent)", 
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white"
                }}>
                  <Envelope size={20} weight="fill" />
                </div>
                <div style={{ flex: 1 }}>
                  <div className="font-bold text-small">{empresa?.email || "info@andygonzaga.com"}</div>
                  <div className="text-tiny text-secondary">Email</div>
                </div>
              </a>

              <div className="flex items-center gap-3 p-3">
                <div style={{ 
                  width: 44, 
                  height: 44, 
                  background: "var(--surface-secondary)", 
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-primary)"
                }}>
                  <MapPin size={20} weight="fill" />
                </div>
                <div style={{ flex: 1 }}>
                  <div className="font-bold text-small">{empresa?.direccion || "Lleida"}</div>
                  <div className="text-tiny text-secondary">Ubicación</div>
                </div>
              </div>
            </div>
          </div>

          {/* Horario */}
          <div className="card p-5 mb-4">
            <div className="text-label mb-3" style={{ color: "var(--brand-primary)" }}>
              📅 HORARIO
            </div>
            <div className="flex items-center gap-3">
              <Calendar size={24} style={{ color: "var(--brand-accent)" }} />
              <div className="text-small">{empresa?.horario || "Sábados y Domingos"}</div>
            </div>
          </div>

          {/* Beneficios */}
          <div className="card card-dark p-5">
            <div className="text-label mb-4" style={{ color: "var(--brand-accent)" }}>
              ✨ POR QUÉ ELEGIRNOS
            </div>
            <div className="space-y-3">
              {[
                { icon: "⭐", text: "+10 años de experiencia" },
                { icon: "📋", text: "Presupuesto gratis en 24h" },
                { icon: "✅", text: "Garantía por escrito" },
                { icon: "👍", text: "Precio cerrado sin sorpresas" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span style={{ fontSize: "1.5rem" }}>{item.icon}</span>
                  <span className="text-small" style={{ opacity: 0.9 }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
