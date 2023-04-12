import { useState, useRef } from "react";
import Tesseract from "tesseract.js";
import "./App.css";
import preprocessImage from "./preprocess";

function App() {
  const [image, setImage] = useState("");
  const [text, setText] = useState("");
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  const handleChange = (event) => {
    setImage(URL.createObjectURL(event.target.files[0]));
  };

  const handleClick = () => {
    Tesseract.recognize(image, "vie", {
      logger: (m) => console.log(m),
    })
      .catch((err) => {
        console.error(err);
      })
      .then((result) => {
        // Get Confidence score
        let confidence = result.confidence;

        let text = result.data.text;
        setText(text);
      });
  };

  const handleClickV2 = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(imageRef.current, 0, 0);
    ctx.putImageData(preprocessImage(canvas), 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg");

    Tesseract.recognize(dataUrl, "vie", {
      logger: (m) => console.log(m),
    })
      .catch((err) => {
        console.error(err);
      })
      .then((result) => {
        // Get Confidence score
        let confidence = result.confidence;
        console.log(confidence);
        // Get full output
        let text = result.data.paragraphs
          .map((t) => `<p>${t.text}<p/>`)
          .join(" ");

        setText(text);
      });
  };

  return (
    <div className="App">
      <main className="App-main">
        <h3>Actual imagePath uploaded</h3>
        <img src={image} alt="logo" ref={imageRef} />
        <h3>Canvas</h3>
        <canvas ref={canvasRef} width={700} height={250}></canvas>
        <h3>Extracted text</h3>
        <div className="text-box">
          <p> {<div dangerouslySetInnerHTML={{ __html: text }} />}</p>
        </div>
        <input type="file" onChange={handleChange} />
        <button onClick={handleClick} style={{ height: 50 }}>
          {" "}
          convert to text
        </button>
        <button onClick={handleClickV2} style={{ height: 50 }}>
          convert to text V2
        </button>
      </main>
    </div>
  );
}

export default App;
