import { useState, useEffect, useRef, useLayoutEffect } from "react";
import "./SlotWords.scss";

export default function SlotWords() {
  const wordList = [
    "accessible",
    "moderne",
    "professionnel",
    "eco-responsable",
    "optimisé",
    "sécurisé",
    "performant",
    "mémorable",
    "intuitif",
    "engageant",
  ];
  const [index, setIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [width, setWidth] = useState(0);
  const currentMeasureRef = useRef(null);
  const nextMeasureRef = useRef(null);

  const currentWord = `${wordList[index]},`;
  const nextIndex = (index + 1) % wordList.length;
  const nextWord = `${wordList[nextIndex]},`;

  useLayoutEffect(() => {
    const currentWidth = currentMeasureRef.current
      ? currentMeasureRef.current.getBoundingClientRect().width
      : 0;
    const nextWidth = nextMeasureRef.current
      ? nextMeasureRef.current.getBoundingClientRect().width
      : 0;

    setWidth(
      Math.ceil(isExiting ? Math.max(currentWidth, nextWidth) : currentWidth),
    );
  }, [currentWord, nextWord, isExiting]);

  useEffect(() => {
    if (!currentMeasureRef.current || !nextMeasureRef.current) return;

    const updateWidth = () => {
      const currentWidth =
        currentMeasureRef.current.getBoundingClientRect().width;
      const nextWidth = nextMeasureRef.current.getBoundingClientRect().width;
      setWidth(
        Math.ceil(isExiting ? Math.max(currentWidth, nextWidth) : currentWidth),
      );
    };

    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(currentMeasureRef.current);
    resizeObserver.observe(nextMeasureRef.current);
    return () => resizeObserver.disconnect();
  }, [isExiting]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsExiting(true); // On lance l'animation de sortie

      setTimeout(() => {
        setIndex((prev) => (prev + 1) % wordList.length);
        setIsExiting(false); // On réinitialise pour l'entrée du nouveau mot
      }, 500); // Durée de la transition de sortie
    }, 2000);

    return () => clearInterval(interval);
  }, [wordList.length]);

  return (
    <div className="slot-container">
      <div
        className="slot-words"
        style={{ width: width ? `${width}px` : "auto" }}
      >
        <span
          key={index}
          className={`word-span ${isExiting ? "exit" : "enter"}`}
        >
          {currentWord}
        </span>
      </div>

      <span ref={currentMeasureRef} className="measure-word">
        {currentWord}
      </span>
      <span ref={nextMeasureRef} className="measure-word">
        {nextWord}
      </span>
    </div>
  );
}
