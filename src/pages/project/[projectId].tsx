import type { inferRouterOutputs } from "@trpc/server";
import { useSession } from "next-auth/react";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
} from "next/types";

import { ScallopEditor } from "~/components/scallop-editor";
import type { AppRouter } from "~/server/api/root";
import { generateSSRHelper } from "~/utils/ssr-helper";

type Project = inferRouterOutputs<AppRouter>["project"]["getProjectById"];

const ProjectPage = ({
  project,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: session } = useSession();

  const isAuthor = session?.user?.id === project.authorId;

  return (
    <main className="flex h-[calc(100vh-53px)] w-full flex-col bg-background">
      <ScallopEditor
        editor={{ type: "project", project: project, isAuthor: isAuthor }}
      />
    </main>
  );
};

export const getServerSideProps = (async (ctx) => {
  const projectId = ctx.params?.projectId;

  if (typeof projectId !== "string") {
    throw new Error(`invalid project id, received: ${projectId?.toString()}`);
  }

  const helper = await generateSSRHelper(ctx);

  const project = await helper.project.getProjectById({
    id: projectId,
  });

  return {
    props: {
      // worst hack ever
      project: JSON.parse(JSON.stringify(project)) as Project,
    },
  };
}) satisfies GetServerSideProps<{
  project: Project;
}>;

export default ProjectPage;
