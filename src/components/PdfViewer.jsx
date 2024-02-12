import { Document, Page, pdfjs } from "react-pdf/dist/esm/entry.webpack";
import { useState, useEffect, useRef } from "react";
import Input from "./Inputs/Input";
import { saveAs } from "file-saver";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import * as fontkit from "fontkit";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PdfViewer = ({
  data,
  activeInput,
  onSetFocusToSelectedField,
  currentValue,
}) => {
  const [numPages, setNumPages] = useState(null);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const canvasRef = useRef(null);

  const [ratio, setRatio] = useState(1);

  function handleInputs(page) {
    return data.map(
      (input, index) =>
        input.page === page && (
          <Input
            key={input.id}
            input={input}
            activeInput={activeInput}
            currentValue={currentValue}
            onSetFocusToSelectedField={onSetFocusToSelectedField}
          />
        )
    );
  }

  useEffect(() => {
    const handleResize = debounce(() => {
      setWindowWidth(window.innerWidth);
      setRatio(window.devicePixelRatio !== 2 ? window.devicePixelRatio : 1);
    }, 300); // Adjust debounce delay as needed

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const debounce = (func, delay) => {
    let timer;
    return function (...args) {
      const context = this;
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(context, args), delay);
    };
  };

  const handleScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const pageHeight = window.innerHeight;

    // Calculate the current page based on scroll position
    const currentPage = Math.floor(scrollTop / pageHeight) + 1;
    if (currentPage > numPages) return;

    setCurrentPageNumber(currentPage);
  };

  const handlePageRender = (page, ctx) => {
    return new Promise((resolve) => {
      // Draw input fields onto the canvas
      data.forEach((input) => {
        if (input.page === page) {
          // Draw input on canvas
          ctx.fillText("Hello", 100, 100); // Example drawing text input
        }
      });

      // Resolve the promise to indicate that rendering is complete for this page
      resolve();
    });
  };

  const handleSavePdf = async () => {
    const existingPdfBytes = await fetch("Test.pdf").then((res) =>
      res.arrayBuffer()
    );
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    pdfDoc.registerFontkit(fontkit);
    const fontBytes = await fetch("Arial.ttf").then((res) => res.arrayBuffer());
    const customFont = await pdfDoc.embedFont(fontBytes);

    const pages = pdfDoc.getPages()
    for (let i = 1; i <= numPages; i++) {
      //const [page] = await pdfDoc.copyPages(pdfDoc, [i - 1]);
        data.forEach((input) => {
          if (input.page === i) {
            const x = 100;
            const y = pages[i-1].getHeight() - 100; // Invert Y-axis
            const text = "דגכעדגדג";
            console.log("Here")
            // Draw text on the page using Helvetica font
            pages[i-1].drawText(text, {
              x,
              y,
              size: 12,
              font: customFont,
              color: rgb(0.1, 0.5, 0.7),
            });
          }
        });
    }

    const pdfBytes = await pdfDoc.save();

    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    saveAs(blob, "merged_pdf_with_inputs.pdf");
  };

  useEffect(() => {
    // Add event listener for scroll
    window.addEventListener("scroll", handleScroll);

    // Remove event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [numPages]); // Empty dependency array to ensure effect runs only once

  return (
    <div className="main-section">
      <Document
        className="pdf-viewbox"
        file="Test.pdf"
        onLoadSuccess={onDocumentLoadSuccess}
      >
        {Array.from(new Array(numPages), (el, index) => (
          <div className="pdf-page" key={`page_wrapper_${index + 1}`}>
            <button onClick={handleSavePdf}>Save PDF with Inputs</button>
            <p>
              עמוד {index + 1} מתוך {numPages}
            </p>
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              renderAnnotationLayer={false}
              renderTextLayer={false}
              width={
                windowWidth <= 600
                  ? windowWidth * 0.85
                  : ratio * windowWidth * 0.75
              } // Adjust width as needed
              onRenderSuccess={() => handlePageRender(index + 1)}
            >
              {handleInputs(index + 1)}
            </Page>
          </div>
        ))}
      </Document>
      <canvas
        ref={canvasRef}
        style={{ display: "none" }} // Hide canvas from UI
      />
      <div style={{ height: "200px" }} />
    </div>
  );
};

export default PdfViewer;
