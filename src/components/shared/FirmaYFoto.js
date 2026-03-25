import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Camera, Signature as SignIcon, Trash, Check } from "@phosphor-icons/react";
import { Button } from "../shared/Button";
import { motion } from "framer-motion";

export const FirmaYFoto = ({ onContinue, onBack, presupuestoData }) => {
  const sigCanvas = useRef(null);
  const [foto, setFoto] = useState(null);
  const [firmaSaved, setFirmaSaved] = useState(false);

  const handleFoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const limpiarFirma = () => {
    sigCanvas.current?.clear();
    setFirmaSaved(false);
  };

  const guardarFirma = () => {
    if (!sigCanvas.current?.isEmpty()) {
      const firma = sigCanvas.current.toDataURL();
      setFirmaSaved(true);
      return firma;
    }
    return null;
  };

  const confirmarYContinuar = () => {
    const firma = guardarFirma();
    onContinue({ foto, firma });
  };

  const saltarFirma = () => {
    onContinue({ foto, firma: null });
  };

  return (
    <div>
      <div className="card p-5 mb-4">
        <div className="text-label mb-3" style={{ color: "var(--brand-primary)" }}>
          <Camera size={20} style={{ display: "inline", marginRight: 8 }} />
          FOTO DEL ESTADO ACTUAL
        </div>
        <p className="text-small text-secondary mb-3">
          Opcional: Sube una foto del espacio antes de comenzar la obra
        </p>
        
        <input
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: "none" }}
          id="foto-input"
          onChange={handleFoto}
        />
        
        {!foto ? (
          <Button
            variant="outline"
            className="btn-full"
            onClick={() => document.getElementById('foto-input').click()}
            icon={<Camera size={20} />}
          >
            📷 Hacer foto del espacio
          </Button>
        ) : (
          <div>
            <img
              src={foto}
              alt="Foto del espacio"
              style={{ width: "100%", borderRadius: "var(--radius-md)", marginBottom: 12 }}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFoto(null)}
              icon={<Trash size={16} />}
            >
              Cambiar foto
            </Button>
          </div>
        )}
      </div>

      <div className="card p-5 mb-4">
        <div className="text-label mb-3" style={{ color: "var(--brand-primary)" }}>
          <SignIcon size={20} style={{ display: "inline", marginRight: 8 }} />
          FIRMA DIGITAL
        </div>
        <p className="text-small text-secondary mb-3">
          Firma aquí para aceptar el presupuesto
        </p>

        <div
          style={{
            border: "2px dashed var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            background: "var(--surface-secondary)",
            marginBottom: 12,
            overflow: "hidden"
          }}
        >
          <SignatureCanvas
            ref={sigCanvas}
            canvasProps={{
              width: window.innerWidth - 80,
              height: 200,
              className: "signature-canvas",
              style: { width: "100%", height: "200px" }
            }}
            backgroundColor="rgba(255,255,255,0.95)"
            penColor="var(--brand-primary)"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={limpiarFirma}
            icon={<Trash size={16} />}
          >
            Borrar
          </Button>
          {firmaSaved && (
            <div className="flex items-center gap-2" style={{ color: "var(--success)" }}>
              <Check size={20} weight="bold" />
              <span className="text-small font-bold">Firma guardada</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <Button
          variant="accent"
          className="btn-full"
          onClick={confirmarYContinuar}
          disabled={sigCanvas.current?.isEmpty()}
          icon={<Check size={20} />}
        >
          Confirmar firma y continuar
        </Button>
        <Button
          variant="outline"
          className="btn-full"
          onClick={saltarFirma}
        >
          Saltar firma y continuar →
        </Button>
        <Button
          variant="ghost"
          className="btn-full"
          onClick={onBack}
        >
          ← Volver
        </Button>
      </div>
    </div>
  );
};