import type { inferRouterOutputs } from "@trpc/server";
import { Loader, Save, Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
} from "next/types";
import { useState } from "react";

import { ScallopEditor } from "~/components/scallop-editor";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { useToast } from "~/components/ui/use-toast";
import type { AppRouter } from "~/server/api/root";
import { api } from "~/utils/api";
import type { RelationRecord } from "~/utils/schemas-types";
import { generateSSRHelper } from "~/utils/ssr-helper";

type Project = inferRouterOutputs<AppRouter>["project"]["getProjectById"];

const ProjectPage = ({
  project,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const isAuthor = session?.user?.id === project.authorId;

  const { mutate: saveProject, isLoading: projectIsSaving } =
    api.project.updateProjectById.useMutation({
      onSuccess: () =>
        toast({
          description: "Project successfully saved!",
        }),
      onError: (error) =>
        toast({
          description: `Project failed to save! Reason: ${error.message}`,
        }),
    });

  const { mutate: deleteProject, isLoading: projectIsDeleting } =
    api.project.deleteProjectById.useMutation({
      onSuccess: async ({ title }) => {
        toast({
          description: (
            <p>
              Project <b>{title}</b> successfully deleted!
            </p>
          ),
        });
        await router.push("/dashboard");
      },
      onError: (error) =>
        toast({
          description: `Project failed to delete! Reason: ${error.message}`,
        }),
    });

  const inputsCopy: RelationRecord = {};
  const outputsCopy: RelationRecord = {};

  project.inputs.forEach((input) => {
    inputsCopy[input.name] = input;
  });

  project.outputs.forEach((output) => {
    outputsCopy[output.name] = output;
  });

  const [title, setTitle] = useState<string>(project.title);
  const [published, setPublished] = useState<boolean>(project.published);

  return (
    <main className="flex h-[calc(100vh-53px)] flex-col gap-3 bg-background p-4">
      <div className="flex items-center justify-between">
        {isAuthor ? (
          <Input
            type="text"
            defaultValue={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-fit scroll-m-20 text-2xl font-semibold tracking-tight"
            placeholder={project.title}
          />
        ) : (
          <h3 className="w-fit scroll-m-20 text-2xl font-semibold tracking-tight">
            {title}
          </h3>
        )}
        {isAuthor ? (
          <div className="flex space-x-5">
            <span className="flex items-center space-x-2">
              <Label htmlFor="publish-switch">
                {published ? "Published" : "Unpublished"}
              </Label>
              <Switch
                id="publish-switch"
                checked={published}
                onCheckedChange={(checked: boolean) => {
                  setPublished(checked);
                  saveProject({
                    id: project.id,
                    project: {
                      published: checked,
                    },
                  });
                }}
              />
            </span>
            <Button
              className="w-36"
              onClick={() => {
                saveProject({
                  id: project.id,
                  project: {
                    title: title,
                    program: project.program,
                    inputs: Object.values(project.inputs),
                    outputs: Object.values(project.outputs),
                  },
                });
              }}
              disabled={projectIsSaving}
            >
              {projectIsSaving ? (
                <>
                  <Loader className="mr-2 h-4 w-4" /> Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Save project
                </>
              )}
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                deleteProject({
                  id: project.id,
                })
              }
              disabled={projectIsDeleting}
            >
              {projectIsDeleting ? (
                <>
                  <Loader className="mr-2 h-4 w-4" /> Deleting...
                </>
              ) : (
                <>
                  <Trash className="mr-2 h-4 w-4" /> Delete project
                </>
              )}
            </Button>
          </div>
        ) : null}
      </div>
      <ScallopEditor program={project.program} />
    </main>
  );
};

export const getServerSideProps = (async (ctx) => {
  const projectId = ctx.params?.projectId;

  if (typeof projectId !== "string") {
    throw new Error("no project id");
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
