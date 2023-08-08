import { Check, Plus, PlusSquare, Trash, X } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  type ScallopInput,
  type ScallopOutput,
} from "~/server/api/routers/scallop";
import capitalize from "~/utils/capitalize";
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
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface Argument {
  id: number;
  name?: string;
  type: string;
}

interface Relation {
  id: number;
  name: string;
  column: Argument[]; // arguments
  row: Record<number, string>[]; // facts
  editable: boolean;
}

const Table = ({
  relation,
  handleChange,
}: {
  relation: ScallopInput | ScallopOutput;
  handleChange: React.Dispatch<React.SetStateAction<ScallopInput>>;
}) => {
  function addFact(probability: number, values: string[]) {
    switch (relation.type) {
      case "input":
        const prevFacts = relation.facts;
        const values: string[] = [];

        relation.args.forEach((arg) => {
          // THESE SHOULD BE CONVERTED TO THE RIGHT TYPE
          values.push(""); // empty....
        });
        const newFact: [number, string[]] = [probability, values];
        relation.facts = [...relation.facts, newFact];
        break;
      case "output":
        break;
    }
  }

  let tableRows = [];

  // header
  // tableRows

  // get each row
  // combine rows into table

  switch (relation.type) {
    case "input":
      tableRows = relation.facts.map((fact) => {
        // tuple array, each element is number, string[]
        // row elements = string[], or this is fact[1]...........
        fact[1].map((arg) => {
          <Input
            type="text"
            value={arg}
          />;
        });
      });
      break;
    case "output":
      tableRows = relation.args.map((arg) => {
        <Input
          type="text"
          disabled={true}
          value={arg.name}
        />;
      });
      break;
  }

  // that button is supposed to add rows, have it show when you hover over the last row
  return (
    <div>
      <>{tableRows}</>
      <Button>Test</Button>
    </div>
  );
};

const TableSelect = ({
  list,
  isOutput,
  setSelectedRelation,
}: {
  list: ScallopInput[] | ScallopOutput[];
  isOutput: boolean;
  setSelectedRelation: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const state = isOutput ? "output" : "input";

  const relationList = list.map((rel, index) => (
    <SelectItem
      key={index}
      value={rel.name}
    >
      {rel.name}
    </SelectItem>
  ));

  const isEmpty = list.length === 0;

  return (
    <Select
      disabled={isEmpty}
      onValueChange={(type) => setSelectedRelation(type)}
    >
      <SelectTrigger className="grow">
        <SelectValue
          placeholder={
            isEmpty
              ? `Create an ${state} relation first`
              : `Select an ${state} relation table`
          }
        ></SelectValue>
      </SelectTrigger>
      <SelectContent>{relationList}</SelectContent>
    </Select>
  );
};

const CreateRelationDialog = ({
  handleRelation,
}: {
  handleRelation: (relation: Relation) => void;
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  // information about the current relation being created
  const [isOutput, setIsOutput] = useState(false);
  const [relationName, setRelationName] = useState("");
  const [args, setArgs] = useState<Argument[]>([]);

  function addArgument() {
    const argsCopy = args.slice();
    const newArg: Argument = {
      id: Date.now(),
      type: "String",
    };

    setArgs([...argsCopy, newArg]);
  }

  function removeArgument(index: number) {
    const argsCopy = args.slice();
    argsCopy.splice(index, 1);

    setArgs(argsCopy);
  }

  function addRelation() {
    const relation: Relation = {
      id: Date.now(),
      name: relationName,
      column: args,
      row: [],
      editable: !isOutput,
    };

    handleRelation(relation);
    closeDialog();
  }

  function closeDialog() {
    setDialogOpen(false);

    setIsOutput(false);
    setRelationName("");
    setArgs([]);
  }

  const isArgListEmpty = args.length === 0;
  const dialogState = isOutput ? "output" : "input";

  const argumentList = args.map((argument, index) => (
    <div
      className="flex w-full justify-between space-x-2"
      key={index}
    >
      <Input
        type="text"
        onChange={(name) => (argument.name = name.target.value)}
        placeholder="Argument name (optional)"
        className="basis-1/2"
      />
      <Select
        onValueChange={(type) => (argument.type = type)}
        defaultValue="String"
      >
        <SelectTrigger className="basis-1/3">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="String">String</SelectItem>
            <SelectItem value="Integer">Integer</SelectItem>
            <SelectItem value="Float">Float</SelectItem>
            <SelectItem value="Tensor">Tensor</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => removeArgument(index)}
            >
              <X className="h-5 w-5" />
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
      onOpenChange={setDialogOpen}
    >
      <DialogTrigger asChild>
        <Button className="shrink-0 bg-pink-300 text-black hover:bg-pink-400">
          <PlusSquare className="mr-2 h-5 w-5" />
          <span className="text-base">Create relation</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Create {dialogState} relation
          </DialogTitle>
          <DialogDescription className="text-base">
            Name your relation, then add your arguments below. Each argument
            takes an optional name and a datatype.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-between space-x-8 rounded-md border p-4">
          <div className="grid gap-0.5">
            <Label
              className="text-base"
              htmlFor="io-switch"
            >
              {capitalize(dialogState)}
            </Label>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {isOutput
                ? "These tables are readonly and will contain your output upon running the program."
                : "These tables are editable in the visual editor and are used as facts in your program."}
            </p>
          </div>
          <Switch
            id="io-switch"
            checked={isOutput}
            onCheckedChange={setIsOutput}
          />
        </div>
        <div className="grid w-full gap-1.5">
          <Label
            className="w-fit text-base"
            htmlFor="relation-name"
          >
            Relation name
          </Label>
          <Input
            type="text"
            id="relation-name"
            placeholder="Required"
            value={relationName}
            onChange={(e) => setRelationName(e.target.value)}
          />
        </div>
        <div className="grid w-full gap-1.5">
          <Label
            className="w-fit text-base font-medium"
            htmlFor="add-argument"
          >
            Arguments
          </Label>
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => addArgument()}
              id="add-argument"
              className="w-full bg-sky-300 text-black hover:bg-sky-400"
            >
              <Plus className="mr-2 h-5 w-5" />
              <span className="text-base">Add new</span>
            </Button>
          </div>
        </div>
        <Separator />
        <div className="flex flex-col items-center justify-center space-y-3">
          {isArgListEmpty ? (
            <span className="select-none text-sm text-zinc-500 dark:text-zinc-400">
              Currently empty. At least one argument is required.
            </span>
          ) : (
            argumentList
          )}
        </div>
        <Separator />
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={() => closeDialog}
          >
            <Trash className="mr-2 h-5 w-5" />
            <span className="text-base">Delete</span>
          </Button>
          <Button
            disabled={isArgListEmpty || relationName === ""}
            onClick={() => addRelation()}
            className="bg-sky-300 text-black hover:bg-sky-400"
          >
            <Check className="mr-2 h-5 w-5" />
            <span className="text-base">Confirm</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const TableEditor = ({
  inputs,
  outputs,
  onInputsChange,
  onOutputsChange,
}: {
  inputs: ScallopInput[];
  outputs: ScallopOutput[];
  onInputsChange: React.Dispatch<React.SetStateAction<ScallopInput[]>>;
  onOutputsChange: React.Dispatch<React.SetStateAction<ScallopOutput[]>>;
}) => {
  const [isOutput, setIsOutput] = useState(false);
  const [activeRelation, setActiveRelation] = useState("");

  /*
  function getRelation(relationName: string) {
    if(isOutput){
      for(int i=0; i<outputs.length; i++){
        if(outputs[i].name === relationName){
          return outputs[i];
        }
      }
      return;
    }
    for(int i=0; i<inputs.length; i++){
      if(inputs[i].name === relationName){
        return inputs[i];
      }
    }
    return null;
    // if isOutput, comb through outputs and return the ScallopOutput with .name === relationName
    // else, comb thorugh inputs and return the ScallopInput with .name === relationName.. idc good enough for me
  }
  */

  function handleRelation(relation: Relation) {
    const args: { name: string; type: string }[] = [];

    relation.column.forEach((col) => {
      args.push({
        name: col.name ?? "",
        type: col.type,
      });
    });

    const newInput: ScallopInput = {
      type: "input",
      name: relation.name,
      args: args,
      facts: [],
    };

    const newOutput: ScallopOutput = {
      type: "output",
      name: relation.name,
      args: args,
    };

    relation.editable
      ? onInputsChange([...inputs, newInput])
      : onOutputsChange([...outputs, newOutput]);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between space-x-10">
        <CreateRelationDialog handleRelation={handleRelation} />
        <TableSelect
          list={isOutput ? outputs : inputs}
          isOutput={isOutput}
          setSelectedRelation={setActiveRelation}
        />
        <div className="flex items-center gap-3">
          <Label
            className="text-base"
            htmlFor="io-table"
          >
            Input
          </Label>
          <Switch
            checked={isOutput}
            onCheckedChange={setIsOutput}
            id="io-table"
          />
          <Label
            className="text-base"
            htmlFor="io-table"
          >
            Output
          </Label>
        </div>
      </div>
      <Card className="h-0 grow p-4">
        <div className="flex flex-col space-y-2">
          <div className="flex space-x-2">
            <Input />
            <Input />
            <Input />
            <Input />
          </div>
          <div className="flex space-x-2">
            <Input />
            <Input />
            <Input />
            <Input />
          </div>
          <div className="flex space-x-2">
            <Input />
            <Input />
            <Input />
            <Input />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TableEditor;
