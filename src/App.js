import { useState, useRef } from "react";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "./App.css";
import FillPanel from "./components/FillPanel";
import PdfViewer from "./components/PdfViewer";
import PdfViewer2 from "./components/PdfViewer2";
import data from "./data/inputs";
import Navbar from "./components/Navbar";

const App = () => {
  const [activeInput, setActiveInput] = useState(1);
  const [currentInputObj, setCurrentInputObj] = useState(data[0]);
  const mainInputRef = useRef(null);
  const [inputValues, setInputValues] = useState({});

  function onSetFocusToNextField() {
    setActiveInput((prevInput) => prevInput + 1);
  }
  
  function onSetFocusToPrevField() {
    if (activeInput === 1) {
      return;
    }
    setActiveInput((prevInput) => prevInput - 1);
  }

  // Function to update input values
  const handleInputChange = (id, value) => {
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [id]: value,
    }));
  };


  function onSetFocusToSelectedField(input) {
    setActiveInput(input.id);
    setCurrentInputObj(input);
    mainInputRef.current.focus();
    mainInputRef.current.value = inputValues[input.id] || ''
  }


  function handleInputText(activeInput, text) {
    handleInputChange(activeInput, text);
  }

  function handleSignatureData(activeInput, data) {
    handleInputChange(activeInput, data);
  }

  //console.log(mainInputRef.current)

  return (
    <div className="page">
      <Navbar />
      <PdfViewer
        data={data}
        activeInput={activeInput}
        onSetFocusToSelectedField={(input) => onSetFocusToSelectedField(input)}
        currentValue={inputValues}
      />
      <FillPanel
        onSetFocusToNextField={onSetFocusToNextField}
        onSetFocusToPrevField={onSetFocusToPrevField}
        handleInputText={(text) => handleInputText(activeInput, text)}
        handleSignatureData={(data) => handleSignatureData(activeInput,data)}
        mainInputRef={mainInputRef}
        currentInputObj={currentInputObj}
        currentValue={inputValues}
      />
    </div>
  );
};

export default App;
