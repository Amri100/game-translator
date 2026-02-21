"use client";
import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");

  return (
    <div style={{ padding: 40 }}>
      <h1>Game Translator</h1>
      <textarea
        rows={10}
        style={{ width: "100%" }}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste dialog here..."
      />
    </div>
  );
}
