import React from "react";
import "./Button.scss";


// Types should be handled by ts or prop-types
// variant: 'primary' | 'danger'
// size: 'm' | 's'
const Button = ({ children, variant = "primary", size="m", ...props }) => {
  return (
    <button {...props} className={`btn ${variant} size-${size}`}>
      {children}
    </button>
  );
};

export default Button;
