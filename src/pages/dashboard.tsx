import { ArrowRight, LogIn, Plus } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

const Dashboard = () => {
  const { status } = useSession();
  const router = useRouter();

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
    return (
      <main className="flex flex-col space-y-1.5 min-h-screen bg-background p-4">
        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Your projects
        </h3>
        <div className="flex space-x-4">
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>New project</CardTitle>
              <CardDescription>
                Start an empty project from scratch. Just the defaults. No
                relations defined.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => router.push("/")}>
                <Plus className="mr-2 h-4 w-4" />
                Create
              </Button>
            </CardContent>
          </Card>
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>Untitled 34</CardTitle>
              <CardDescription>
                Totally real project. Click the button to go to the project
                page.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => router.push("/project/random-project-id")}>
                <ArrowRight className="mr-2 w-4 h-4" />
                Go to project
              </Button>
            </CardContent>
          </Card>
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
