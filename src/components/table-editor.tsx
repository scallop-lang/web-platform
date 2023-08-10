import { ListPlus, Plus, PlusSquare, Trash, X } from "lucide-react";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  argumentTypes,
  type Argument,
  type ArgumentType,
  type RelationRecord,
  type SclRelation,
} from "~/utils/schemas-types";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const TableHeader = ({ relation }: { relation: SclRelation }) => {
  const header = relation.args.map((arg, index) => {
    return (
      <div
        className="w-full cursor-default font-mono text-sm font-medium leading-none"
        key={index}
      >
        {arg.name ? `${arg.name}: ${arg.type}` : `${arg.type}`}
      </div>
    );
  });

  return <div className="flex">{header}</div>;
};

const InputTable = ({
  relation,
  inputs,
  setInputs,
}: {
  relation: SclRelation;
  inputs: RelationRecord;
  setInputs: React.Dispatch<React.SetStateAction<RelationRecord>>;
}) => {
  // facts can only be added for input relations
  function addFact() {
    const values: string[] = [];

    // create an entry for each argument
    relation.args.forEach((arg) => {
      switch (arg.type) {
        case "String":
          values.push("String");
          break;
        case "Boolean":
          values.push("Boolean");
          break;
        case "Float":
          values.push("Float");
          break;
        case "Integer":
          values.push("Integer");
          break;
      }
    });

    // first add the new fact to the relation itself
    // for now, probability is hardcoded to be 1
    relation.facts = [...relation.facts, [1, values]];

    // then update inputs with the new relation
    const inputsCopy = { ...inputs };
    inputsCopy[relation.name] = relation;

    setInputs(inputsCopy);
  }

  const rowList = relation.facts.map((fact, i) => {
    function getCell(type: ArgumentType, colIndex: number) {
      switch (type) {
        case "Boolean":
          return (
            <Select defaultValue="false">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={"true"}>true</SelectItem>
                <SelectItem value={"false"}>false</SelectItem>
              </SelectContent>
            </Select>
          );
        default:
          return (
            <Input
              key={colIndex}
              type="text"
              defaultValue={fact[1][colIndex]}
              className="cursor-pointer hover:bg-secondary focus:bg-background"
            />
          );
      }
    }

    const colList = relation.args.map((arg, index) => getCell(arg.type, index));

    return (
      <div
        className="flex space-x-2"
        key={i}
      >
        {colList}
      </div>
    );
  });

  return (
    <div className="flex h-full flex-col justify-between space-y-3">
      <Card className="sticky p-3">
        <TableHeader relation={relation} />
      </Card>
      <Card className="grid grow gap-4 overflow-y-auto p-3">
        <div className="flex flex-col space-y-2">{rowList}</div>
      </Card>
      <Button
        onClick={addFact}
        className="shrink-0"
      >
        <ListPlus className="mr-2 h-4 w-4" /> Add row
      </Button>
    </div>
  );
};

const OutputTable = ({ relation }: { relation: SclRelation }) => {
  return (
    <div className="flex h-full flex-col space-y-5">
      <TableHeader relation={relation} />
      <div className="flex grow items-center justify-center text-sm text-muted-foreground">
        No output to display... yet...?
      </div>
    </div>
  );
};

const CreateRelationDialog = ({
  addRelation,
}: {
  addRelation: (relation: SclRelation) => void;
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  // current state of the relation being created
  const [isOutput, setIsOutput] = useState(false);
  const [relationName, setRelationName] = useState("");
  const [args, setArgs] = useState<Argument[]>([]);

  function addArgument() {
    const argsCopy = args.slice();

    setArgs([
      ...argsCopy,
      {
        name: undefined,
        type: "String",
      },
    ]);
  }

  function removeArgument(index: number) {
    const argsCopy = args.slice();
    argsCopy.splice(index, 1);

    setArgs(argsCopy);
  }

  function createRelation(): SclRelation {
    return {
      type: isOutput ? "output" : "input",
      name: relationName,
      args: args,
      probability: false, // temporary
      facts: [],
    };
  }

  function closeDialog() {
    // we should also reset the dialog state
    setIsOutput(false);
    setRelationName("");
    setArgs([]);

    setDialogOpen(false);
  }

  const argListEmpty = args.length === 0;
  const argumentList = args.map((argument, index) => (
    <div
      className="flex w-full justify-between space-x-4"
      key={index}
    >
      <Input
        type="text"
        onChange={(name) => (argument.name = name.target.value)}
        placeholder="Name (optional)"
        className="basis-1/2"
      />
      <Select
        onValueChange={(type) => (argument.type = type as ArgumentType)}
        defaultValue="String"
      >
        <SelectTrigger className="basis-1/3">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {argumentTypes.map((type, index) => (
            <SelectItem
              key={index}
              value={type}
            >
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <TooltipProvider delayDuration={400}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => removeArgument(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete argument</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  ));

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(open) => {
        setDialogOpen(open);

        if (!open) {
          closeDialog();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <PlusSquare className="mr-2 h-4 w-4" /> Create relation
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create {isOutput ? "output" : "input"} relation
          </DialogTitle>
          <DialogDescription>
            Name your relation, then add your arguments below. Each argument
            takes an optional name and a datatype.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-between space-x-10 rounded-md border border-border p-4">
          <div className="grid gap-1">
            <Label htmlFor="io-switch">{isOutput ? "Output" : "Input"}</Label>
            <p className="text-sm text-muted-foreground">
              {isOutput
                ? "These tables are readonly and will contain your output relations upon running the program."
                : "These tables are editable in the visual editor and are used as facts in your program."}
            </p>
          </div>
          <Switch
            id="io-switch"
            checked={isOutput}
            onCheckedChange={setIsOutput}
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="relation-name">Relation name</Label>
          <Input
            type="text"
            id="relation-name"
            placeholder="Required"
            value={relationName}
            onChange={(e) => setRelationName(e.target.value)}
          />
        </div>
        <div className="grid gap-1.5">
          <p className="cursor-default text-sm font-medium leading-none">
            Arguments
          </p>
          <Button
            onClick={addArgument}
            id="add-argument"
          >
            Add new argument
          </Button>
          <div className="flex max-h-[33vh] flex-col items-center justify-between space-y-2 overflow-y-auto rounded-md border border-border p-4">
            {argListEmpty ? (
              <span className="cursor-default text-sm text-muted-foreground">
                Currently empty. At least one argument is required.
              </span>
            ) : (
              argumentList
            )}
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={closeDialog}
          >
            <Trash className="mr-2 h-4 w-4" /> Delete
          </Button>
          <Button
            disabled={argListEmpty || relationName === ""}
            onClick={() => {
              addRelation(createRelation());
              closeDialog();
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const RelationSelect = ({
  inputs,
  outputs,
  bothEmpty,
  setActiveRelation,
}: {
  inputs: RelationRecord;
  outputs: RelationRecord;
  bothEmpty: boolean;
  setActiveRelation: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const parseRelations = (record: RelationRecord) => {
    const selectItems: React.ReactNode[] = [];
    let index = 0;

    for (const [name, relation] of Object.entries(record)) {
      const types = `(${relation.args
        .map((arg) => (arg.name ? `${arg.name}: ${arg.type}` : `${arg.type}`))
        .join(", ")})`;

      selectItems.push(
        <SelectItem
          key={index}
          value={name}
        >
          {name + types}
        </SelectItem>
      );

      index += 1;
    }

    return selectItems;
  };

  const inputItems = bothEmpty ? [] : parseRelations(inputs);
  const outputItems = bothEmpty ? [] : parseRelations(outputs);

  const noItem = (
    <SelectItem
      disabled
      value="none"
    >
      None
    </SelectItem>
  );

  return (
    <Select
      onValueChange={setActiveRelation}
      disabled={bothEmpty}
    >
      <SelectTrigger className="basis-1/2">
        <SelectValue
          placeholder={bothEmpty ? "Empty" : "Nothing selected yet"}
        ></SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Input relations</SelectLabel>
          {inputItems.length === 0 ? noItem : inputItems}
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Output relations</SelectLabel>
          {outputItems.length === 0 ? noItem : outputItems}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

const TableEditor = ({
  inputs,
  outputs,
  setInputs,
  setOutputs,
}: {
  inputs: RelationRecord;
  outputs: RelationRecord;
  setInputs: React.Dispatch<React.SetStateAction<RelationRecord>>;
  setOutputs: React.Dispatch<React.SetStateAction<RelationRecord>>;
}) => {
  const [activeRelation, setActiveRelation] = useState("");

  // adds newly created relation to inputs or outputs, depending on
  // what was chosen in the create relation dialog
  function addRelation(relation: SclRelation) {
    if (relation.type === "input") {
      const inputsCopy = { ...inputs };
      inputsCopy[relation.name] = relation;
      setInputs(inputsCopy);
    } else {
      const outputsCopy = { ...outputs };
      outputsCopy[relation.name] = relation;
      setOutputs(outputsCopy);
    }
  }

  const bothEmpty =
    Object.keys(inputs).length === 0 && Object.keys(outputs).length === 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between space-x-10">
        <CreateRelationDialog addRelation={addRelation} />
        <RelationSelect
          inputs={inputs}
          outputs={outputs}
          bothEmpty={bothEmpty}
          setActiveRelation={setActiveRelation}
        />
      </div>
      <Card className="h-0 grow p-4">
        {bothEmpty ? (
          <div className="flex h-full cursor-default items-center justify-center text-sm text-muted-foreground">
            You don&apos;t have any relations yet. Create one first!
          </div>
        ) : activeRelation ? (
          inputs[activeRelation] ? (
            <InputTable
              relation={inputs[activeRelation]!}
              inputs={inputs}
              setInputs={setInputs}
            />
          ) : (
            <OutputTable relation={outputs[activeRelation]!} />
          )
        ) : (
          <div className="flex h-full cursor-default items-center justify-center text-sm text-muted-foreground">
            Select a relation table to view its contents.
          </div>
        )}
      </Card>
    </div>
  );
};

export default TableEditor;
