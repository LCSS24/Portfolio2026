import { useState, useMemo } from "react";
import "./App.scss";
import Hero from "./components/Hero/Hero";
import ProjectCard from "./components/ProjectCard/ProjectCard";
import projectsData from "./assets/Projets.json";

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(projectsData.length); // On commence au milieu (premier vrai projet)
  const [isTransitioning, setIsTransitioning] = useState(true);

  // Liste étendue [Clones Fin] + [Projets Réels] + [Clones Début]
  const extendedProjects = useMemo(
    () => [...projectsData, ...projectsData, ...projectsData],
    [],
  );

  const projectCount = projectsData.length;

  const handleTransitionEnd = () => {
    // Si on arrive sur les clones de fin, on téléporte au milieu sans animation
    if (currentIndex >= projectCount * 2) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex - projectCount);
    }
    // Si on arrive sur les clones de début
    else if (currentIndex < projectCount) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex + projectCount);
    }
  };

  const move = (step) => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + step);
  };

  // Calcul du pourcentage de translation pour 5 éléments (20% par carte)
  // Pour centrer l'élément currentIndex, on décale de (currentIndex * 20%)
  // et on ajoute 40% (pour voir les 2 éléments de gauche)
  const translation = currentIndex * 20 - 40;

  return (
    <>
      <Hero />
      <section className="project-section">
        <h3 className="h3-title">PROJETS</h3>

        <div className="infos-slider">
          <h4>{projectsData[currentIndex % projectCount].titre}</h4>
          <p>{projectsData[currentIndex % projectCount].description}</p>
        </div>

        <div className="carousel-container">
          <button className="nav-btn prev" onClick={() => move(-1)}>
            ‹
          </button>

          <div className="carousel-viewport">
            <div
              className="cards-rail"
              onTransitionEnd={handleTransitionEnd}
              style={{
                transform: `translateX(-${translation}%)`,
                transition: isTransitioning
                  ? "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
                  : "none",
              }}
            >
              {extendedProjects.map((project, index) => (
                <div
                  key={`${project.id}-${index}`}
                  className={`slide-wrapper ${index === currentIndex ? "active" : ""}`}
                  onClick={() => {
                    setIsTransitioning(true);
                    setCurrentIndex(index);
                  }}
                >
                  <ProjectCard projectObj={project} />
                </div>
              ))}
            </div>
          </div>

          <button className="nav-btn next" onClick={() => move(1)}>
            ›
          </button>
        </div>

        <div className="pagination-dots">
          {projectsData.map((_, i) => (
            <span
              key={i}
              className={`dot ${i === currentIndex % projectCount ? "active" : ""}`}
              onClick={() => {
                setIsTransitioning(true);
                setCurrentIndex(i + projectCount);
              }}
            />
          ))}
        </div>

        <button className="btn-voir-projets">Voir les projets</button>
      </section>
    </>
  );
}
