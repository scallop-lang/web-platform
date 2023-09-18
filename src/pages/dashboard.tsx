import { ArrowRight, LogIn, Plus } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, type NextRouter } from "next/router";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/utils/api";

const ProjectCard = ({
  router,
  projectId,
  name,
  createdAt,
}: {
  router: NextRouter;
  projectId: string;
  name: string;
  createdAt: Date;
}) => {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>
          Actually a real project lol. Created on {createdAt.toDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={() => router.push(`/project/${projectId}`)}>
          <ArrowRight className="mr-2 w-4 h-4" />
          Go to project
        </Button>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const { status } = useSession();
  const router = useRouter();
  const projectsQuery = api.project.getProjectsByUser.useQuery();
  const createMutation = api.project.create.useMutation({
    onSuccess: async (projectData) => {
      await router.push(`/project/${projectData.id}`);
    },
  });

  if (status === "loading") {
    return (
      <main className="h-[calc(100vh-53px)] p-4 bg-background">
        <Skeleton className="h-full w-full rounded-xl flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Loading...</p>
        </Skeleton>
      </main>
    );
  }

  if (status === "authenticated") {
    const userProjectsList: React.ReactNode = projectsQuery.data?.map(
      (project, index) => {
        return (
          <ProjectCard
            key={index}
            router={router}
            projectId={project.id}
            name={project.title}
            createdAt={project.createdAt}
          />
        );
      }
    );

    return (
      <main className="flex flex-col space-y-1.5 min-h-screen bg-background p-4">
        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Your projects
        </h3>
        <div className="flex space-x-4 space-y-4 flex-wrap">
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>New project</CardTitle>
              <CardDescription>
                Start an empty project from scratch. Just the defaults. No
                relations defined.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => {
                  createMutation.mutate();
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create
              </Button>
            </CardContent>
          </Card>
          {userProjectsList ? userProjectsList : <div>None created</div>}
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
