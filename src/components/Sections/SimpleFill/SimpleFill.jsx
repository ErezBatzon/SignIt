import {useRef,useEffect} from "react";
import "./simple-fill.css";
import SignatureCanvas from "react-signature-canvas";
import { clear } from "@testing-library/user-event/dist/clear";

const SimpleFill = ({
  input,
  activeInput,
  currentValue,
  onSetFocusToSelectedField,
  data,
  handleSignatureData,
  handleInputText,
  onFinished
}) => {

  const signatureRef = useRef(null);

  const handleEndSignature = () => {
    // Get the data URL of the drawing
    handleSignatureData(signatureRef.current.toDataURL());
  };


  const clearSignature = () => {
    //signatureRef.current.clear();
  };

  useEffect(() => {
    data.forEach(input => {
      if (input.type === 'signature') {
        signatureRef.current.fromDataURL(currentValue[input.id]);
        signatureRef.current.canvasProps={width:200,height:80}
      }
    });
  }, []);

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
                className={`signature-container ${input.required === 1 ? 'required' : ''}`}
              >
                <SignatureCanvas
                  ref={signatureRef}
                  penColor="#0d2d6d"
                  backgroundColor="transparent"
                  canvasProps={{ width: 200, height: 70 }}
                  onEnd={handleEndSignature}
                  onBegin={() => {
                    clearSignature();
                    onSetFocusToSelectedField(input)
                  }}
                />
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
      <button onClick={()=> onFinished()} className="finished-button">
            סיום
          </button>
    </div>
  );
};

export default SimpleFill;
