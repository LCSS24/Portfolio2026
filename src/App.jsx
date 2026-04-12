import BlobShader from "./components/BlobShader/BlobShader";
import BlobButton from "./components/BlobButton/BlobButton";
import SlotWords from "./components/SlotsWords";
import "./App.scss";
import { ChevronDown, Mouse } from "lucide-react";

export default function App() {
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
