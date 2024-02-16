import { useRef, useEffect } from "react";
import "./simple-fill.css";
import SignatureCanvas from "react-signature-canvas";
import { RiDeleteBin6Line } from "react-icons/ri";

const SimpleFill = ({
  input,
  activeInput,
  currentValue,
  onSetFocusToSelectedField,
  data,
  handleSignatureData,
  handleInputText,
  onFinished,
}) => {
  const signatureRef = useRef(null);

  const handleEndSignature = () => {
    // Get the data URL of the drawing
    handleSignatureData(signatureRef.current.toDataURL());
  };

  function clearSignature() {
    signatureRef.current.clear();
  };

  useEffect(() => {
    data.forEach((input) => {
      if (input.type === "signature") {
        signatureRef.current.fromDataURL(currentValue[input.id]);
        signatureRef.current.canvasProps = { width: 200, height: 80 };
      }
    });
  }, []);

  window.onload = function () {
    var date = new Date();
    var month = date.getMonth();
    var day = date.getDate();
    var year = date.getFullYear();
  };

  return (
    <div className="simple-fill">
      <div className="container">
        {data.map((input, index) => (
          <div className="input-container" key={input.id}>
            <label className="input-label" htmlFor="input">
              {input.description}
            </label>
            {input.type === "signature" ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "end",
                  backgroundColor: "transparent",
                }}
              >
                <RiDeleteBin6Line
                  onClick={() => clearSignature()}
                  style={{
                    backgroundColor: "transparent",
                    color: "black",
                    marginLeft: "10",
                  }}
                />
                <div
                  className={`signature-container ${
                    input.required === 1 ? "required" : ""
                  }`}
                  tabIndex={input.id}
                >
                  <SignatureCanvas
                    ref={signatureRef}
                    penColor="#0d2d6d"
                    backgroundColor="transparent"
                    canvasProps={{ width: 200, height: 70 }}
                    onEnd={handleEndSignature}
                    onBegin={() => {
                      //clearSignature();
                      onSetFocusToSelectedField(input);
                    }}
                    tabIndex={input.id}
                  />
                </div>
              </div>
            ) : (
              <input
                className="input"
                key={input.id}
                type={input.type}
                placeholder={input.placeholder}
                onChange={(e) => handleInputText(e.target.value)}
                value={currentValue[input.id]}
                required={input.required === 1}
                autoFocus={input.id === 1}
                onFocus={() => onSetFocusToSelectedField(input)}
              ></input>
              //<input type="date" id="date" />
            )}
          </div>
        ))}
      </div>
      <button onClick={() => onFinished()} className="finished-button">
        סיום
      </button>
    </div>
  );
};

export default SimpleFill;
