import React, { useRef, useState, useEffect } from "react";
import MainInput from "./Inputs/MainInput";

const FillPanel = ({
  onSetFocusToNextField,
  onSetFocusToPrevField,
  handleInputText,
  handleSignatureData,
  mainInputRef,
  currentInputObj,
  currentValue,
}) => {
  useEffect(() => {
      mainInputRef.current.classList.add("main-input-zoon-in");
      setTimeout(() => {
        mainInputRef.current.classList.remove("main-input-zoon-in");
        mainInputRef.current.classList.add("zoom-out");
      }, 500);

      return () => {
        mainInputRef.current.classList.remove("main-input-zoon-in", "zoom-out");
      };
  }, [currentInputObj]);

  return (
    <div className="fill-field-panel">
      <div className="input-filler">
        <p className="description">
          שדה למילוי:{" "}
          <span className="input-description">
            {currentInputObj.description}
          </span>
        </p>
        <MainInput
          mainInputRef={mainInputRef}
          handleInputText={handleInputText}
          handleSignatureData={handleSignatureData}
          currentValue={currentValue}
          currentInputObj={currentInputObj}
          onSetFocusToNextField={onSetFocusToNextField}
        />
      </div>
      <div className="fill-navigation-buttons">
        <button onClick={() => onSetFocusToNextField()} className="next">
         הבא
        </button>
        <button onClick={() => onSetFocusToPrevField()} className="previous">
           הקודם
        </button>
      </div>
    </div>
  );
};

export default FillPanel;
