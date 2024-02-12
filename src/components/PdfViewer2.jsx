import React, { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import Input from "./Inputs/Input";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PdfViewer2 = () => {
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);
  const canvasRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const canvasContainer = document.getElementById("canvas-container");
      if (canvasContainer) {
        setCanvasWidth(canvasContainer.offsetWidth);
        setCanvasHeight(canvasContainer.offsetHeight);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initialize canvas size
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleInputChange = (inputId, value) => {
    // Handle input change
  };

  const renderInputsOnCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Render input fields onto canvas
    // Iterate over input fields and use canvas API to draw them
    // Example:
    // ctx.fillText("Your Text", x, y);
  };

  const handlePageRender = () => {
    renderInputsOnCanvas();
  };

  return (
    <div id="pdf-container">
      <div id="canvas-container">
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          style={{ position: "absolute", top: 0, left: 0 }}
        />
        <Document
          file='Test.pdf'
          onLoadSuccess={onDocumentLoadSuccess}
          options={{ workerSrc: "/pdf.worker.js" }}
        >
          {Array.from(new Array(numPages), (_, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              width={canvasWidth}
              onRenderSuccess={handlePageRender}
            />
          ))}
        </Document>
      </div>
      {Array.from(new Array(numPages), (_, index) => (
        <input
          key={`input_${index + 1}`}
          onPageChange={setCurrentPage}
          page={index + 1}
          onChange={handleInputChange}
        />
      ))}
    </div>
  );
};

export default PdfViewer2;
