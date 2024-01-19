import Head from "next/head";
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
    <>
      <Head>
        <title>Featured projects — Scallop</title>
      </Head>

      <main className="flex min-h-screen flex-col space-y-12 bg-background p-8">
        <section className="flex flex-col items-center space-y-2">
          <h2 className="mt-8 scroll-m-20 text-center text-4xl font-semibold tracking-tight">
            Featured projects
          </h2>
          <p className="w-[720px] text-center leading-6 [&:not(:first-child)]:mt-6">
            Here you will find projects published by members of the Scallop
            community. Enter a project to see details and run its contents! Note
            that you&apos;ll have to create a copy to make changes.
          </p>
        </section>
        <section className="flex flex-col space-y-3">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Demos from the Scallop team
          </h3>
          <div className="flex flex-wrap items-center gap-4">{projectList}</div>
        </section>
      </main>
    </>
  );
};

export default Featured;
