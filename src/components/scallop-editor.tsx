import { lintGutter } from "@codemirror/lint";
import type { ColumnDef } from "@tanstack/react-table";
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
  ListX,
  Loader,
  Pencil,
  Play,
  Save,
  Table as TableIcon,
  Tag,
  X,
} from "lucide-react";
import Head from "next/head";
import Link from "next/link";
import type { ElementRef } from "react";
import { useMemo, useRef, useState } from "react";
import type { ImperativePanelGroupHandle } from "react-resizable-panels";
import { toast } from "sonner";

import { ImportFromDriveButton } from "~/components/import-from-drive";
import { RelationTable } from "~/components/relation-table";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable";
import { Switch } from "~/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Textarea } from "~/components/ui/textarea";
import type { AppRouter } from "~/server/api/root";
import { api } from "~/utils/api";
import type {
  ParsedInputProps,
  Table,
  TableCell,
} from "~/utils/relation-button";
import {
  parseInputRelations,
  relationButtonPluginFactory,
} from "~/utils/relation-button";

import { ExportMenu } from "./editor/export-menu";
import { MoreOptionsMenu } from "./editor/more-options-menu";
import type { RuntimeProps } from "./editor/runtime-settings";
import { RuntimeSettings } from "./editor/runtime-settings";
import { Badge } from "./ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

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
  const [runtime, setRuntime] = useState<RuntimeProps>({
    provenance: "topkproofs",
    k: 3,
  });

  const [inputs, setInputs] = useState<ParsedInputProps[]>([]);
  const [outputs, setOutputs] = useState<Table[]>([]);

  const [searchResult, setSearchResult] = useState("");

  const [tableOpen, setTableOpen] = useState(false);
  const [tabValue, setTabValue] = useState("inputs");
  const [relationTable, setRelationTable] = useState<Table>({
    name: "",
    from: 0,
    to: 0,
    facts: [],
  });

  const [tableData, setTableData] = useState<Record<string, string>[]>([]);

  const run = api.scallop.run.useMutation({
    onSuccess: (data) => {
      const newOutputs: Table[] = [];

      for (const [name, factsArr] of Object.entries(data)) {
        const facts: TableCell[][] = [];

        factsArr.forEach(({ tuple }) => {
          const fact: TableCell[] = [];

          tuple.forEach((arg) => {
            fact.push({ content: arg, from: 0, to: 0 });
          });

          facts.push(fact);
        });

        newOutputs.push({ name, facts });
      }

      setOutputs(newOutputs);
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

  function ImportEditorContent(newProgram: string) {
    if (cmRef.current?.view) {
      replaceEditorContent(
        newProgram,
        0,
        cmRef.current.view?.state.doc.toString().length,
      );
    }
  }

  function replaceEditorContent(newProgram: string, f: number, t: number) {
    if (cmRef.current) {
      cmRef.current.view?.dispatch({
        changes: {
          from: f,
          to: t,
          insert: newProgram,
        },
      });
    } else {
      throw new Error("CodeMirror not present in DOM??");
    }
  }

  const extensions = useMemo(() => {
    const syncRelations = EditorView.updateListener.of((viewUpdate) => {
      setInputs(parseInputRelations(viewUpdate.state));
    });

    return [
      Scallop(),
      ScallopHighlighter("light"),
      ScallopLinter,
      lintGutter(),
      syncRelations,
      relationButtonPluginFactory(
        setTableOpen,
        setRelationTable,
        panelGroupRef,
      ),
    ];
  }, []);

  // don't constantly recalculate when 1) no new table is opened, or 2) the table is opened
  // but nothing has changed. there could be hundreds, thousands of rows
  const currTable = useMemo(() => {
    const columns: ColumnDef<Record<string, string>>[] = [];
    const data: Record<string, string>[] = [];

    // if the relation has no facts, we return early
    if (!relationTable.facts[0]) {
      return { columns, data };
    }

    const numArgs = relationTable.facts[0].tuple.length;

    // add the tag column
    columns.push({
      id: "tag",
      accessorKey: "tag",
      header: () => (
        <>
          <span className="sr-only">Tag</span>
          <Tag
            size={18}
            aria-label="Tag"
            className="stroke-muted-foreground"
          />
        </>
      ),
      accessorFn: (originalRow) => originalRow.tag,
    });

    // add the args columns
    for (let i = 0; i < numArgs; i++) {
      const argN = `arg${i}`;

      columns.push({
        accessorKey: argN,
        header: argN,
        accessorFn: (originalRow) => originalRow[argN],
      });
    }

    columns.push({
      id: "deleteRow",
      cell: ({ table, row }) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => table.options.meta?.removeRow(row.index)}
            >
              <span className="sr-only">Delete row</span>
              <ListX size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete row</p>
          </TooltipContent>
        </Tooltip>
      ),
    });

    relationTable.facts.forEach((row) => {
      const fact: Record<string, string> = {};
      fact.tag = row.tag;

      row.tuple.forEach((arg, idx) => {
        fact[`arg${idx}`] = arg;
      });

      data.push(fact);
    });

    setTableData(data);

    return { columns, data };
  }, [relationTable]);

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

  const filteredInputs = useMemo(
    () => inputs.filter(({ table }) => table.name.includes(searchResult)),
    [inputs, searchResult],
  );

  const filteredOutputs = useMemo(
    () => outputs.filter((table) => table.name.includes(searchResult)),
    [outputs, searchResult],
  );

  const updateProgram = () => {
    // is empty table
    if (!relationTable.facts[0]) {
      return;
    }

    let newProgram = tableData
      .map((row) => {
        const rowValues = Object.entries(row)
          .filter(([key]) => key !== "tag")
          .map(([_, value]) => value);
        let rowString = rowValues.join(", ");
        rowString = row.tag
          ? `  ${row.tag}::(${rowString}),`
          : `  (${rowString}),`;
        return rowString;
      })
      .join("\n");

    newProgram = `{\n${newProgram}\n}`;

    replaceEditorContent(newProgram, relationTable.from, relationTable.to);
  };

  return (
    <>
      <Head>
        <title>{`${title} — Scallop`}</title>
      </Head>

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
              <span className="flex h-9 items-center gap-1.5 rounded-md border border-input px-4 py-2">
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
            <ImportFromDriveButton changeEditorFunction={ImportEditorContent} />
          ) : null}

          <ExportMenu
            cmRef={cmRef}
            projectTitle={title}
          />

          <MoreOptionsMenu
            editor={editor}
            panelGroupRef={panelGroupRef}
            cmRef={cmRef}
            projectTitle={title}
          />
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
                  provenance: runtime.provenance,
                  k:
                    runtime.provenance === "topkproofs" ? runtime.k : undefined,
                });
                toast.loading("Running your program...");
              }}
              disabled={run.isLoading}
            >
              {run.isLoading ? (
                <>
                  <Loader
                    className="mr-1.5 animate-spin"
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

            <RuntimeSettings
              runtime={runtime}
              setRuntime={setRuntime}
            />
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
              <div className="flex items-center justify-between gap-2.5 border-b-[1.5px] border-border p-2.5">
                <Button
                  onClick={() => {
                    setTableOpen(false);
                    updateProgram();
                    panelGroupRef.current!.setLayout([75, 25]);
                  }}
                >
                  <Check
                    className="mr-1.5"
                    size={16}
                  />{" "}
                  Confirm
                </Button>
                <p className="w-1/3 truncate text-center">
                  Relation:{" "}
                  <span className="font-mono font-bold">
                    {relationTable.name}
                  </span>
                </p>
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

              <div className="relative h-[calc(100%-58px)] overflow-auto">
                <RelationTable
                  columns={currTable.columns}
                  data={tableData}
                  setTableData={setTableData}
                />
              </div>
            </>
          ) : (
            <Tabs
              defaultValue="inputs"
              value={tabValue}
              onValueChange={setTabValue}
              className="h-[calc(100%-68px)]"
            >
              <div className="flex justify-between gap-1.5 border-b-[1.5px] border-border p-2.5">
                <TabsList className="grid h-9 w-1/2 max-w-48 grid-cols-2">
                  <TabsTrigger value="inputs">Inputs</TabsTrigger>
                  <TabsTrigger value="outputs">Outputs</TabsTrigger>
                </TabsList>

                <Input
                  className="w-1/2"
                  placeholder="Search..."
                  onChange={(e) => setSearchResult(e.target.value)}
                />
              </div>

              <div className="h-full overflow-y-auto ">
                <TabsContent
                  value="inputs"
                  className="flex flex-col items-center gap-2.5 data-[state=active]:h-full data-[state=active]:p-2.5"
                >
                  {inputs.length === 0 ? (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-[1.5rem] text-center text-sm text-muted-foreground">
                      <div>
                        <p className="font-mono font-semibold">
                          No input relations defined
                        </p>
                        <p className="max-w-[320px] ">
                          Create a new input relation by writing one in the
                          editor. They will automatically appear here.
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
                      <Badge
                        variant="outline"
                        className="font-mono"
                      >
                        {searchResult === ""
                          ? `${inputs.length} input relations`
                          : `${filteredInputs.length} results`}
                      </Badge>

                      {filteredInputs.map(
                        ({ relationNode, table: { name, facts } }) => (
                          <Card
                            key={name}
                            className="w-full"
                          >
                            <CardHeader>
                              <CardTitle className="flex justify-between font-mono font-bold">
                                <p className="w-1/2 truncate">{name}</p>{" "}
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
                                {facts[0]
                                  ? `${facts[0].length}-tuple facts`
                                  : "Empty input relation"}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="font-mono text-sm">
                              <p className="truncate">
                                {facts[0]
                                  ? `(${facts[0]
                                      .map(({ content }) => content)
                                      .join(", ")})`
                                  : "<no facts defined>"}
                              </p>
                              {facts[1] ? (
                                <p className="text-muted-foreground">
                                  ...and {facts.length - 1} more row(s)
                                </p>
                              ) : null}
                            </CardContent>
                            <CardFooter>
                              <Button
                                variant="secondary"
                                onClick={() => {
                                  setRelationTable({ name, facts });
                                  setTableOpen(true);
                                  panelGroupRef.current!.setLayout([30, 70]);
                                }}
                              >
                                <TableIcon
                                  className="mr-1.5"
                                  size={16}
                                />{" "}
                                Open visual editor
                              </Button>
                            </CardFooter>
                          </Card>
                        ),
                      )}
                    </>
                  )}
                </TabsContent>

                <TabsContent
                  value="outputs"
                  className="flex flex-col items-center gap-2.5 data-[state=active]:h-full data-[state=active]:p-2.5"
                >
                  {outputs.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-center text-sm text-muted-foreground">
                      <p className="font-mono font-semibold">
                        No output relations
                      </p>
                      <p className="max-w-[320px] text-pretty">
                        Any output relations from running your program will be
                        displayed here.
                      </p>
                    </div>
                  ) : (
                    <>
                      <Badge
                        variant="outline"
                        className="font-mono"
                      >
                        {searchResult === ""
                          ? `${outputs.length} output relations`
                          : `${filteredOutputs.length} results`}
                      </Badge>

                      {filteredOutputs.map(({ name, facts }) => (
                        <Card
                          key={name}
                          className="w-full"
                        >
                          <CardHeader>
                            <CardTitle className="flex justify-between font-mono font-bold">
                              <p className="w-1/2 truncate">{name}</p>{" "}
                            </CardTitle>
                            <CardDescription>
                              {facts[0]
                                ? `${facts[0].length}-tuple facts`
                                : "Empty output relation"}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="font-mono text-sm">
                            <p className="truncate">
                              {facts[0]
                                ? `(${facts[0]
                                    .map(({ content }) => content)
                                    .join(", ")})`
                                : "<no facts specified>"}
                            </p>
                            {facts[1] ? (
                              <p className="text-muted-foreground">
                                ...and {facts.length - 1} more row(s)
                              </p>
                            ) : null}
                          </CardContent>
                          <CardFooter>
                            <Button
                              variant="secondary"
                              onClick={() => {
                                setRelationTable({ name, facts });
                                setTableOpen(true);
                                panelGroupRef.current!.setLayout([30, 70]);
                              }}
                            >
                              <TableIcon
                                className="mr-1.5"
                                size={16}
                              />{" "}
                              Open in table view
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </>
                  )}
                </TabsContent>
              </div>
            </Tabs>
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
};

export { ScallopEditor, type ScallopEditorProps };
