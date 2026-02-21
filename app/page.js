"use client";
import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setContent(event.target.result);
    };

    reader.readAsText(file);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Game Translator</h1>

      <input type="file" onChange={handleFile} />

      <textarea
        rows={15}
        style={{ width: "100%", marginTop: 20 }}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
    </div>
  );
}