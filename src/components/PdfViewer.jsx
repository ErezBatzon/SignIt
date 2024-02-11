import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
import { useState, useEffect } from "react";
import Input from "./Inputs/Input";

const PdfViewer = ({
  data,
  activeInput,
  onSetFocusToSelectedField,
  currentValue
}) => {
  const [numPages, setNumPages] = useState(null);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

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

  // const goToPrevPage = () =>
  //   setPageNumber(pageNumber - 1 <= 1 ? 1 : pageNumber - 1);

  // const goToNextPage = () =>
  //   setPageNumber(pageNumber + 1 >= numPages ? numPages : pageNumber + 1);

  // function onPageLoadSuccess() {
  //     setPageWidth(window.innerWidth);
  // }

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
      {/* <div className="top-navigation">
        <div className="navigation-buttons">
          <button onClick={goToNextPage} className="next">
            עמוד הבא
          </button>
          <button onClick={goToPrevPage} className="previous">
            עמוד קודם
          </button>
        </div>
        <div>
          <p>
            עמוד {pageNumber} מתוך {numPages}
          </p>
        </div>
      </div> */}
      <Document
        className="pdf-viewbox"
        file="Test.pdf"
        onLoadSuccess={onDocumentLoadSuccess}
      >
        {/* <Page
          pageNumber={pageNumber}
          renderAnnotationLayer={false}
          renderTextLayer={false}
          //onLoadSuccess={onPageLoadSuccess}
          //width={Math.max(windowWidth * 0.7 * ratio,390)}
          width={ratio * windowWidth * 0.75}
        >
          {inputs}
        </Page> */}

        {Array.from(new Array(numPages), (el, index) => (
          <div className="pdf-page" key={`page_wrapper_${index + 1}`}>
            <p>
              עמוד {index + 1} מתוך {numPages}
            </p>
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              renderAnnotationLayer={false}
              renderTextLayer={false}
              width={windowWidth <= 600 ? windowWidth*0.85 : ratio * windowWidth * 0.75} // Adjust width as needed
            >
              {handleInputs(index +1)}
            </Page>
          </div>
        ))}
      </Document>
      <div style={{height:'200px',}}/>
    </div>
  );
};

export default PdfViewer;
