import { useRef, useEffect, useState } from "react";
import "./simple-fill.css";
import SignatureCanvas from "react-signature-canvas";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GrCheckmark } from "react-icons/gr";

const SimpleFill = ({
  currentValue,
  onSetFocusToSelectedField,
  data,
  handleSignatureData,
  handleInputText,
  onFinished,
}) => {

  const [canvasWidth,setCanvasWidth] = useState(window.innerWidth/4.5)

  useEffect(() => {
    const handleResize = debounce(() => {
      setCanvasWidth(window.innerWidth/4.5);
    }, 300); // Adjust debounce delay as needed

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [canvasWidth]);

  const debounce = (func, delay) => {
    let timer;
    return function (...args) {
      const context = this;
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(context, args), delay);
    };
  };


  const signatureRef = useRef(null);

  const handleEndSignature = () => {
    // Get the data URL of the drawing
    handleSignatureData(signatureRef.current.toDataURL());
  };

  function clearSignature() {
    signatureRef.current.clear();
    handleSignatureData(null);
  };

  useEffect(() => {
    data.forEach((input) => {
      if (input.type === "signature") {
        signatureRef.current.fromDataURL(currentValue[input.id]);
        signatureRef.current.canvasProps = { width: canvasWidth, height: 80 };
      }
    });
  }, [canvasWidth]);


  return (
    <div className="simple-fill">
      <div className="container">
        {data.map((input, index) => (
          <div className="input-container" key={input.id}>
            <label className="input-label" htmlFor="input">
              {input.required === 1 && '*'}
              {input.description}
            </label>
            {input.type === "signature" ? (
              <div className="signature-parent-container">
                <RiDeleteBin6Line
                  onClick={() => clearSignature()}
                  width={30}
                  style={{
                    backgroundColor: "transparent",
                    color: "black",
                    marginLeft: "5",
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
                    canvasProps={{ width: canvasWidth, height: 60 }}
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
            )}
          </div>
        ))}
      </div>
      <button onClick={() => onFinished()} className="finished-button">
      <GrCheckmark
            style={{
              backgroundColor: "transparent",
              color: "black",
              marginLeft: "5",
              marginBottom: 2,
            }}
          />
        סיום
      </button>
    </div>
  );
};

export default SimpleFill;
