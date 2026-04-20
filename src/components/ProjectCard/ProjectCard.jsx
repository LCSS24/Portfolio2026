import "./ProjectCard.scss";

export default function ProjectCard({ projectObj, onClick, isActive }) {
  const project = projectObj;
  return (
    <>
      <div
        className={`card-container ${isActive ? "active" : ""}`}
        onClick={onClick}
        style={{ cursor: "pointer" }}
      >
        <img src={"src/assets/images/" + project.imageUrl} alt="" />
        <div className="mask"></div>
      </div>
    </>
  );
}
