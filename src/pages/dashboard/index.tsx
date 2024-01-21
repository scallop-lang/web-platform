import { Loader, LogIn, Plus } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { toast } from "sonner";

import ProjectCard from "~/components/project-card";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/utils/api";

const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const { data: projectData, isLoading: projectIsLoading } =
    api.project.getProjectsByUser.useQuery();

  const { mutate, isLoading: createIsLoading } = api.project.create.useMutation(
    {
      onSuccess: async ({ id }) => await router.push(`/project/${id}`),
      onError: (error) =>
        toast.message("An error occurred", {
          description: `Something happened while creating a new project. Reason: ${error.message}`,
        }),
    },
  );

  if (status === "loading") {
    return (
      <>
        <Head>
          <title>Dashboard — Scallop</title>
        </Head>

        <main className="h-[calc(100vh-53px)] bg-background p-4">
          <Skeleton className="flex h-full w-full items-center justify-center rounded-xl">
            <p className="text-sm text-muted-foreground">
              Signing into dashboard...
            </p>
          </Skeleton>
        </main>
      </>
    );
  }

  if (status === "authenticated") {
    const projectsList: React.ReactNode = projectIsLoading ? (
      <Skeleton className="flex h-[200px] w-[350px] items-center justify-center rounded-lg">
        <p className="text-sm text-muted-foreground">
          Loading your projects...
        </p>
      </Skeleton>
    ) : projectData && projectData.length > 0 ? (
      projectData.map((project) => (
        <ProjectCard
          key={project.id}
          router={router}
          projectId={project.id}
          name={project.title}
          description={project.description}
          createdAt={project.createdAt}
        />
      ))
    ) : (
      <Card className="flex h-[200px] w-[350px] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          No projects found. Create one!
        </p>
      </Card>
    );

    const name = session.user?.name ? session.user.name : "Scallop user";
    const first = name.split(" ")[0];

    const createProjectButton = createIsLoading ? (
      <Card className="flex h-[200px] w-[350px] flex-col items-center justify-center bg-muted p-6 transition">
        <Loader className="h-8 w-8 animate-spin" />
        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Creating new project...
        </h3>
        <p className="text-sm">Hold on tight.</p>
      </Card>
    ) : (
      <Card className="flex h-[200px] w-[350px] flex-col items-center justify-center p-6 transition hover:bg-muted">
        <Plus className="h-8 w-8 text-muted-foreground" />
        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight text-muted-foreground ">
          Create new project
        </h3>
        <p className="text-sm text-muted-foreground">
          Start an empty project from scratch.
        </p>
      </Card>
    );

    return (
      <>
        <Head>
          <title>Dashboard — Scallop</title>
        </Head>

        <main className="flex min-h-screen flex-col space-y-3 bg-background p-4">
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Welcome back, {first ? first : name}.
          </h2>
          <div className="flex flex-wrap gap-4">
            <button onClick={() => mutate()}>{createProjectButton}</button>
            {projectsList}
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard — Scallop</title>
      </Head>

      <main className="flex h-[calc(100vh-53px)] flex-col items-center justify-center space-y-5 bg-background">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Please sign in to view your dashboard.
        </h3>
        <Button onClick={() => signIn()}>
          <LogIn className="mr-2 h-4 w-4" /> Sign in
        </Button>
      </main>
    </>
  );
};

export default Dashboard;
