import React, { useRef, useState, useEffect } from "react";
import MainInput from "../Inputs/MainInput";

const FillPanel = ({
  onSetFocusToNextField,
  onSetFocusToPrevField,
  handleInputText,
  handleSignatureData,
  mainInputRef,
  currentInputObj,
  currentValue,
  dataLength,
  isSimpleFill,
  onFinished,
  data,
  activeInput,
}) => {

  useEffect(() => {
    if (!mainInputRef) {
      if (!isSimpleFill) {
        mainInputRef.current.classList.add("main-input-zoon-in");
        setTimeout(() => {
          mainInputRef.current.classList.remove("main-input-zoon-in");
          mainInputRef.current.classList.add("zoom-out");
        }, 200);

        return () => {
          mainInputRef.current?.classList.remove(
            "main-input-zoon-in",
            "zoom-out"
          );
        };
      }
    }
  }, [currentInputObj]);

  const finished = currentInputObj.id === dataLength;

  return (
    <div className="fill-field-panel">
      <div className="input-filler">
        {/* <p className="description">
          מילוי שדה:{" "}
          <span className="input-description">
            {currentInputObj.description}
          </span>
        </p> */}
        <MainInput
          mainInputRef={mainInputRef}
          handleInputText={handleInputText}
          handleSignatureData={handleSignatureData}
          currentValue={currentValue}
          currentInputObj={currentInputObj}
          onSetFocusToNextField={onSetFocusToNextField}
          data={data}
          activeInput={activeInput}
        />
      </div>
      <div className="fill-navigation-buttons">
        {finished ? (
          <button onClick={() => onFinished()} className="Finished">
            סיום
          </button>
        ) : (
          <button onClick={() => onSetFocusToNextField()} className="next">
            הבא
          </button>
        )}
        <button onClick={() => onSetFocusToPrevField()} className="previous">
          הקודם
        </button>
      </div>
    </div>
  );
};

export default FillPanel;
