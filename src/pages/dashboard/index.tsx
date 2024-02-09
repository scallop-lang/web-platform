import { ArrowRight, BookPlus, LayoutDashboard, LogIn } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/utils/api";

const Dashboard = () => {
  const { status } = useSession();
  const router = useRouter();

  const projects = api.project.getProjectsByUser.useQuery();
  const create = api.project.create.useMutation({
    onMutate: () =>
      toast.loading("Creating new project...", {
        duration: Infinity,
      }),

    onSuccess: async ({ id }) => {
      toast.dismiss();
      await router.push(`/project/${id}`);
    },

    onError: ({ message }) => {
      toast.dismiss();
      toast.message(
        <div className="space-y-2.5">
          <p className="font-semibold">
            An error occured while creating a new project. Message:
          </p>
          <p className="font-mono text-xs">{message}</p>
        </div>,
        {
          duration: Infinity,
        },
      );
    },
  });

  let content: React.ReactNode = null;

  switch (status) {
    case "loading":
      content = (
        <>
          <Skeleton className="h-6 rounded-md" />

          <Skeleton className="h-9 w-32 rounded-md" />

          <Skeleton className="h-6 rounded-md" />

          <div className="grid grid-cols-2 gap-2.5">
            <Skeleton className="h-32 rounded-md" />
            <Skeleton className="h-32 rounded-md" />
            <Skeleton className="h-32 rounded-md" />
            <Skeleton className="h-32 rounded-md" />
          </div>
        </>
      );

      break;

    case "authenticated":
      const { data } = projects;
      let projectsList: React.ReactNode = null;

      if (projects.isLoading) {
        projectsList = (
          <>
            <Skeleton className="h-32 rounded-md" />
            <Skeleton className="h-32 rounded-md" />
            <Skeleton className="h-32 rounded-md" />
            <Skeleton className="h-32 rounded-md" />
          </>
        );
      } else if (data && data.length > 0) {
        projectsList = data.map(({ description, title, createdAt, id }) => (
          <Link
            key={id}
            href={`/project/${id}`}
            className="group rounded-md border border-border p-5 shadow-sm transition-colors hover:bg-secondary"
          >
            <h3 className="flex items-center font-semibold group-hover:underline">
              {title}{" "}
              <ArrowRight
                size={16}
                className="ml-1 transition group-hover:translate-x-1"
              />
            </h3>
            <p>{description ? description : "No description provided."}</p>
            <p className="text-muted-foreground">
              Created on {createdAt.toLocaleDateString()} at{" "}
              {createdAt.toLocaleTimeString()}.
            </p>
          </Link>
        ));
      }

      content = (
        <>
          <p className="text-pretty">
            Welcome back to Scallop. You currently{" "}
            {data && data.length > 0
              ? `have ${data.length} project${data.length > 1 ? "s" : ""}.`
              : "don't have any projects. Create one with the button below."}
          </p>

          <Button
            onClick={() => create.mutate()}
            disabled={create.isLoading}
          >
            <BookPlus
              size={16}
              className="mr-1.5"
            />{" "}
            Create new project
          </Button>

          {projectsList ? (
            <>
              <h2 className="text-xl font-semibold tracking-tight">
                Your projects
              </h2>

              <div className="grid grid-cols-1 gap-2.5 text-sm xs:grid-cols-2">
                {projectsList}
              </div>
            </>
          ) : null}
        </>
      );

      break;

    case "unauthenticated":
      content = (
        <>
          <p className="text-pretty">
            Welcome to the Scallop web platform. You can access and edit all
            your personal projects from the dashboard. This is also where you
            create new projects.
          </p>

          <p className="text-pretty">
            To get started, please link your Google or GitHub account by
            clicking the button below. If you already have an account, you may
            also login below.
          </p>

          <p className="text-pretty">
            Confused? Check out the{" "}
            <Link
              href="https://www.scallop-lang.org/doc/index.html"
              target="_blank"
              className="font-semibold hover:underline"
            >
              Scallop language documentation
            </Link>{" "}
            or take a look at one of the{" "}
            <Link
              href="/examples"
              className="font-semibold hover:underline"
            >
              example projects
            </Link>{" "}
            that we&apos;ve provided.
          </p>

          <Button onClick={() => signIn()}>
            <LogIn
              className="mr-1.5"
              size={16}
            />{" "}
            Sign in
          </Button>
        </>
      );

      break;

    default:
      throw new Error("Unreachable error occurred, please report");
  }

  return (
    <>
      <Head>
        <title>Dashboard — Scallop</title>
      </Head>

      <main className="mx-auto flex min-h-[calc(100vh-53px)] max-w-[950px] flex-col space-y-6 p-6 sm:p-12">
        <h2 className="flex scroll-m-20 flex-col gap-1 text-3xl font-semibold tracking-tight">
          <LayoutDashboard size={35} />
          Dashboard
        </h2>

        <section className="space-y-6">{content}</section>
      </main>
    </>
  );
};

export default Dashboard;
