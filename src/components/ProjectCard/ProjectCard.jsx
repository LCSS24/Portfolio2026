export default function ProjectCard(projectObj) {
  const project = projectObj.projectObj;
  console.log(project);
  return (
    <>
      <h4>{project.titre}</h4>
    </>
  );
}
