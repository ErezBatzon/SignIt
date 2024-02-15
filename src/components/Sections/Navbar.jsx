import React from "react";
import { PiSignatureDuotone } from "react-icons/pi";
import { TbSignature } from "react-icons/tb";
import { PiSignature } from "react-icons/pi";
import { LiaSignatureSolid } from "react-icons/lia";
import { PiSignatureLight } from "react-icons/pi";
import ProgressBar from "react-bootstrap/ProgressBar";
import Toggle from "../UI/Toggle";


const Navbar = ({inputValues,data,onSetSimpleFill}) => {
  
  const totalLength = data.length
  const valuesLength = Object.values(inputValues).filter(value => value !== null && value !== "").length;
  const now = (valuesLength/totalLength) * 100
  

  return (
    <div className="navbar">
      <p className="header">SignIt</p>
      <div className="progressbar">
        <ProgressBar now={now} min={0} max={100} variant="success"/>
      </div>
      <Toggle onSetSimpleFill={onSetSimpleFill}/>
    </div>
  );
};

export default Navbar;
