import BlobShader from "../BlobShader/BlobShader";
import BlobButton from "../BlobButton/BlobButton";
import SlotWords from "../SlotWords/SlotWords";
import { ChevronDown, Mouse } from "lucide-react";
import { useState, useEffect } from "react";
import "./Hero.scss";

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const wordList = ["accessible", "moderne", "professionnel"];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsExiting(true); // Lance slideOut

      setTimeout(() => {
        setIndex((prevIndex) => (prevIndex + 1) % wordList.length);
        setIsExiting(false); // Lance slideIn
      }, 300); // Demi-durée de l'animation
    }, 2000);

    return () => clearInterval(interval);
  }, []);
  return (
    <section>
      <div className="hero-section">
        <BlobShader />
        <div className="hero-container">
          <div className="sentence">
            <h2>Si votre site doit être</h2>
            <SlotWords />
            <h2>vous êtes au bon endroit</h2>
          </div>
          <BlobButton label={"Démarrer un projet"} />
        </div>
      </div>
      <div className="hero-bottom">
        <Mouse />
        <ChevronDown />
      </div>
    </section>
  );
}
