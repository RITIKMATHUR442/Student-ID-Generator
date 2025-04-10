import React, { useState, useEffect } from "react";
import QRCode from 'react-qr-code';
import { toPng } from "html-to-image";
import "./App.css";

function App() {
  const [student, setStudent] = useState({
    name: "",
    roll: "",
    classDiv: "",
    allergies: [],
    photo: "",
    rack: "",
    busRoute: "",
  });

  const [preview, setPreview] = useState(false);
  const [template, setTemplate] = useState("template1");
  const [savedCards, setSavedCards] = useState([]);

  // Load previous cards and saved template from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("studentCards")) || [];
    setSavedCards(saved);

    const savedTemplate = localStorage.getItem("selectedTemplate");
    if (savedTemplate) setTemplate(savedTemplate);
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      const reader = new FileReader();
      reader.onload = () =>
        setStudent((prev) => ({ ...prev, photo: reader.result }));
      reader.readAsDataURL(files[0]);
    } else if (name === "allergies") {
      const selected = Array.from(e.target.selectedOptions, (option) => option.value);
      setStudent((prev) => ({ ...prev, allergies: selected }));
    } else {
      setStudent((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleTemplateChange = (e) => {
    setTemplate(e.target.value);
    localStorage.setItem("selectedTemplate", e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPreview(true);

    const newCard = { ...student };
    const updatedCards = [...savedCards, newCard];
    setSavedCards(updatedCards);
    localStorage.setItem("studentCards", JSON.stringify(updatedCards));
  };

  const downloadCard = (id = "id-card") => {
    const node = document.getElementById(id);
    toPng(node).then((dataUrl) => {
      const link = document.createElement("a");
      link.download = `${student.name || "Student"}_ID.png`;
      link.href = dataUrl;
      link.click();
    });
  };

  const qrData = { ...student };
  delete qrData.photo;
  const qrValue = JSON.stringify(qrData);
  const isQrValid = qrValue.length <= 2000;

  return (
    <div className="app">
      <h1>Smart Student ID Generator</h1>

      {/* Template Switcher */}
      <div className="template-switch">
        <label>Choose Template: </label>
        <select value={template} onChange={handleTemplateChange}>
          <option value="template1">Template 1</option>
          <option value="template2">Template 2</option>
        </select>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="student-form">
        <input name="name" placeholder="Name" onChange={handleChange} required />
        <input name="roll" placeholder="Roll Number" onChange={handleChange} required />
        <select name="classDiv" onChange={handleChange} required>
          <option value="">Select Class & Division</option>
          <option value="10A">10 A</option>
          <option value="10B">10 B</option>
        </select>
        <select name="allergies" multiple onChange={handleChange}>
          <option value="Peanuts">Peanuts</option>
          <option value="Dairy">Dairy</option>
          <option value="Gluten">Gluten</option>
        </select>
        <input name="photo" type="file" accept="image/*" onChange={handleChange} />
        <input name="rack" placeholder="Rack Number" onChange={handleChange} required />
        <select name="busRoute" onChange={handleChange} required>
          <option value="">Select Bus Route</option>
          <option value="Route 1">Route 1</option>
          <option value="Route 2">Route 2</option>
        </select>
        <button type="submit">Generate ID</button>
      </form>

      {/* ID Card Preview */}
      {preview && (
        <div className={`id-card ${template}`} id="id-card">
          <h2>{student.name}</h2>
          <p>Roll No: {student.roll}</p>
          <p>Class: {student.classDiv}</p>
          <p>Rack No: {student.rack}</p>
          <p>Bus Route: {student.busRoute}</p>
          {student.allergies.length > 0 && (
            <p>Allergies: {student.allergies.join(", ")}</p>
          )}
          {student.photo && <img src={student.photo} alt="Student" className="photo" />}
          <div className="qr-box">
            {isQrValid ? (
              <QRCode value={qrValue} size={128} />
            ) : (
              <p style={{ color: "red" }}>QR data too long</p>
            )}
          </div>
          <button onClick={() => downloadCard("id-card")}>Download as PNG</button>
        </div>
      )}

      {/* Saved Cards Section */}
      <h2>Saved Student Cards</h2>
      <div className="saved-cards">
        {savedCards.map((card, index) => {
          const qr = { ...card };
          delete qr.photo;
          return (
            <div className={`id-card ${template}`} key={index} id={`card-${index}`}>
              <h2>{card.name}</h2>
              <p>Roll No: {card.roll}</p>
              <p>Class: {card.classDiv}</p>
              <p>Rack No: {card.rack}</p>
              <p>Bus Route: {card.busRoute}</p>
              {card.allergies.length > 0 && (
                <p>Allergies: {card.allergies.join(", ")}</p>
              )}
              {card.photo && <img src={card.photo} alt="Student" className="photo" />}
              <div className="qr-box">
                <QRCode value={JSON.stringify(qr)} size={128} />
              </div>
              <button onClick={() => downloadCard(`card-${index}`)}>Download</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
