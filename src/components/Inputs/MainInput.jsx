import React from "react";
import SignatureCanvas from "react-signature-canvas";

const MainInput = ({
  mainInputRef,
  handleInputText,
  handleSignatureData,
  currentValue,
  currentInputObj,
  onSetFocusToNextField,
}) => {
  function handleKeyPress(event) {
    if (event.key === "Enter") {
      onSetFocusToNextField();
    }
  }

  const handleEndSignature = () => {
    // Get the data URL of the drawing
    handleSignatureData(mainInputRef.current.toDataURL());
  };

  console.log(currentInputObj.type)

  if (currentInputObj.type === "signature") {
    return (
      <div>
       <SignatureCanvas
          ref={mainInputRef}
          penColor="#0d2d6d"
          backgroundColor= 'transparent'
          canvasProps={{width:150,height:70}}
          onEnd={handleEndSignature}
        />
      </div>
    );
  }

  return (
    <input
      className="main-input"
      type={currentInputObj.type}
      placeholder={"הקלד " + currentInputObj.description}
      onChange={(e) => handleInputText(e.target.value)}
      value={currentValue[currentInputObj.id]}
      //value={inputText}
      ref={mainInputRef}
      style={{ direction: "rtl" }}
      onKeyDown={handleKeyPress}
    />
  );
};

export default MainInput;
