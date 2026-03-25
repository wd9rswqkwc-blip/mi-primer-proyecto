import React, { useState } from "react";
import { FileText, Download, Signature as SignIcon } from "@phosphor-icons/react";
import { Button } from "../shared/Button";
import { Input, Textarea } from "../shared/Input";
import { Modal } from "../shared/Modal";
import SignatureCanvas from "react-signature-canvas";
import { api } from "../../utils/api";

export const Contratos = ({ presupuestoId, clienteNombre }) => {
  const [modalContrato, setModalContrato] = useState(false);
  const [contrato, setContrato] = useState({ texto: "", firma_cliente: "", firma_empresa: "" });
  const sigCanvasCliente = React.useRef(null);
  const sigCanvasEmpresa = React.useRef(null);

  const generarTextoContrato = () => {
    return `CONTRATO DE OBRA\n\nReunidos:\n\nDE UNA PARTE: Andy Gonzaga - Instalaciones y Reformas\nDE OTRA PARTE: ${clienteNombre}\n\nACUERDAN:\n\n1. El contratista se compromete a realizar los trabajos descritos en el presupuesto nº ${presupuestoId}\n2. El cliente se compromete a abonar el importe total según forma de pago acordada\n3. Garantía de 12 meses sobre los trabajos realizados\n4. Cualquier modificación sobre el presente contrato deberá ser acordada por escrito\n\nEn Lleida, a ${new Date().toLocaleDateString('es-ES')}`;
  };

  const abrirContrato = () => {
    setContrato({ ...contrato, texto: generarTextoContrato() });
    setModalContrato(true);
  };

  const guardarContrato = async () => {
    const firmaCliente = sigCanvasCliente.current?.toDataURL();
    const firmaEmpresa = sigCanvasEmpresa.current?.toDataURL();
    
    try {
      await api.post("/contratos", {
        presupuesto_id: presupuestoId,
        texto: contrato.texto,
        firma_cliente: firmaCliente,
        firma_empresa: firmaEmpresa,
        fecha: new Date().toISOString()
      });
      alert("Contrato guardado");
      setModalContrato(false);
    } catch (e) {
      console.error("Error:", e);
    }
  };

  return (
    <div>
      <Button variant="primary" onClick={abrirContrato} icon={<FileText size={20} />}>
        Generar contrato
      </Button>

      <Modal isOpen={modalContrato} onClose={() => setModalContrato(false)} title="Contrato de Obra">
        <div>
          <Textarea label="Texto del contrato" value={contrato.texto} onChange={(e) => setContrato({ ...contrato, texto: e.target.value })} rows={10} />
          
          <div className="mt-4">
            <div className="text-label mb-2">FIRMA CLIENTE</div>
            <div style={{ border: "2px dashed var(--border-subtle)", borderRadius: 8, marginBottom: 12 }}>
              <SignatureCanvas ref={sigCanvasCliente} canvasProps={{ width: 400, height: 150, style: { width: "100%", height: "150px" } }} backgroundColor="rgba(255,255,255,0.95)" />
            </div>
            <Button variant="ghost" size="sm" onClick={() => sigCanvasCliente.current?.clear()}>Borrar firma cliente</Button>
          </div>

          <div className="mt-4">
            <div className="text-label mb-2">FIRMA EMPRESA</div>
            <div style={{ border: "2px dashed var(--border-subtle)", borderRadius: 8, marginBottom: 12 }}>
              <SignatureCanvas ref={sigCanvasEmpresa} canvasProps={{ width: 400, height: 150, style: { width: "100%", height: "150px" } }} backgroundColor="rgba(255,255,255,0.95)" />
            </div>
            <Button variant="ghost" size="sm" onClick={() => sigCanvasEmpresa.current?.clear()}>Borrar firma empresa</Button>
          </div>

          <Button variant="accent" className="btn-full mt-4" onClick={guardarContrato}>Guardar contrato firmado</Button>
        </div>
      </Modal>
    </div>
  );
};