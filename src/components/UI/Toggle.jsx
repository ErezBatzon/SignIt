import React from "react";
import "./toggle.css";

const Toggle = ({ onSetSimpleFill }) => {
  return (
    <div className="toggle">
      <label className="switch">
        <input
          className="checked"
          type="checkbox"
          onClick={(e) => onSetSimpleFill(e.currentTarget.checked)}
        />
        <span className="slider round"></span>
      </label>
      <label className="fast-fill">מילוי מהיר</label>
    </div>
  );
};

export default Toggle;
