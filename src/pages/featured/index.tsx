import { useRouter } from "next/router";

import ProjectCard from "~/components/project-card";
import { api } from "~/utils/api";

const Featured = () => {
  const router = useRouter();
  const { data: projects } = api.project.getFeaturedProjects.useQuery();

  const projectList = projects?.map((project) => (
    <ProjectCard
      key={project.id}
      router={router}
      projectId={project.id}
      name={project.title}
      description={project.description}
      createdAt={project.createdAt}
      showDate={false}
    />
  ));

  return (
    <main className="flex flex-col space-y-12 min-h-screen bg-background p-8">
      <section className="flex flex-col items-center space-y-2">
        <h2 className="scroll-m-20 mt-8 text-4xl font-semibold tracking-tight text-center">
          Featured projects
        </h2>
        <p className="leading-6 [&:not(:first-child)]:mt-6 text-center w-[720px]">
          Here you will find projects published by members of the Scallop
          community. Enter a project to see details and run its contents! Note
          that you&apos;ll have to create a copy to make changes.
        </p>
      </section>
      <section className="flex flex-col space-y-3">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Demos from the Scallop team
        </h3>
        <div className="flex flex-wrap gap-4 items-center">{projectList}</div>
      </section>
    </main>
  );
};

export default Featured;
