import { lintGutter } from "@codemirror/lint";
import type { inferRouterOutputs } from "@trpc/server";
import type { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import {
  Scallop,
  ScallopHighlighter,
  ScallopLinter,
} from "codemirror-lang-scallop";
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  Columns2,
  FileDown,
  Loader,
  MoreHorizontal,
  PanelLeft,
  PanelRight,
  Pencil,
  Play,
  Save,
  Settings,
  Table,
  UploadCloud,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import type { ElementRef } from "react";
import { useMemo, useRef, useState } from "react";
import type { ImperativePanelGroupHandle } from "react-resizable-panels";
import { toast } from "sonner";

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
import type { RelationTableProps } from "~/utils/relation-button";
import {
  parseRelationTables,
  relationButtonPlugin,
} from "~/utils/relation-button";

import { ImportFromDriveButton } from "./import-from-drive";
import { columns, payments, RelationTable } from "./relation-table";
import { SaveToDriveDialogContent } from "./save-to-drive";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
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
import { Textarea } from "./ui/textarea";

type Project = inferRouterOutputs<AppRouter>["project"]["getProjectById"];
type ScallopEditorProps =
  | {
      type: "playground";
      project: null;
    }
  | { type: "project"; project: Project; isAuthor: boolean };

const EditDetailsButton = ({
  defaultTitle,
  defaultDesc,
  setTitleFn,
  setDescFn,
}: {
  defaultTitle: string;
  defaultDesc: string;
  setTitleFn: React.Dispatch<React.SetStateAction<string>>;
  setDescFn: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [open, setOpen] = useState(false);
  const titleRef = useRef<ElementRef<"input">>(null);
  const descRef = useRef<ElementRef<"textarea">>(null);

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
          <span className="sr-only">Edit project details</span>
          <Pencil size={16} />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit project details</DialogTitle>
          <DialogDescription>
            Update your project name and description here. Make sure to save
            your project afterwards.
          </DialogDescription>
        </DialogHeader>

        <div>
          <Label htmlFor="title">Project name</Label>
          <Input
            id="title"
            ref={titleRef}
            placeholder={defaultTitle}
            defaultValue={defaultTitle}
          />
        </div>
        <div>
          <Label htmlFor="description">Project description</Label>
          <Textarea
            id="description"
            ref={descRef}
            placeholder={
              defaultDesc.length > 0 ? defaultDesc : "No description provided"
            }
            defaultValue={defaultDesc}
          />
        </div>

        <DialogFooter>
          <Button
            onClick={() => {
              setTitleFn(titleRef.current!.value);
              setDescFn(descRef.current!.value);
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
  const [description, setDescription] = useState(
    type === "playground"
      ? "Scallop Playground"
      : project.description
        ? project.description
        : "",
  );
  const [relations, setRelations] = useState<RelationTableProps[]>([]);

  const [searchResult, setSearchResult] = useState("");
  const [tableOpen, setTableOpen] = useState(false);

  const run = api.scallop.run.useMutation({
    onSuccess: (data) => {
      console.log(data);
      toast.success("Program successfully executed!");
    },
    onError: (error) => {
      toast.error(
        `An error occurred when running your program: ${error.message}`,
      );
    },
  });

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

  function replaceEditorContent(newProgram: string) {
    if (cmRef.current) {
      cmRef.current.view?.dispatch({
        changes: {
          from: 0,
          to: cmRef.current.view?.state.doc.toString().length,
          insert: newProgram,
        },
      });
    } else {
      throw new Error("CodeMirror not present in DOM??");
    }
  }

  const extensions = useMemo(() => {
    const syncRelations = EditorView.updateListener.of((viewUpdate) => {
      setRelations(parseRelationTables(viewUpdate.state));
    });

    return [
      Scallop(),
      ScallopHighlighter("light"),
      ScallopLinter,
      lintGutter(),
      syncRelations,
      relationButtonPlugin,
    ];
  }, []);

  let subtitle = "";
  if (type === "playground") {
    subtitle =
      "Get a feel for the language and workflow. Any work here will be lost on a browser refresh.";
  } else {
    const createdAt = new Date(project.createdAt);
    subtitle += `Created on ${createdAt.toLocaleDateString()} at ${createdAt.toLocaleTimeString()}`;
    subtitle +=
      " • " +
      (description.length > 0 ? description : "No description provided");
  }

  const isProjectAuthor = type === "project" && editor.isAuthor;
  const filteredRelations = relations.filter(({ table }) =>
    table.name.includes(searchResult),
  );

  return (
    <>
      <div className="grid grid-cols-1 gap-2.5 border-b-[1.5px] border-border p-4 md:grid-cols-2">
        <div className="col-span-1">
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            {title}
            {type === "project" && editor.isAuthor ? (
              <EditDetailsButton
                defaultTitle={title}
                defaultDesc={description}
                setTitleFn={setTitle}
                setDescFn={setDescription}
              />
            ) : null}
          </h2>
          <p className="truncate text-sm">{subtitle}</p>
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
                      title,
                      description,
                      program: cmRef.current!.view?.state.doc.toString(),
                    },
                  })
                }
                disabled={projectIsSaving}
              >
                {projectIsSaving ? (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save
              </Button>
            </>
          ) : null}

          {type === "playground" || editor.isAuthor ? (
            <ImportFromDriveButton
              changeEditorFunction={replaceEditorContent}
            />
          ) : null}

          <Dialog>
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
                <DialogTrigger asChild>
                  <DropdownMenuItem>
                    <UploadCloud
                      className="mr-1.5"
                      size={16}
                    />{" "}
                    Save to Google Drive
                  </DropdownMenuItem>
                </DialogTrigger>

                <DropdownMenuItem>
                  <FileDown
                    className="mr-1.5"
                    size={16}
                  />{" "}
                  Download as Scallop (.scl) file
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <SaveToDriveDialogContent cmRef={cmRef} />
          </Dialog>

          <AlertDialog>
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
                        onClick={() =>
                          panelGroupRef.current?.setLayout([25, 75])
                        }
                      >
                        <PanelLeft
                          className="mr-1.5"
                          size={16}
                        />{" "}
                        25%—75%
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() =>
                          panelGroupRef.current?.setLayout([50, 50])
                        }
                      >
                        <Columns2
                          className="mr-1.5"
                          size={16}
                        />{" "}
                        50%—50%
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() =>
                          panelGroupRef.current?.setLayout([75, 25])
                        }
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

                {type === "project" && !isProjectAuthor ? null : (
                  <>
                    <DropdownMenuSeparator />

                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem
                        className="text-destructive"
                        disabled={projectIsDeleting}
                      >
                        {isProjectAuthor ? <>Delete project</> : <>Reset</>}
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {type === "playground"
                    ? "Reset editor state?"
                    : `Delete project?`}
                </AlertDialogTitle>
                <AlertDialogDescription>{`This action cannot be undone. This will completely ${
                  type === "playground"
                    ? "clean and reset the editor, just like a browser refresh."
                    : `delete your project "${title}" and associated data.`
                }`}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/80"
                  onClick={
                    type === "project" && editor.isAuthor
                      ? () =>
                          deleteProject({
                            id: project.id,
                          })
                      : () =>
                          cmRef.current!.view?.dispatch({
                            changes: {
                              from: 0,
                              to: cmRef.current!.view.state.doc.toString()
                                .length,
                              insert: "",
                            },
                          })
                  }
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
            <Button
              onClick={() => {
                run.mutate({
                  program: cmRef.current!.view?.state.doc.toString() ?? "",
                  provenance: "topkproofs", // todo: get this from runtime
                  k: 3,
                });
                toast.loading("Running your program...");
              }}
              disabled={run.isLoading}
            >
              {run.isLoading ? (
                <>
                  <Loader
                    className="mr-1.5"
                    size={16}
                  />
                </>
              ) : (
                <>
                  <Play
                    className="mr-1.5"
                    size={16}
                  />
                </>
              )}{" "}
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

          <CodeMirror
            ref={cmRef}
            value={type === "playground" ? "" : project.program}
            extensions={extensions}
            style={{
              height: "calc(100% - 58px)",
              overflow: "auto",
            }}
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel
          defaultSize={25}
          minSize={25}
        >
          {tableOpen ? (
            <>
              <div className="flex justify-between gap-1.5 border-b-[1.5px] border-border p-2.5">
                <Button
                  onClick={() => {
                    setTableOpen(false);
                    panelGroupRef.current!.setLayout([75, 25]);
                  }}
                >
                  <Check
                    className="mr-1.5"
                    size={16}
                  />{" "}
                  Confirm edits
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setTableOpen(false);
                    panelGroupRef.current!.setLayout([75, 25]);
                  }}
                >
                  <X
                    className="mr-1.5"
                    size={16}
                  />{" "}
                  Cancel
                </Button>
              </div>

              <RelationTable
                columns={columns}
                data={payments}
              />
            </>
          ) : (
            <>
              <div className="flex justify-between gap-1.5 border-b-[1.5px] border-border p-2.5">
                <Badge
                  variant="secondary"
                  className="font-mono"
                >
                  {searchResult === ""
                    ? `${relations.length} total`
                    : `${filteredRelations.length} results`}
                </Badge>

                <Input
                  className="w-1/2 min-w-64"
                  placeholder="Search..."
                  onChange={(e) => setSearchResult(e.target.value)}
                />
              </div>

              <div className="flex h-[calc(100%-58px)] flex-col items-center gap-2.5 overflow-y-auto p-2.5">
                {relations.length === 0 ? (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-[1.5rem] text-center text-sm text-muted-foreground">
                    <div>
                      <p className="font-mono font-semibold">
                        No relations defined
                      </p>
                      <p className="max-w-[320px] ">
                        Create a new relation by writing one in the editor. They
                        will automatically appear here.
                      </p>
                    </div>
                    <Link
                      href="https://www.scallop-lang.org/doc/language/relation.html"
                      target="_blank"
                    >
                      <Button
                        role="link"
                        variant="secondary"
                        className="text-muted-foreground"
                      >
                        Documentation
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <>
                    {filteredRelations.map(({ relationNode, table }) => (
                      <>
                        <Card
                          key={table.name}
                          className="w-full"
                        >
                          <CardHeader>
                            <CardTitle className="flex justify-between font-mono font-bold">
                              <p className="w-1/2 truncate">{table.name}</p>{" "}
                              <Button
                                size="none"
                                variant="link"
                                onClick={() =>
                                  cmRef.current!.view?.dispatch({
                                    effects: EditorView.scrollIntoView(
                                      relationNode.node.from,
                                      { y: "start" },
                                    ),
                                  })
                                }
                              >
                                Jump to line
                                <ArrowUpRight
                                  size={16}
                                  className="ml-0.5"
                                />
                              </Button>
                            </CardTitle>
                            <CardDescription>
                              {table.facts[0]
                                ? `${table.facts[0].length}-tuple facts`
                                : "Empty relation"}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="font-mono text-sm">
                            <p className="truncate">
                              {table.facts[0]
                                ? `(${table.facts[0]
                                    .map(({ content }) => content)
                                    .join(", ")})`
                                : "<no facts defined>"}
                            </p>
                            {table.facts[1] ? (
                              <p className="text-muted-foreground">
                                ...and {table.facts.length - 1} more row(s)
                              </p>
                            ) : null}
                          </CardContent>
                          <CardFooter>
                            <Button
                              variant="secondary"
                              onClick={() => {
                                setTableOpen(true);
                                panelGroupRef.current!.setLayout([35, 65]);
                              }}
                            >
                              <Table
                                className="mr-1.5"
                                size={16}
                              />{" "}
                              Open visual editor
                            </Button>
                          </CardFooter>
                        </Card>
                      </>
                    ))}
                  </>
                )}
              </div>
            </>
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
};

export { ScallopEditor };
