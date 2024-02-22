import { useEffect, useRef } from "react";
import "./Pdf-Input.css";

const Input = ({
  input,
  activeInput,
  onSetFocusToSelectedField,
  currentValue,
  ...props
}) => {
  const inputRef = useRef({});

  useEffect(() => {
    if (input.id === activeInput) {
      inputRef.current.focus();
      inputRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
      //console.log(inputRef.current)

      inputRef.current.classList.add("focused");
      inputRef.current.classList.add("zoom-in");
      setTimeout(() => {
        inputRef.current.classList.remove("zoom-in");
        inputRef.current.classList.add("zoom-out");
      }, 500);
    } else {
      inputRef.current.classList.remove("focused", "zoom-in", "zoom-out");
    }

    
  }, [activeInput]);

  useEffect(()=>{
    if (input.type === "signature") {
      const canvas = inputRef.current;
      const ctx = canvas.getContext("2d");

      const image = new Image();
      image.onload = () => {
        canvas.width = image.width; // Multiply by a factor to enlarge
        canvas.height = image.height; // Multiply by a factor to enlarge
        ctx.drawImage(image, 0, 0);
      };
      image.src = currentValue[input.id]
        ? currentValue[input.id]
        : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAABGCAYAAAAuP23NAAAAAXNSR0IArs4c6QAAAUhJREFUeF7t0jENAAAMw7CVP+mhyOcC6BF5ZwoEBRZ8ulTgwIIgKQBWktUpWAwkBcBKsjoFi4GkAFhJVqdgMZAUACvJ6hQsBpICYCVZnYLFQFIArCSrU7AYSAqAlWR1ChYDSQGwkqxOwWIgKQBWktUpWAwkBcBKsjoFi4GkAFhJVqdgMZAUACvJ6hQsBpICYCVZnYLFQFIArCSrU7AYSAqAlWR1ChYDSQGwkqxOwWIgKQBWktUpWAwkBcBKsjoFi4GkAFhJVqdgMZAUACvJ6hQsBpICYCVZnYLFQFIArCSrU7AYSAqAlWR1ChYDSQGwkqxOwWIgKQBWktUpWAwkBcBKsjoFi4GkAFhJVqdgMZAUACvJ6hQsBpICYCVZnYLFQFIArCSrU7AYSAqAlWR1ChYDSQGwkqxOwWIgKQBWktUpWAwkBcBKsjp9b5wAR6B4r9MAAAAASUVORK5CYII=";
    }
  },[currentValue[input.id]])

  if (input.type === "signature") {
    return (
      <canvas
        className={`signature ${input.required === 1 ? "required" : ""}`}
        tabIndex={0}
        ref={inputRef}
        required={input.required === 1}
        onFocus={() => onSetFocusToSelectedField(input)}
        style={{
          position: "absolute",
          left: `${input.positionX}%`,
          top: `${input.positionY}%`,
          width: `${input.width}%`,
          height: `${"5"}%`,
        }}
      />
    );
  }

  const width = input.type !== "checkbox" ? `${input.width}%` : "20px";

  return (
      <input
        className="pdf-input"
        type={input.type}
        placeholder={input.description}
        style={{
          position: "absolute",
          left: `${input.positionX}%`,
          top: `${input.positionY}%`,
          width: width,
          height: `${"2"}%`,
        }}
        readOnly
        onClick={input.type === "checkbox" ? (e) => e.preventDefault() : null}
        ref={inputRef}
        value={currentValue[input.id]}
        required={input.required === 1}
        autoFocus={input.id === 1}
        onFocus={() => onSetFocusToSelectedField(input)}
        checked={input.type === "checkbox" && currentValue[input.id]}
        tabIndex={input.id}
      ></input>
  );
};

export default Input;
