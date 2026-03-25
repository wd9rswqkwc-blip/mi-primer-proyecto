import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Warning, Info } from "@phosphor-icons/react";

export const Toast = ({ message, type = "success", onClose }) => {
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
