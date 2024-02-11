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
      //inputRef.current.focus();

      // Scroll the input into view only if it's not already visible
      // if (input.type === "signature") {
      //   inputRef.current.scrollIntoView({
      //     behavior: "smooth",
      //     block: "center",
      //     inline: "nearest",
      //   })
      //   inputRef.current.focus();
      // } else {
      inputRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
      inputRef.current.focus();
      //}

      //onSetFocusToSelectedField(input);
      //console.log(input);

      //if (input.type !== "signature") {
      //inputRef.current.focus();
      inputRef.current.classList.add("focused");
      inputRef.current.classList.add("zoom-in");
      setTimeout(() => {
        inputRef.current.classList.remove("zoom-in");
        inputRef.current.classList.add("zoom-out");
      }, 500);
      //}
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
        className="signature"
        tabIndex={0}
        ref={inputRef}
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
      placeholder={input.placeholder}
      style={{
        position: "absolute",
        left: `${input.positionX}%`,
        top: `${input.positionY}%`,
        width: `${input.width}%`,
        height: `${"1.1"}%`,
      }}
      readOnly
      ref={inputRef}
      value={currentValue[input.id]}
      autoFocus={input.id === 1}
      onFocus={() => onSetFocusToSelectedField(input)}
    ></input>
  );
};

export default Input;
