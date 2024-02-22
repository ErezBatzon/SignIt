import React, { useRef, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import { RiDeleteBin6Line } from "react-icons/ri";
import "./Main-Input.css";

const MainInput = ({
  mainInputRef,
  handleInputText,
  handleSignatureData,
  currentValue,
  currentInputObj,
  onSetFocusToNextField,
  data,
  activeInput,
  onChecked,
}) => {
  const signatureRef = useRef(null);

  function handleKeyPress(event) {
    if (event.key === "Enter") {
      onSetFocusToNextField();
    }
  }

  const handleEndSignature = () => {
    // Get the data URL of the drawing
    handleSignatureData(signatureRef.current.toDataURL());
  };

  function clearSignature() {
    signatureRef.current.clear();
    handleSignatureData(null);
  }

  useEffect(() => {
    data.forEach((input) => {
      if (input.type === "signature") {
        signatureRef.current?.fromDataURL(currentValue[input.id]);
        if (signatureRef.current) {
          signatureRef.current.canvasProps = { width: 150, height: 80 };
        }
      }
    });
  }, [activeInput]);

  const signatureInput = data.map((input) => {
    if (input.id === activeInput && input.type === "signature") {
      return (
        <div className="main-input-signature-container">
          <div
            key={input.id} // Add a unique key prop
            ref={mainInputRef}
            tabIndex={5}
            style={{
              backgroundColor: "white",
              borderRadius: "10px",
              width: 260,
              height: 110,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onKeyDown={handleKeyPress}
          >
            <SignatureCanvas
              ref={signatureRef}
              penColor="#0d2d6d"
              backgroundColor="transparent"
              canvasProps={{ width: 250, height: 100 }}
              onEnd={handleEndSignature}
            />
          </div>
          <RiDeleteBin6Line
            onClick={() => clearSignature()}
            style={{
              backgroundColor: "transparent",
              color: "white",
              marginLeft: "10",
            }}
          />
        </div>
      );
    }
    return null;
  });

  const isSignature = signatureInput.some((value) => value !== null);

  return (
    <>
      {!isSignature ? (
        <input
          className="main-input"
          type={currentInputObj.type}
          placeholder={"הקלד " + currentInputObj.description}
          onChange={
            currentInputObj.type !== "checkbox"
              ? (e) => handleInputText(e.target.value)
              : null
          }
          value={
            currentInputObj.type !== "checkbox" &&
            currentValue[currentInputObj.id]
          }
          //value={inputText}
          ref={mainInputRef}
          style={{ direction: "rtl" }}
          onKeyDown={handleKeyPress}
          checked={
            currentInputObj.type === "checkbox" &&
            currentValue[currentInputObj.id]
          }
          onClick={
            currentInputObj.type === "checkbox"
              ? (e) => onChecked(e.currentTarget.checked)
              : null
          }
        />
      ) : (
        signatureInput
      )}
    </>
  );
};

export default MainInput;
