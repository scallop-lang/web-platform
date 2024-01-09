import type { inferRouterOutputs } from "@trpc/server";
import { Loader, Save, Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
} from "next/types";
import type { ElementRef } from "react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { ScallopEditor } from "~/components/scallop-editor";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import type { AppRouter } from "~/server/api/root";
import { api } from "~/utils/api";
import { cn } from "~/utils/cn";
import type { RelationRecord } from "~/utils/schemas-types";
import { generateSSRHelper } from "~/utils/ssr-helper";

type Project = inferRouterOutputs<AppRouter>["project"]["getProjectById"];

const ProjectPage = ({
  project,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: session } = useSession();
  const router = useRouter();

  const projectTitleRef = useRef<ElementRef<"input">>(null);
  const [published, setPublished] = useState<boolean>(project.published);

  const { mutate: saveProject, isLoading: projectIsSaving } =
    api.project.updateProjectById.useMutation({
      onSuccess: () => toast.success("Project successfully saved!"),
      onError: (error) =>
        toast.error(`Project failed to save! Reason: ${error.message}`),
    });

  const { mutate: deleteProject, isLoading: projectIsDeleting } =
    api.project.deleteProjectById.useMutation({
      onSuccess: async ({ title }) => {
        toast.success(
          <p>
            Project <b>{title}</b> successfully deleted!
          </p>,
        );
        await router.push("/dashboard");
      },
      onError: (error) =>
        toast.error(`Project failed to delete! Reason: ${error.message}`),
    });

  const inputsCopy: RelationRecord = {};
  const outputsCopy: RelationRecord = {};

  project.inputs.forEach((input) => {
    inputsCopy[input.name] = input;
  });

  project.outputs.forEach((output) => {
    outputsCopy[output.name] = output;
  });

  const isAuthor = session?.user?.id === project.authorId;
  const createdAt = new Date(project.createdAt);

  return (
    <main className="flex h-[calc(100vh-53px)] w-full flex-col bg-background">
      <div className="grid grid-cols-2 border-b-[1.5px] border-border p-4">
        <div className="col-span-1">
          {isAuthor ? (
            <Input
              ref={projectTitleRef}
              type="text"
              defaultValue={project.title}
              className="w-fit scroll-m-20 text-2xl font-semibold tracking-tight"
              placeholder={project.title}
            />
          ) : (
            <h3 className="w-fit scroll-m-20 text-2xl font-semibold tracking-tight">
              {project.title}
            </h3>
          )}
          <p className={cn("text-sm", isAuthor ? "mt-1.5" : false)}>
            Created on {createdAt.toLocaleDateString()} at{" "}
            {createdAt.toLocaleTimeString()}
          </p>
        </div>

        <div className="flex items-start justify-end gap-1.5">
          {isAuthor ? (
            <div className="flex items-start justify-end gap-1.5">
              <span className="flex items-center space-x-2">
                <Label htmlFor="publish-switch">
                  {published ? "Published!" : "Unpublished"}
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
                onClick={() => {
                  saveProject({
                    id: project.id,
                    project: {
                      title: projectTitleRef.current!.value,
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
                    <Save className="mr-2 h-4 w-4" /> Save
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
                    <Trash className="mr-2 h-4 w-4" /> Delete
                  </>
                )}
              </Button>
            </div>
          ) : null}

          <Button>Quick Layout... (dropdown)</Button>
          <Button>Export... (dropdown)</Button>
          <Button>Import</Button>
        </div>
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
