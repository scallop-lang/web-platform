import { Plus, PlusSquare, Trash, X } from "lucide-react";
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
  type InputRecord,
  type OutputRecord,
  type ScallopInput,
  type ScallopOutput,
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

// const Table = ({ relation }: { relation: ScallopInput | ScallopOutput }) => {
//   function addFact(probability: number, values: string[]) {
//     switch (relation.type) {id
//       case "input":
//         const prevFacts = relation.facts;
//         const values: string[] = [];

//         relation.args.forEach((arg) => {
//           // THESE SHOULD BE CONVERTED TO THE RIGHT TYPE
//           values.push(""); // empty....
//         });
//         const newFact: [number, string[]] = [probability, values];
//         relation.facts = [...relation.facts, newFact];
//         break;
//       case "output":
//         break;
//     }
//   }

//   let tableRows: React.ReactNode[] = [];

//   switch (relation.type) {
//     case "input":
//       tableRows = relation.facts.map((fact, index) => {
//         // tuple array, each element is number, string[]
//         // row elements = string[], or this is fact[1]...........
//         return (
//           <div
//             className="flex space-x-2"
//             key={index}
//           >
//             {fact[1].map((arg) => (
//               <Input
//                 key={arg}
//                 type="text"
//                 value={arg}
//                 className="grow"
//               />
//             ))}
//           </div>
//         );
//       });
//       console.log(tableRows);
//       break;
//     case "output":
//       break;
//   }

//   console.log(tableRows);

//   // that button is supposed to add rows, have it show when you hover over the last row
//   return <div className="flex flex-col space-y-2">{tableRows}</div>;
// };

const CreateRelationDialog = ({
  addRelation,
}: {
  addRelation: (relation: ScallopInput | ScallopOutput) => void;
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

  function createRelation(): ScallopInput | ScallopOutput {
    if (isOutput) {
      return {
        name: relationName,
        args: args,
      };
    }

    // else, return input relation
    return {
      name: relationName,
      args: args,
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
  setActiveRelation,
}: {
  inputs: InputRecord;
  outputs: OutputRecord;
  setActiveRelation: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const parseRelations = (record: InputRecord | OutputRecord) => {
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

  const inputItems = parseRelations(inputs);
  const outputItems = parseRelations(outputs);
  const bothEmpty = inputItems.length === 0 && outputItems.length === 0;

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
          placeholder={
            bothEmpty
              ? "You don't have any relations yet. Create one first!"
              : "Select a relation table to view its contents."
          }
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
  inputs: InputRecord;
  outputs: OutputRecord;
  setInputs: React.Dispatch<React.SetStateAction<InputRecord>>;
  setOutputs: React.Dispatch<React.SetStateAction<OutputRecord>>;
}) => {
  const [activeRelation, setActiveRelation] = useState("");

  // adds newly created relation to inputs or outputs, depending on
  // what was chosen in the create relation dialog
  function addRelation(relation: ScallopInput | ScallopOutput) {
    if ("facts" in relation) {
      const inputsCopy = { ...inputs };
      inputsCopy[relation.name] = relation;
      setInputs(inputsCopy);
    } else {
      const outputsCopy = { ...outputs };
      outputsCopy[relation.name] = relation;
      setOutputs(outputsCopy);
    }
  }

  console.log("inputs:", inputs);
  console.log("outputs:", outputs);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between space-x-10">
        <CreateRelationDialog addRelation={addRelation} />
        <RelationSelect
          inputs={inputs}
          outputs={outputs}
          setActiveRelation={setActiveRelation}
        />
      </div>
      <Card className="h-0 grow p-4">
        <div>ACTIVE RELATION: {activeRelation}</div>
      </Card>
    </div>
  );
};

export default TableEditor;
