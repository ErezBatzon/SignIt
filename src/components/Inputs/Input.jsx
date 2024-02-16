import { useEffect, useRef } from "react";

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

    if (input.type === "signature") {
      const canvas = inputRef.current;
      const ctx = canvas.getContext("2d");

      const image = new Image();
      image.onload = () => {
        canvas.width = image.width; // Multiply by a factor to enlarge
        canvas.height = image.height; // Multiply by a factor to enlarge
        ctx.drawImage(image, 0, 0);
    };
      image.src = currentValue[input.id];
    }
  }, [activeInput]);



  if (input.type === "signature") {
    return (
      <canvas
        className={`signature ${input.required === 1 ? 'required' : ''}`}
        tabIndex={0}
        ref={inputRef}
        required = {input.required === 1}
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

  return (
    <input
      className="pdf-input"
      type={input.type}
      placeholder={input.description}
      style={{
        position: "absolute",
        left: `${input.positionX}%`,
        top: `${input.positionY}%`,
        width: `${input.width}%`,
        height: `${"1.4"}%`,
      }}
      readOnly
      ref={inputRef}
      value={currentValue[input.id]}
      required = {input.required === 1}
      autoFocus={input.id === 1}
      onFocus={() => onSetFocusToSelectedField(input)}
    ></input>
  );
};

export default Input;
