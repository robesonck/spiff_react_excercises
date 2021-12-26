import React from "react";
import "./Button.scss";

const Button = ({ children, variant = "primary", ...props }) => {
  return (
    <button {...props} className={`btn ${variant}`}>
      {children}
    </button>
  );
};

export default Button;
