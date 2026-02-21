"use client";
import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [filename, setFilename] = useState("translated.txt");

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFilename("translated_" + file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setContent(event.target.result);
    };
    reader.readAsText(file);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Game Translator</h1>
      <p>Upload file Kirikiri (.ks) atau RPG Maker (.json)</p>
      <input type="file" onChange={handleFile} />
      <textarea
        rows={15}
        style={{ width: "100%", marginTop: 20 }}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button
        onClick={handleDownload}
        style={{
          marginTop: 20,
          padding: "10px 20px",
          background: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        Download Hasil
      </button>
    </div>
  );
}
