"use client";
import { useState } from "react";
import { Howl } from "howler";

const soundFiles = {
  C: "/sounds/C.wav",
  D: "/sounds/D.wav",
  E: "/sounds/E.wav",
  F: "/sounds/F.wav",
  G: "/sounds/G.wav",
  A: "/sounds/A.wav",
  B: "/sounds/B.wav",
  C_high: "/sounds/C_high.wav",
};

export default function Kalimba() {
  const [sounds] = useState(
    Object.fromEntries(
      Object.entries(soundFiles).map(([note, file]) => [
        note,
        new Howl({ src: [file] }),
      ])
    )
  );

  const playSound = (note: string) => {
    sounds[note].play();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">カリンバ演奏</h1>
      <div className="flex space-x-2">
        {Object.keys(soundFiles).map((note) => (
          <button
            key={note}
            className="w-16 h-40 bg-white border border-gray-400 rounded-lg text-lg font-bold shadow-md hover:bg-gray-200 active:bg-gray-300"
            onClick={() => playSound(note)}
          >
            {note}
          </button>
        ))}
      </div>
    </div>
  );
}
