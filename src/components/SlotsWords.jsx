import { useState, useEffect } from "react";

export default function SlotWords() {
  const [index, setIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const wordList = ["accessible", "moderne", "professionnel"];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsExiting(true);

      setTimeout(() => {
        setIndex((prev) => (prev + 1) % wordList.length);
        setIsExiting(false);
      }, 300);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="slot-words">
      <span key={index} className={`actual-span ${isExiting ? "exit" : ""}`}>
        {wordList[index]}
      </span>
      <span className="comma-span">,</span>
    </div>
  );
}
