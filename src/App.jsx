import "./App.scss";
import Hero from "./components/Hero/Hero";
import ProjectCard from "./components/ProjectCard/ProjectCard";
import projects from "./assets/Projets.json";

export default function App() {
  return (
    <>
      <Hero />
      <section className="project-section">
        <h3 className="h3-title">PROJETS</h3>
        <div className="projects-container">
          <div className="projects-slider">
            {projects.map((project) => (
              <ProjectCard key={project.id} projectObj={project} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
