import {useState,useRef} from 'react'
import Input from './Input';

const DraggedInput = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [activeField, setActiveField] = useState(1)
    
  
    const handleDragStart = (e) => {
      e.preventDefault();
      const startX = e.clientX - position.x;
      const startY = e.clientY - position.y;
  
      const handleDragMove = (e) => {
        const newX = e.clientX - startX;
        const newY = e.clientY - startY;
        if (newX < 0 || newY < 0 || newX > window.innerWidth * 0.9) return;
  
        setPosition({ x: newX, y: newY });
      };
  
      const handleDragEnd = () => {
        window.removeEventListener("mousemove", handleDragMove);
        window.removeEventListener("mouseup", handleDragEnd);
      };
  
      window.addEventListener("mousemove", handleDragMove);
      window.addEventListener("mouseup", handleDragEnd);
    };
  
    const handleInputClick = (e) => {
      e.stopPropagation(); // Prevents document-wide click event from firing
    };

  
    return (
      <>
      </>
    );
}

export default DraggedInput