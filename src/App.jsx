import BlobShader from "./components/BlobShader/BlobShader";
import BlobButton from "./components/BlobButton/BlobButton";
import SlotWords from "./components/SlotsWords";
import "./App.scss";
import { ChevronDown, Mouse } from "lucide-react";
import { useState, useEffect } from "react";

export default function App() {
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
    <>
      <section className="hero-section">
        <BlobShader />
        <div className="hero-container">
          <div className="sentence">
            <h2>Si votre site doit être</h2>
            <SlotWords />
            <h2>vous êtes au bon endroit</h2>
          </div>
          <BlobButton
            label={"Démarrer un projet"}
            onClick={console.log("caca")}
          />
        </div>
      </section>
      <div className="hero-bottom">
        <Mouse />
        <ChevronDown />
      </div>
    </>
  );
}
