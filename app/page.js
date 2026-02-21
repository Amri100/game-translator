"use client";
import { useState } from "react";

export default function Home() {
  const [filename, setFilename] = useState("translated.txt");
  const [extractedText, setExtractedText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFilename("translated_" + file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;

      if (file.name.endsWith(".json")) {
        parseRPGMaker(text);
      } else if (file.name.endsWith(".ks")) {
        parseKirikiri(text);
      } else {
        setExtractedText("Unsupported file format");
      }
    };

    reader.readAsText(file);
  };

  // ===== RPG MAKER PARSER =====
  const parseRPGMaker = (text) => {
    try {
      const json = JSON.parse(text);
      let dialogs = [];

      if (json.events) {
        Object.values(json.events).forEach(event => {
          if (!event || !event.pages) return;

          event.pages.forEach(page => {
            page.list.forEach(cmd => {
              if (cmd.code === 401) {
                dialogs.push(cmd.parameters[0]);
              }
            });
          });
        });
      }

      setExtractedText(dialogs.join("\n"));
    } catch (err) {
      setExtractedText("Invalid RPG Maker JSON file.");
    }
  };

  // ===== KIRIKIRI PARSER =====
  const parseKirikiri = (text) => {
    const regex = /「(.*?)」/g;
    let matches;
    let dialogs = [];

    while ((matches = regex.exec(text)) !== null) {
      dialogs.push(matches[1]);
    }

    setExtractedText(dialogs.join("\n"));
  };

  // ===== AUTO TRANSLATE =====
  const handleAutoTranslate = async () => {
    if (!extractedText) return;

    setLoading(true);

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: extractedText })
      });

      const data = await res.json();

      if (data.translated) {
        setExtractedText(data.translated);
      } else {
        alert("Translation failed");
      }
    } catch (err) {
      alert("Error connecting to translation API");
    }

    setLoading(false);
  };

  // ===== DOWNLOAD FILE =====
  const handleDownload = () => {
    const blob = new Blob([extractedText], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>RPG Maker & Kirikiri Translator</h1>

      <input type="file" onChange={handleFile} />

      <h3>Extracted Dialog:</h3>
      <textarea
        rows={15}
        style={{ width: "100%", marginTop: 10 }}
        value={extractedText}
        onChange={(e) => setExtractedText(e.target.value)}
      />

      <br />

      <button
        onClick={handleAutoTranslate}
        disabled={loading}
        style={{
          marginTop: 10,
          padding: "10px 20px",
          background: "green",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: "pointer"
        }}
      >
        {loading ? "Translating..." : "Auto Translate"}
      </button>

      <button
        onClick={handleDownload}
        style={{
          marginTop: 10,
          marginLeft: 10,
          padding: "10px 20px",
          background: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: "pointer"
        }}
      >
        Download Result
      </button>
    </div>
  );
}
