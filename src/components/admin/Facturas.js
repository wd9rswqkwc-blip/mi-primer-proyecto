import React, { useState, useEffect } from "react";
import { Receipt, Download, Trash, Check } from "@phosphor-icons/react";
import { api, formatCurrency, formatDate } from "../../utils/api";
import { Button } from "../shared/Button";
import { Badge } from "../shared/Badge";
import { Loading, EmptyState } from "../shared/EmptyState";

export const Facturas = () => {
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarFacturas();
  }, []);

  const cargarFacturas = async () => {
    try {
      const data = await api.get("/facturas");
      setFacturas(data);
    } catch (e) {
      console.error("Error:", e);
    } finally {
      setLoading(false);
    }
  };

  const marcarCobrada = async (id, cobrada) => {
    try {
      await api.put(`/facturas/${id}`, { cobrada: !cobrada });
      cargarFacturas();
    } catch (e) {
      console.error("Error:", e);
    }
  };

  const generarPDF = async (id) => {
    try {
      window.open(`${process.env.REACT_APP_BACKEND_URL}/api/facturas/${id}/pdf`, "_blank");
    } catch (e) {
      console.error("Error:", e);
    }
  };

  const eliminarFactura = async (id) => {
    if (!window.confirm("¿Eliminar factura?")) return;
    try {
      await api.delete(`/facturas/${id}`);
      cargarFacturas();
    } catch (e) {
      console.error("Error:", e);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="pb-24">
      <div className="container pt-4">
        <h1 className="text-h2 font-display mb-4">Facturas</h1>

        {facturas.length === 0 ? (
          <EmptyState icon="🧾" title="Sin facturas" description="Las facturas se generan automáticamente desde presupuestos" />
        ) : (
          <div className="space-y-3">
            {facturas.map(factura => (
              <div key={factura.id} className="card p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-bold text-small">{factura.numero}</div>
                    <div className="text-tiny text-secondary">{factura.cliente}</div>
                  </div>
                  <Badge variant={factura.cobrada ? "success" : "warning"}>
                    {factura.cobrada ? "Cobrada" : "Pendiente"}
                  </Badge>
                </div>
                <div className="flex justify-between mb-3">
                  <div className="text-tiny text-secondary">{formatDate(factura.fecha)}</div>
                  <div className="font-bold" style={{ color: "var(--brand-accent)" }}>
                    {formatCurrency(factura.total)}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => marcarCobrada(factura.id, factura.cobrada)} icon={<Check size={16} />}>
                    {factura.cobrada ? "Marcar pendiente" : "Marcar cobrada"}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => generarPDF(factura.id)} icon={<Download size={16} />}>
                    PDF
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => eliminarFactura(factura.id)} icon={<Trash size={16} />}>
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};