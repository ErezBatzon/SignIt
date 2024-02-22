import { Document, Page, pdfjs } from "react-pdf/dist/esm/entry.webpack";
import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import Input from "../../Inputs/Pdf-Input/Pdf-Input";
import { saveAs } from "file-saver";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import * as fontkit from "fontkit";
import "./PdfViewer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PdfViewer = forwardRef(
  ({ data, activeInput, onSetFocusToSelectedField, currentValue }, ref) => {
    useImperativeHandle(ref, () => ({
      CallChildFunc() {
        handleSavePdf();
      },
    }));

    const [pdfBase64, setPdfBase64] = useState('')

    useEffect(() => {
      fetch("https://localhost:7030/api/Sign").then((response) =>
      response.json()  
      ).then(data => {
        setPdfBase64(data.base64);
      });
    }, []);

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

    // const handlePageRender = (page, ctx) => {
    //   return new Promise((resolve) => {
    //     // Draw input fields onto the canvas
    //     data.forEach((input) => {
    //       if (input.page === page) {
    //         // Draw input on canvas
    //         ctx.fillText("Hello", 100, 100); // Example drawing text input
    //       }
    //     });

    //     // Resolve the promise to indicate that rendering is complete for this page
    //     resolve();
    //   });
    // };

    const handleSavePdf = async () => {
      const existingPdfBytes = await fetch("Test.pdf").then((res) =>
        res.arrayBuffer()
      );
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      pdfDoc.registerFontkit(fontkit);
      const fontBytes = await fetch("Arial.ttf").then((res) =>
        res.arrayBuffer()
      );
      const customFont = await pdfDoc.embedFont(fontBytes);

      const pages = pdfDoc.getPages();
      for (let i = 1; i <= numPages; i++) {
        //const [page] = await pdfDoc.copyPages(pdfDoc, [i - 1]);
        let text = "";
        data.forEach(async (input) => {
          if (input.page === i) {
            const x = input.positionX * 5.969818181818182;
            const y = pages[i - 1].getHeight() - input.positionY * 8.58;

            if (input.type === "signature") {
              const signatureImage = await pdfDoc.embedPng(
                currentValue[input.id]
              );
              const y = pages[i - 1].getHeight() - input.positionY * 8.8;
              pages[i - 1].drawImage(signatureImage, {
                x,
                y,
                height: 50,
                width: input.width * 5.969,
              });
            } else if (input.type === "checkbox") {
              if (currentValue[input.id]) {
                const checkbox = await pdfDoc.embedPng(
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAANmAAADZgBy8dwCwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAABbTSURBVHic7d1drK15Ydfx79kHhjqARRrDUKzSFzieGGrbBGNEQVu1QK2mCTZRI1famPSCC73wxrQXxmhiYrywN8aXYi9abTRpay+kvBUGQUso1RgrLaIIRMBKO8wgdJjxYs1h9pyz9zn75b/W86zn//kkvzBzBjjPPntNfr/nZa1dAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABH5sbSBwAAC3hB9a3Vq6pvqV5SPVz9zupm9ZXqt6rHqs9VH3sm/2uJg90HAwCAGfye6g3V65/Jq6uTK/z/PF79UvXeZ/LB6olBxwgADPCK6m3V+6unqqf3kC9VP1u9td0VBABgATeq763eUX21/ZT+efm/1T+ofu/ev0oAoNrdt/+L1S932NI/K1+p3l79gb1+xQAwude2uxe/dPHfna+2GwK/e39fOgDM52XtCnZf9/dH5XPVD+XBewC4tu+pPt3y5X6ZvKN6ZB9/GACwdc+rfrTDP+A3Kv+73UOKAMAFvaTde++XLvHr5sl2b08EAB7g5dVHWr68R+Yf5rkAADjXreoTLV/Y+8g/bXdbAwA45Vb1qZYv6n3mX2UEAMDXzFD+RgAAnDJT+RsBANCc5W8EADC1mcvfCABgSsrfCABgMsrfCABgMsrfCABgMsrfCABgMsrfCABgMsrfCABgMsrfCABgMsrfCABgMsrfCABgMsrfCABgMsrfCABgMsrfCABgMsrfCABgMrerz7R8Mc6Un6hOLvLNAYB9cOa/XP7RBb4/Vd286H8RAC7gVvWu6huXPpBJvbb6UvXo0gcCwDxc9l9Hnqre8oDvFQAM4bL/uvKF6pvv+x0DgGtS/uvMf6geOu+b5hkAAK7jdvXu6uVLHwj3eEW7nn/X0gcCwLY4819/vvzM9wkAhlD+x5N/d873EAAuxdP+x5c/d+Z3EgAuyJn/ceaj1Y3T30gPAQJwUT7k53i9rPpg9WtLHwgAx8WZ//Hn3fd8VwHgPtzz306+48431S0AAO7nVvXOvM9/Kx6r3lF3PRAAAKe45789n6xeWT3l5wYDcJbb1XtS/lvzTdXrqgwAAO52q/qF6pGlD4S9eGMZAAA8l8v+2/f68gwAAM9S/nP4SvW7XAEAoNzzn8lD1WsNAADc85/P7zcAAObmsv+cXuWDgADmpfzn9XkDAGBOt9t9NrxP+JvT/zMAAObj4335kgEAMBeX/al60gAAmIfy546b3gUAMAfv8+e0EwMAYPu8z5+7PWYAAGyby/6cxQAA2DCX/TnPFw0AgG1y2Z/7+aQBALA9LvvzIB8zAAC2RflzEQYAwIa4589F/eqNpY8AgCGc+XNRX62+wRUAgOOn/LmMj1S/aQAAHDflz2W9t8oAADhe7vlzFe+o8gwAwHFy5s9VfK7da+ZJVwAAjo/y56r+ZfVkuQUAcGxc9uc6fvLOX7gFAHA8nPlzHR+tvrN6ulwBADgWyp/r+js9U/7lCgDAMVD+XNfH272OnrzzC64AAKybe/6M8Lc7Vf7lCgDAmjnzZ4QPV3+oeur0L7oCALBOyp8Rnqp+uLvKvwwAgDVy2Z9R/kn1obP+gVsAAOvizJ9Rfq36ruqxs/6hKwAA66H8GeXL1Q92TvmXAQCwFi77M9Jfb/djfwFYsVvVp9p9SIvIdfNjAbB6yl9G5ie74NV9DwECLOd2u3v+jyx9IGzCu6o3t7v//0AGAMAyPPDHSO+v3lR98aL/AwMA4PCUPyNduvzLAAA4NOXPSFcq/zIAAA5J+TPSlcu/DACAQ1H+jHSt8i8DAOAQlD8jXbv8ywAA2Dflz0hDyr8MAIB9Uv6MNKz8ywAA2Bflz0hDy78MAIB9UP6MNLz8ywAAGE35M9Jeyr8MAICRlD8j7a38ywAAGEX5M9Jey78MAIARlD8j7b38ywAAuC7lz0gHKf8yAACuQ/kz0sHKvwwAgKtS/ox00PIvAwDgKpQ/Ix28/MsAALgs5c9Ii5R/GQAAl6H8GWmx8i8DAOCilD8jLVr+ZQAAXITyZ6TFy78MAIAHUf6MtIryLwMA4H6UPyOtpvzLAAA4j/JnpFWVfxkAAGdR/oy0uvKvOln6AABWRvkz0vurN7ey8i9XAABOU/6MdKf8H1v6QM5iAADsKH9GWnX5lwEAUMqfsVZf/mUAACh/RjqK8i8DAJib8mekoyn/MgCAeSl/Rjqq8i8DAJiT8mekoyv/MgCA+Sh/RjrK8i8DAJiL8mekoy3/MgCAeSh/Rjrq8i8DAJiD8mekoy//MgCA7VP+jLSJ8i8DANg25c9Imyn/MgCA7VL+jLSp8i8DANgm5c9Imyv/MgCA7VH+jLTJ8i8DANgW5c9Imy3/MgCA7VD+jLTp8i8DANgG5c9Imy//MgCA46f8GWmK8i8DADhuyp+Rpin/MgCA46X8GWmq8i8DADhOyp+Rpiv/MgCA46P8GWnK8i8DADguyp+Rpi3/MgCA46H8GWnq8i8DADgOyp+Rpi//MgCA9VP+jKT8n2EAAGum/BlJ+Z9iAABrpfwZSfnfxQAA1kj5M5LyP4MBAKyN8mck5X8OAwBYE+XPSMr/PgwAYC2UPyMp/wcwAIA1UP6MpPwvwAAAlqb8GUn5X5ABACxJ+TOS8r8EAwBYivJnJOV/SQYAsATlz0jK/woMAODQlD8jKf8rMgCAQ1L+jKT8r8EAAA5F+TOS8r8mAwA4BOXPSMp/AAMA2Dflz0jKf5AtDYBXVK+uXlV9W/Wy6uHqJdULq8erJ57J/6k+UX3sVH774EcM23e7Xfk/svSBsAm/WH1f9cWlD2QLjnkAvLr67uqPVW9oNwCu6onqQ9V7n8mjGQRwXcqfkZT/5F5Rva3dJaCn95jfqN5e/cnq5CBfGWzLrepT7fffU5kn76teHFN6ffVz1Vc7/Avv16sfbnc7AXiw29VnWr40ZBt5b/WimM6frf59y78An64+W/2trFC4H+UvI6P8J/Tq6udb/sV3Vj5d/VBuDcDdXPaXkXl/Trim8nD196uvtPyL7yIvztfs548Bjo4zfxkZZ/6TuV19tOVfeJfJl9o9lHjM76aA63LmLyPjzH8yb2331o6lX3hXzb+pXjr8TwXWT/nLyCj/idysfqzlX3Qj8uvtPoAIZqH8ZWSU/0Qeqn6q5V90I/OZ6jtH/iHBSil/GRnlP5EXt/uEsKVfdPvIF9p9MiFslQf+ZGQ88DeRF1bvafkX3T7zePU9g/68YE2c+cvIOPOfyAzlfydGAFuj/GVklP9EZir/OzEC2ArlLyOj/CcyY/nfiRHAsVP+MjLKfyIzl/+dGAEcK+UvI6P8J6L8n40RwLFR/jIyyn8iyv/eGAEcC+UvI6P8J6L8z48RwNopfxkZ5T8R5f/gGAGslfKXkVH+E1H+F48RwNoofxkZ5T8R5X/5GAGshfKXkVH+E1H+V48RwNKUv4yM8p+I8r9+jACWovxlZJT/RJT/uBgBHJryl5FR/hN5YfXuln/RbSlGAIei/GVklP9ElP/+YgSwb8pfRkb5T0T57z9GAPui/GVklP9ElP/hYgQwmvKXkVH+E/m6PPB36Dxe/YkLfG/gQW5Xn2n517RsI79YvSimcLP66ZZ/0c0YVwK4Lmf+MjLO/Cdyo/rHLf+imzlGAFel/GVklP9k/kbLv+jE7QAuz2V/GRmX/Sfz2urLLf/Ck10er777vt8x2HHmLyPjzH8yX199vOVfePLcGAE8iPKXkVH+E/rxln/hydlxO4DzuOwvI+Oy/4T+SPVUy7/45Py4EsDdnPnLyDjzn9DN6iMt/+KTB8cI4A7lLyOj/Cf111r+xScXj9sBuOwvI+Oy/yRu3PX3z68+Vv2+BY6Fq3ui+v7qXUsfCAd3q933/RuXPhA24dHqTdVjSx8I+3dy19//hZT/MXq4+tncDpiN8mck5T+xG7n3f+zxTMA83POXkXHPf3JvaPkXoVw/ngnYPvf8ZWTc85/U6VsAf2mxo2Ckh6ufy5WArbpV/UL1yNIHwiY8Wn1f9cWlD4TDu/MQ4EPVp6tvWPBYGMuDgdvjnj8juec/uTtXAL435b81dx4MdDtgG25X70n5M8b7qjem/Kd2ZwD8qUWPgn1xO2AbXPZnJJf9qZ4dAG9Y9CjYJ28RPG4u+zOSy/58zY3qpdXnuvczAdgWzwQcH+XPSMqf5zip/nDKfwZ3rgT88YWPg4txz5+R3PPnHiftzjKYw8PVv83tgLVzz5+R3PPnTCfVq5Y+CA7KMwHr5rI/I7nsz7kMgDkZAeuk/BlJ+XNfJ9Urlj4IFuGZgHVxz5+R3PPngU7yAyBm5pmAdXDPn5Hc8+dCTvJDIGbndsCyXPZnJJf9ubAb1Veq5y99ICzuiXZnDe9Z+Dhmcrtd+TvzZ4T3VW/OmT8XdFI9tfRBsApuBxyWy/6M5LI/l3aSFwzPcjvgMFz2ZySX/bkSA4C7GQH7pfwZSflzZSd54XCvh6ufyVsER/NWP0byVj+u5aT6H0sfBKv0wjwTMJJ7/ozknj/XdlJ9bOmDYLXcDhjDZX9GctmfIQwAHsQIuB7lz0jKn2FOqv+y9EGwep4JuBr3/BnJPX+GulH9juoL1UMLHwvr90T1/e3OaLk/Z/6M5Myf4U6qL1W/tPSBcBTcDrgY5c9Iyp+9OHnmP9+76FFwTIyA+1P+jKT82Zs7A+DnFz0Kjo1nAs7mnj8juefPXt049Z8fr1653KFwhDwT8Cxn/ozkzJ+9u3MF4Onqp5Y8EI6S2wE7yp+RlD8HcePUX7+m+pWlDoSj9nj1Z5rzRwn7kb6M5Ef6cjAnp/76P+VSLlcz68cG+3hfRvLxvhzUyV1///cWOQq2YLbbAS77M5LL/hzcjTN+7cPVdx36QNiMGR4MVP6MpPxZxN1XAKp+5OBHwZZs/S2C3urHSN7qx2LOugJQu/u5bz7kgbA5W7wS4MyfkZz5s6jzBsC3Vf+5esEBj4Xt2dIIUP6MpPxZ3M1zfv032v1woDcc8FjYnudXb6k+UH1i2UO5ltvVu6uXL30gbML72pW/p/1Z1HlXAKqe1+5e5+sOcyhs2DFfCXDmz0jO/FmN+w2Aqm+qfrl66QGOhW07xhGg/BlJ+bMqZ70L4LRPVn+l3UcFw3Uc27sDPO3PSJ72Z3XOewbgtP9afT7vCuD6Hqp+sPpg9d8XPpb7uVW9M/f8GePRfLwvK3SRAVD1H9t93KvnAbiu51d/vvWOAJf9Gcllf1brogOgdp95/srqO/ZzKExkre8O8LQ/I3nan025Wf14u2cCRK6bx1vPzw64VX2q5f9MZBt5f/XiYGOMABmZNYwA5S8jo/zZNCNARmbJEaD8ZWSUP1MwAmRklhgByl9GRvkzFSNARuaQI0D5y8gof6ZkBMjIHGIEKH8ZGeXP1IwAGZl9jgDlLyOj/CEjQMZmHyNA+cvIKH84xQiQkRk5ApS/jIzyhzMYATIyI0aA8peRUf5wH0aAjMx1RoDyl5FR/nABN6u3t/y/sLKNXGUEKH8ZGeUPl2AEyMhcZgQofxkZ5Q9XYATIyFxkBCh/GRnlD9dgBMjI3G8EKH8ZGeUPAxgBMjJnjQDlLyOj/GEgI0BG5vQIUP4yMsqfzbt54N/v6epnqm+tvv3Avzfb8/zqLdVn2w3Lly97OGzE+6o3VV9c+kBgn24s9PverP5Z9ZcX+v0BzvJou/J/bOkDgX079BWAO+5cCfjm6g8udAwApyl/prLUACgjAFgP5c90lhwAZQQAy1P+TGnpAVBGALAc5c+01jAAyggADk/5M7W1DIAyAoDDUf5Mb00DoIwAYP+UP7S+AVBGALA/yh+escYBUEYAMJ7yh1PWOgDKCADGUf5wlzUPgDICgOtT/nCGtQ+AMgKAq1P+cI5jGABlBACXp/zhPo5lAJQRAFyc8ocHOKYBUEYA8GDKHy7g2AZAGQHA+ZQ/XNAxDoAyAoB7KX+4hGMdAGUEAM9S/nBJxzwAyggAlD9cybEPgDICYGbKH65oCwOgjACYkfKHa9jKACgjAGai/OGatjQAygiAGSh/GGBrA6CMANgy5Q+DbHEAlBEAW6T8YaCtDoAyAmBLlD8MtuUBUEYAbIHyhz3Y+gAoIwCOmfKHPZlhAJQRAMdI+cMezTIAygiAY6L8Yc9mGgBlBMAxUP5wALMNgDICYM2UPxzIjAOgjABYI+UPBzTrACgjANZE+cOBzTwAygiANVD+sIDZB0AZAbAk5Q8LMQB2jAA4POUPCzIAnmUEwOEof1iYAfBcRgDsn/KHFTAA7mUEwP4of1gJA+BsRgCMp/xhRQyA8xkBMI7yh5UxAO7vzgj4lurbFz4WOFbKH1bIAHgwIwCuTvnDShkAF2MEwOUpf1gxA+DijAC4OOUPK2cAXI4RAA+m/OEIGACXZwTA+ZQ/HAkD4GqMALiX8ocjYgBcnREAz1L+cGQMgOsxAkD5w1EyAK7PCGBmyh+OlAEwhhHAjD6Q8oejZQCMYwQwkw9Ub0z5w9EyAMYyApiB8ocNMADGMwLYMuUPG2EA7IcRwBYpf9gQA2B/jAC2RPnDxhgA+2UEsAXKHzbIANg/I4BjpvxhowyAwzACOEbKHzbMADgcI4Bjovxh4wyAwzICOAbKHyZgAByeEcCaKX+YhAGwDCOANVL+MBEDYDlGAGui/GEyBsCyjADWQPnDhAyA5RkBLEn5w6QMgHUwAliC8oeJGQDrYQRwSMofJmcArIsRwCEof8AAWCEjgH1S/kBlAKyVEcA+KH/gawyA9TICGEn5A89hAKybEcAIyh+4hwGwfkYA16H8gTMZAMfBCOAqlD9wLgPgeBgBXIbyB+7LADguRgAXofwBNupm9S/aDQKR03m0enEAbJYRIHdH+QNMwgiQO1H+AJMxAkT5A0zKCJg3yh9gckbAfFH+AFRGwExR/gA8hxGw/Sh/AM5kBGw3yh+A+zICthflD8CFGAHbifIH4FKMgOOP8gfgSoyA443yB+BajIDji/IHYAgj4Hii/AEYyghYf5Q/AHthBKw3yh+AvTIC1hflD8BBGAHrifIH4KCMgOWj/AFYhBGg/AGYlBGg/AGYlBGg/AGYlBGg/AGYlBGg/AGYlBGg/AGYlBGg/AGYlBGg/AGYlBGg/AGYlBGg/AGYlBGg/AGYlBGg/AGYlBGg/AGYlBGg/AGYlBGg/AGYlBGg/AGY1M3qJ1q+iJU/ABzYjCNA+QNAc40A5Q8Ap8wwApQ/AJxhyyNA+QPAfWxxBCh/ALiALY0A5Q8Al7CFEaD8AeAKjnkEKH8AuIZjHAHKHwAGOKYRoPwBYKBjGAHKHwD2YM0jQPkDwB49r3p7yxf+6bwz5Q8Ae3ej+rstX/xPV/+6+rr9frkAwGlvrR5rmeL/7epHq5N9f5EAwL1uVx/qsOX/q9XrDvHFAQDnO6n+avXZ9lv8j1V/s3roMF8WAHARL6zeVv3Pxhb/56sfqV56uC8FALism9Wfrv559bmuVvq/Vf109QPVCw569AArdmPpA4ALulG9pvqj7Z4XeHX1SPWi6iXVb1aPtxsK/63d/f0PVB+unlzgeAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABjp/wMJb3M7WJ5T9AAAAABJRU5ErkJggg=="
                );
                const y = pages[i - 1].getHeight() - input.positionY * 8.8;
                pages[i - 1].drawImage(checkbox, {
                  x,
                  y,
                  height: 15,
                  width: 15,
                });
              }
            } else {
              text = currentValue[input.id] ? currentValue[input.id] : "";
              pages[i - 1].drawText(text, {
                x,
                y,
                size: 11,
                font: customFont,
                width: input.width * 5.969,
                color: rgb(0, 0.5, 0.6),
              });
            }

            // console.log(input.id +' ' + input.type)
            // console.log(currentValue[input.id])
            // console.log("x:" + x)
            // console.log("y:" + y)
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
          file={
            `data:application/pdf;base64,${pdfBase64}`
          }
          onLoadSuccess={onDocumentLoadSuccess}
        >
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
                width={
                  windowWidth <= 600
                    ? windowWidth * 0.85
                    : ratio * windowWidth * 0.75
                } // Adjust width as needed
                //onRenderSuccess={() => handlePageRender(index + 1)}
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
  }
);

export default PdfViewer;
