import { ArrowRight, Loader, LogIn, Plus } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, type NextRouter } from "next/router";
import React, { useState } from "react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/utils/api";

const ProjectCard = ({
  router,
  projectId,
  name,
  description,
  createdAt,
}: {
  router: NextRouter;
  projectId: string;
  name: string;
  description: string | null;
  createdAt: Date;
}) => {
  const [loading, setLoading] = useState(false);

  return (
    <Card className="w-[350px] h-[200px]">
      <CardHeader>
        <CardTitle className="truncate">{name}</CardTitle>
        <CardDescription className="line-clamp-2 flex flex-col space-y-2">
          <p>{description ? description : "No description provided."}</p>
          <p>
            Created on {createdAt.toLocaleDateString()} at{" "}
            {createdAt.toLocaleTimeString()}.
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={async () => {
            setLoading(true);
            await router.push(`/project/${projectId}`);
          }}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader className="mr-2 w-4 h-4" /> Loading...
            </>
          ) : (
            <>
              <ArrowRight className="mr-2 w-4 h-4" />
              Go to project
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const router = useRouter();

  const { data: projectData, isLoading: projectIsLoading } =
    api.project.getProjectsByUser.useQuery();

  const { mutate, isLoading: createIsLoading } = api.project.create.useMutation(
    {
      onSuccess: async ({ id }) => await router.push(`/project/${id}`),
      onError: (error) =>
        toast({
          title: "An error occurred",
          description: `Something happened while creating a new project. Reason: ${error.message}`,
        }),
    }
  );

  if (status === "loading") {
    return (
      <main className="h-[calc(100vh-53px)] p-4 bg-background">
        <Skeleton className="h-full w-full rounded-xl flex items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Signing into dashboard...
          </p>
        </Skeleton>
      </main>
    );
  }

  if (status === "authenticated") {
    const projectsList: React.ReactNode = projectIsLoading ? (
      <Skeleton className="w-[350px] h-[200px] rounded-lg flex items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading your projects...
        </p>
      </Skeleton>
    ) : projectData ? (
      projectData.map((project, index) => (
        <ProjectCard
          key={index}
          router={router}
          projectId={project.id}
          name={project.title}
          description={project.description}
          createdAt={project.createdAt}
        />
      ))
    ) : (
      <Card className="w-[350px] h-[200px] flex items-center justify-center">
        <p className="text-sm text-muted-foreground">
          No projects found. Create one!
        </p>
      </Card>
    );

    const name = session.user?.name ? session.user.name : "Scallop user";
    const first = name.split(" ")[0];

    const createProjectButton = createIsLoading ? (
      <Card className="w-[350px] p-6 bg-muted transition h-[200px] flex flex-col items-center justify-center">
        <Loader className="w-8 h-8" />
        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Creating new project...
        </h3>
        <p className="text-sm">Hold on tight.</p>
      </Card>
    ) : (
      <Card className="w-[350px] p-6 hover:bg-muted transition h-[200px] flex flex-col items-center justify-center">
        <Plus className="w-8 h-8 text-muted-foreground" />
        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight text-muted-foreground ">
          Create new project
        </h3>
        <p className="text-sm text-muted-foreground">
          Start an empty project from scratch.
        </p>
      </Card>
    );

    return (
      <main className="flex flex-col space-y-3 min-h-screen bg-background p-4">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Welcome back, {first ? first : name}.
        </h3>
        <div className="flex gap-4 flex-wrap">
          <button onClick={() => mutate()}>{createProjectButton}</button>
          {projectsList}
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center h-[calc(100vh-53px)] bg-background space-y-5">
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Please sign in to view your dashboard.
      </h3>
      <Button onClick={() => signIn()}>
        <LogIn className="mr-2 h-4 w-4" /> Sign in
      </Button>
    </main>
  );
};

export default Dashboard;
