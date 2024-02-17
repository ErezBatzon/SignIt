import React, { useRef, useState, useEffect } from "react";
import MainInput from "../../Inputs/Main-Input/Main-Input";
import "./FillPanel.css";
import { GrFormPreviousLink } from "react-icons/gr";
import { GrFormNextLink } from "react-icons/gr";
import { GrCheckmark } from "react-icons/gr";

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
  onChecked,
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
        {
          <p className="description">
            {currentInputObj.required === 1 && "* שדה חובה"}{" "}
            {currentInputObj.type === "checkbox" && currentInputObj.description}
          </p>
        }
        <MainInput
          mainInputRef={mainInputRef}
          handleInputText={handleInputText}
          handleSignatureData={handleSignatureData}
          currentValue={currentValue}
          currentInputObj={currentInputObj}
          onSetFocusToNextField={onSetFocusToNextField}
          data={data}
          activeInput={activeInput}
          onChecked={onChecked}
        />
      </div>
      <div className="fill-navigation-buttons">
        {finished ? (
          <button
            type="submit"
            onClick={() => onFinished()}
            className="Finished"
          >
            סיום
            <GrCheckmark
              style={{
                backgroundColor: "transparent",
                color: "black",
                marginLeft: "5",
                marginBottom: 2,
              }}
            />
          </button>
        ) : (
          <button onClick={() => onSetFocusToNextField()} className="next">
            <GrFormPreviousLink
              style={{
                backgroundColor: "transparent",
                color: "black",
                marginRight: "5",
                marginBottom: 2,
              }}
            />
            הבא
          </button>
        )}
        <button onClick={() => onSetFocusToPrevField()} className="previous">
          הקודם
          <GrFormNextLink
            style={{
              backgroundColor: "transparent",
              color: "black",
              marginLeft: "5",
              marginBottom: 2,
            }}
          />
        </button>
      </div>
    </div>
  );
};

export default FillPanel;
