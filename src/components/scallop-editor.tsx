import type { inferRouterOutputs } from "@trpc/server";
import type { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import {
  ChevronDown,
  Columns2,
  Download,
  FileDown,
  Loader,
  MoreHorizontal,
  PanelLeft,
  PanelRight,
  Pencil,
  Play,
  Plus,
  Save,
  Settings,
  UploadCloud,
} from "lucide-react";
import { useRouter } from "next/router";
import type { ElementRef } from "react";
import { useRef, useState } from "react";
import type { ImperativePanelGroupHandle } from "react-resizable-panels";
import { toast } from "sonner";

import { CodeEditor } from "~/components/code-editor";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable";
import type { AppRouter } from "~/server/api/root";
import { api } from "~/utils/api";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

type Project = inferRouterOutputs<AppRouter>["project"]["getProjectById"];
type ScallopEditorProps =
  | {
      type: "playground";
      project: null;
    }
  | { type: "project"; project: Project; isAuthor: boolean };

const EditTitleButton = ({
  defaultTitle,
  dispatchFn,
}: {
  defaultTitle: string;
  dispatchFn: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<ElementRef<"input">>(null);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          size="none"
          variant="none"
          className="ml-2"
        >
          <span className="sr-only">Edit project name</span>
          <Pencil size={16} />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit project name</DialogTitle>
          <DialogDescription>
            Update your project name. Make sure to save your project afterwards.
          </DialogDescription>
        </DialogHeader>
        <Input
          ref={inputRef}
          defaultValue={defaultTitle}
        />
        <DialogFooter>
          <Button
            onClick={() => {
              dispatchFn(inputRef.current!.value);
              setOpen(false);
            }}
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ScallopEditor = ({ editor }: { editor: ScallopEditorProps }) => {
  const { type, project } = editor;

  const router = useRouter();
  const panelGroupRef = useRef<ImperativePanelGroupHandle>(null);
  const cmRef = useRef<ReactCodeMirrorRef>(null);

  const [published, setPublished] = useState<boolean>(
    type === "playground" ? false : project.published,
  );
  const [title, setTitle] = useState(
    type === "playground" ? "Playground" : project.title,
  );
  const [program, setProgram] = useState(
    editor.type === "playground" ? "" : editor.project.program,
  );

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

  let subtitle;
  if (type === "playground") {
    subtitle =
      "Get a feel for the language and workflow. Any work here will be lost on a browser refresh.";
  } else {
    const createdAt = new Date(project.createdAt);
    subtitle = `Created on ${createdAt.toLocaleDateString()} at ${createdAt.toLocaleTimeString()}`;
  }

  const isProjectAuthor = type === "project" && editor.isAuthor;

  return (
    <>
      <div className="grid grid-cols-1 gap-2.5 border-b-[1.5px] border-border p-4 md:grid-cols-2">
        <div className="col-span-1">
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            {title}
            {isProjectAuthor ? (
              <EditTitleButton
                defaultTitle={title}
                dispatchFn={setTitle}
              />
            ) : null}
          </h2>
          <p className="text-sm">{subtitle}</p>
        </div>

        <div className="col-span-1 flex flex-wrap items-center gap-2 sm:justify-end">
          {type === "project" && editor.isAuthor ? (
            <>
              <span className="flex items-center gap-1.5">
                <Label htmlFor="publish-switch">
                  {published ? "Published!" : "Unpublished"}
                </Label>
                <Switch
                  id="publish-switch"
                  checked={published}
                  onCheckedChange={(value) => {
                    setPublished(value);
                    saveProject({
                      id: project.id,
                      project: {
                        published: value,
                      },
                    });
                  }}
                />
              </span>

              <Button
                variant="outline"
                onClick={() =>
                  saveProject({
                    id: project.id,
                    project: {
                      title: title,
                      program: program,
                      inputs: Object.values(project.inputs),
                      outputs: Object.values(project.outputs),
                    },
                  })
                }
                disabled={projectIsSaving}
              >
                {projectIsSaving ? (
                  <Loader className="mr-2 h-4 w-4" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save
              </Button>
            </>
          ) : null}

          {type === "playground" || editor.isAuthor ? (
            <Button variant="outline">
              <Download
                className="mr-1.5"
                size={16}
              />{" "}
              Import
            </Button>
          ) : null}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Export...{" "}
                <ChevronDown
                  className="ml-1.5"
                  size={15}
                />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <UploadCloud
                  className="mr-1.5"
                  size={16}
                />{" "}
                Save to Google Drive
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileDown
                  className="mr-1.5"
                  size={16}
                />{" "}
                Download as Scallop (.scl) file
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <span className="sr-only">More options</span>
                <MoreHorizontal size={18} />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Layout...</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem
                      onClick={() => panelGroupRef.current?.setLayout([25, 75])}
                    >
                      <PanelLeft
                        className="mr-1.5"
                        size={16}
                      />{" "}
                      25%—75%
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => panelGroupRef.current?.setLayout([50, 50])}
                    >
                      <Columns2
                        className="mr-1.5"
                        size={16}
                      />{" "}
                      50%—50%
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => panelGroupRef.current?.setLayout([75, 25])}
                    >
                      <PanelRight
                        className="mr-1.5"
                        size={16}
                      />{" "}
                      75%—25%
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-red-600"
                onClick={
                  type === "project" && editor.isAuthor
                    ? () =>
                        deleteProject({
                          id: project.id,
                        })
                    : undefined
                }
                disabled={projectIsDeleting}
              >
                {isProjectAuthor ? <>Delete project</> : <>Reset</>}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <ResizablePanelGroup
        direction="horizontal"
        ref={panelGroupRef}
      >
        <ResizablePanel
          defaultSize={75}
          minSize={25}
        >
          <div className="flex justify-between gap-1.5 border-b-[1.5px] border-border p-2.5">
            <Button>
              <Play
                className="mr-1.5"
                size={16}
              />{" "}
              Run
            </Button>

            <Button variant="outline">
              <Settings
                className="mr-1.5"
                size={16}
              />{" "}
              Runtime
            </Button>
          </div>

          <CodeEditor
            cmRef={cmRef}
            program={program}
            setProgram={setProgram}
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel
          defaultSize={25}
          minSize={25}
        >
          <div className="flex gap-1.5 border-b-[1.5px] border-border p-2.5">
            <Button className="w-1/2">
              <Plus
                className="shrink-0 md:mr-1.5"
                size={16}
              />{" "}
              <span className="hidden md:inline">
                New <span className="hidden lg:inline">relation</span>
              </span>
            </Button>

            <Input
              className="w-1/2"
              placeholder="Search..."
            />
          </div>

          <div className="flex h-full items-center justify-center">
            hi i&apos;m a table
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
};

export { ScallopEditor };
