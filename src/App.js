import { useState, useRef } from "react";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "./App.css";
import FillPanel from "./components/Sections/FillPanel/FillPanel";
import PdfViewer from "./components/Sections/PdfViewer/PdfViewer";
import data from "./data/inputs";
import Navbar from "./components/Sections/Navbar/Navbar";
import SimpleFill from "./components/Sections/SimpleFill/SimpleFill";

const App = () => {
  const [activeInput, setActiveInput] = useState(1);
  const [currentInputObj, setCurrentInputObj] = useState(data[0]);
  const mainInputRef = useRef(null);
  const [inputValues, setInputValues] = useState(
    data.reduce((acc, curr) => {
      acc[curr.id] = undefined;
      return acc;
    }, {})
  );
  const [isSimpleFill, setSimpleFill] = useState(false);

  const dataLength = data.length;

  const pdfViewer = useRef(null);

  function onSetFocusToNextField() {
    setActiveInput((prevInput) => prevInput + 1);
  }

  function onSetFocusToPrevField() {
    if (activeInput === 1) {
      return;
    }
    setActiveInput((prevInput) => prevInput - 1);
  }
  function onFinished() {
    const emptyIds = Object.entries(inputValues)
      .filter(([id, value]) => (value === "" || value === undefined))
      .map(([id, value]) => parseInt(id));

    const requiredEmptyIds = emptyIds
      .filter((id) => {
        const matchingField = data.find((item) => item.id === id);
        return matchingField && matchingField.required === 1;
      })
      .map((id) => {
        const matchingField = data.find((item) => item.id === id);
        return { id: matchingField.id, description: matchingField.description };
      });

    if (requiredEmptyIds.length !== 0) {
      window.alert(
        "יש למלא את השדות הבאים: " +
          requiredEmptyIds.map((value) => value.description)
      );
    } else {
      pdfViewer.current.CallChildFunc();
    }
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
      mainInputRef.current.value = inputValues[input.id] || '';
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
          data={data}
          onSetFocusToSelectedField={(input) =>
            onSetFocusToSelectedField(input)
          }
          currentValue={inputValues}
          handleSignatureData={(data) => handleSignatureData(activeInput, data)}
          handleInputText={(text) => handleInputText(activeInput, text)}
          onFinished={onFinished}
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
            data={data}
            activeInput={activeInput}
            onChecked={(checked) => handleInputText(activeInput, checked ? checked : undefined)}
          />
        </>
      )}
    </div>
  );
};

export default App;
