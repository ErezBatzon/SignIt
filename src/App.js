import { useState, useRef } from "react";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "./App.css";
import FillPanel from "./components/Sections/FillPanel";
import PdfViewer from "./components/Sections/PdfViewer";
import data from "./data/inputs";
import Navbar from "./components/Sections/Navbar";
import SimpleFill from "./components/Sections/SimpleFill/SimpleFill";

const App = () => {
  const [activeInput, setActiveInput] = useState(1);
  const [currentInputObj, setCurrentInputObj] = useState(data[0]);
  const mainInputRef = useRef(null);
  const [inputValues, setInputValues] = useState({});
  const [isSimpleFill, setSimpleFill] = useState(false);

  const dataLength = data.length;

  const pdfViewer = useRef(null)

  function onSetFocusToNextField() {
    setActiveInput((prevInput) => prevInput + 1);
  }

  function onSetFocusToPrevField() {
    if (activeInput === 1) {
      return;
    }
    setActiveInput((prevInput) => prevInput - 1);
  }
  function onFinished(){
    pdfViewer.current.CallChildFunc();
  }

  // Function to update input values
  const handleInputChange = (id, value) => {
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [id]: value,
    }));
  };

  function onSetFocusToSelectedField(input) {
    if (isSimpleFill) {
      setActiveInput(input.id);
      setCurrentInputObj(input);
    } else {
      setActiveInput(input.id);
      setCurrentInputObj(input);
      mainInputRef.current.focus();
      mainInputRef.current.value = inputValues[input.id] || "";
    }
  }

  function onSetSimpleFill(isChecked) {
    setSimpleFill(isChecked);
  }

  function handleInputText(activeInput, text) {
    handleInputChange(activeInput, text);
  }

  function handleSignatureData(activeInput, data) {
    handleInputChange(activeInput, data);
  }

  return (
    <div className="page">
      <Navbar
        inputValues={inputValues}
        data={data}
        onSetSimpleFill={onSetSimpleFill}
      />
      {isSimpleFill ? (
        <SimpleFill
          input={currentInputObj}
          data={data}
          activeInput={activeInput}
          onSetFocusToSelectedField={(input) =>
            onSetFocusToSelectedField(input)
          }
          currentValue={inputValues}
          handleSignatureData={(data) => handleSignatureData(activeInput, data)}
          handleInputText={(text) => handleInputText(activeInput, text)}
        />
      ) : (
        <>
          <PdfViewer
            ref={pdfViewer}
            data={data}
            activeInput={activeInput}
            onSetFocusToSelectedField={(input) =>
              onSetFocusToSelectedField(input)
            }
            currentValue={inputValues}
          />
          <FillPanel
            onSetFocusToNextField={onSetFocusToNextField}
            onSetFocusToPrevField={onSetFocusToPrevField}
            handleInputText={(text) => handleInputText(activeInput, text)}
            handleSignatureData={(data) =>
              handleSignatureData(activeInput, data)
            }
            mainInputRef={mainInputRef}
            currentInputObj={currentInputObj}
            currentValue={inputValues}
            dataLength={dataLength}
            isSimpleFill={isSimpleFill}
            onFinished={onFinished}
          />
        </>
      )}
    </div>
  );
};

export default App;
