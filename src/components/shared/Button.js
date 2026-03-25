import React from "react";

export const Button = ({ children, variant = "primary", size = "", className = "", icon, ...props }) => {
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
