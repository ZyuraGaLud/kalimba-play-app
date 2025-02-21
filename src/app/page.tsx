"use client";
import { useState, useEffect } from "react";
import { Howl } from "howler";

const sounds = {
  C: "/sounds/C.wav",
  D: "/sounds/D.wav",
  E: "/sounds/E.wav",
  F: "/sounds/F.wav",
  G: "/sounds/G.wav",
  A: "/sounds/A.wav",
  B: "/sounds/B.wav",
  C_high: "/sounds/C_high.wav",
};

const yorokobi = ["E", "E", "F", "G", "G", "F", "E", "D", "C", "C", "D", "E", "E", "D","D"];

// サウンドをロード
const playSound = (note: string) => {
  new Howl({ src: [sounds[note]] }).play();
};

export default function Kalimba() {
  const keys = Object.keys(sounds);
  const [recording, setRecording] = useState<{ note: string; time: number }[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [savedRecordings, setSavedRecordings] = useState<{ note: string; time: number }[][]>([]);
  const [lastInteraction, setLastInteraction] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastInteraction > 30000) {
        playMedakaNoGakkou();
        setLastInteraction(Date.now());
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lastInteraction]);

  const playMedakaNoGakkou = () => {
    let delay = 0;
    yorokobi.forEach((note) => {
      setTimeout(() => playSound(note), delay);
      delay += 500;
    });
  };

  // 録音開始
  const startRecording = () => {
    setIsRecording(true);
    setRecording([]);
    setLastInteraction(Date.now());
  };

  // 録音停止 & 保存
  const stopRecording = () => {
    setIsRecording(false);
    if (recording.length > 0) {
      setSavedRecordings((prev) => [...prev, recording]);
    }
    setLastInteraction(Date.now());
  };

  // 再生（録音時のタイミングを維持）
  const playRecording = (recordedNotes: { note: string; time: number }[]) => {
    if (recordedNotes.length === 0) return;
    const startTime = recordedNotes[0].time;
    recordedNotes.forEach(({ note, time }) => {
      setTimeout(() => playSound(note), time - startTime);
    });
    setLastInteraction(Date.now());
  };

  // 録音中なら記録
  const handleKeyPress = (note: string) => {
    playSound(note);
    if (isRecording) {
      setRecording((prev) => [...prev, { note, time: Date.now() }]);
    }
    setLastInteraction(Date.now());
  };

  // 削除機能
  const deleteRecording = (index: number) => {
    setSavedRecordings((prev) => prev.filter((_, i) => i !== index));
    setLastInteraction(Date.now());
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-black text-white overflow-hidden">
      
      <h1 className="text-4xl font-bold mb-8 text-gray-300 z-10">Kalimba sound site</h1>
      
      {/* キーボタン */}
      <div className="relative flex gap-2 sm:gap-4 z-10">
        {keys.map((note) => (
          <button
            key={note}
            onClick={() => handleKeyPress(note)}
            className="relative w-14 sm:w-16 h-40 sm:h-48 bg-gray-800 border-2 border-gray-600 text-gray-200 rounded-xl shadow-[0_0_10px_rgba(0,255,255,0.3)] hover:shadow-[0_0_20px_rgba(0,255,255,0.6)] transition-all transform hover:-translate-y-1 active:scale-95"
          >
            {note.replace("C_high", "C♯")}
          </button>
        ))}
      </div>
      
      {/* 録音ボタン */}
      <div className="mt-6 flex gap-4">
        <button 
          onClick={startRecording} 
          disabled={isRecording} 
          className={`px-4 py-2 rounded ${isRecording ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
        >
          録音開始
        </button>
        <button 
          onClick={stopRecording} 
          disabled={!isRecording} 
          className={`px-4 py-2 rounded ${!isRecording ? "bg-gray-500 cursor-not-allowed" : "bg-red-500 hover:bg-red-600 text-white"}`}
        >
          録音停止
        </button>
      </div>
      
      {/* 録音リスト */}
      <div className="mt-6 w-80 text-center">
        <h2 className="text-xl mb-4">録音リスト</h2>
        {savedRecordings.length > 0 ? (
          savedRecordings.map((recorded, index) => (
            <div key={index} className="flex justify-between items-center bg-gray-700 p-2 rounded mb-2">
              <span className="text-sm">録音 {index + 1}</span>
              <div className="flex gap-2">
                <button onClick={() => playRecording(recorded)} className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded">再生</button>
                <button onClick={() => deleteRecording(index)} className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded">削除</button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">録音はありません</p>
        )}
      </div>
    </div>
  );
}
