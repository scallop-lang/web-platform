import { PlusSquare, Table2, Trash, X } from "lucide-react";
import { useContext, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { cn } from "~/utils/cn";
import { isValidType } from "~/utils/is-valid-type";
import {
  argumentTypes,
  type Argument,
  type ArgumentType,
  type SclRelation,
} from "~/utils/schemas-types";

import { Button } from "./ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { ProjectContext, TableContext } from "~/components/projectContext";

const StringArg: Argument = {
  type: "String",
  id: "",
  name: "",
};

const ArgumentNameCell = ({ argument }: { argument: Argument }) => {
  const [isValidName, setIsValidName] = useState(true);

  function changeCell(value: string) {
    const valid = isValidType(value, StringArg);
    setIsValidName(valid);
    if (valid) {
      argument.name = value;
    }
  }
  return (
    <Input
      type="text"
      onChange={(name) => changeCell(name.target.value)}
      placeholder="Name (optional)"
      className={cn(
        isValidName
          ? ""
          : "bg-red-100 hover:bg-red-50 focus:bg-red-100 focus-visible:ring-red-500",
        "basis-1/2"
      )}
    />
  );
};

const CreateRelationDialog = () => {
  const { inputs, outputs, setInputs, setOutputs } = useContext(ProjectContext);
  const { setActiveRelationName } = useContext(TableContext);
  const [dialogOpen, setDialogOpen] = useState(false);

  // current state of the relation being created
  const [isOutput, setIsOutput] = useState(false);
  const [isValidName, setIsValidName] = useState(false);
  const [hasProbability, setHasProbability] = useState(false);
  const [relationName, setRelationName] = useState("");
  const [args, setArgs] = useState<Argument[]>([]);

  function addArgument() {
    const argsCopy = args.slice();

    // let's just choose String as the default type
    setArgs([
      ...argsCopy,
      {
        id: uuidv4(),
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
      probability: hasProbability,
      facts: [],
    };
  }

  // adds newly created relation to inputs or outputs, depending on
  // what was chosen in the create relation dialog

  function addRelation(relation: SclRelation) {
    if (relation.type === "input") {
      const inputsCopy = structuredClone(inputs);
      inputsCopy[relation.name] = relation;
      setInputs(inputsCopy);
    } else {
      const outputsCopy = structuredClone(outputs);
      outputsCopy[relation.name] = relation;
      setOutputs(outputsCopy);
    }
    setActiveRelationName(relation.name);
  }

  // validate dialog
  function isValidString(value: string) {
    return (
      value != "" &&
      isValidType(value, StringArg) &&
      !inputs[value] &&
      !outputs[value]
    );
  }

  function updateRelationName(value: string) {
    setRelationName(value);
    setIsValidName(isValidString(value));
  }

  // when the dialog closes, we should also reset the dialog state
  function resetDialogState() {
    setIsOutput(false);
    setHasProbability(false);
    setIsValidName(false);
    setRelationName("");
    setArgs([]);
  }

  const argumentTypesList = argumentTypes.map((type) => (
    <SelectItem
      key={uuidv4()}
      value={type}
    >
      {type}
    </SelectItem>
  ));

  const ArgumentWindow = function ArgumentWindow({
    args,
  }: {
    args: Argument[];
  }) {
    const argListEmpty = args.length === 0;
    const argumentList = args.map((argument, index) => (
      <div
        className="flex w-full justify-between space-x-4"
        key={argument.id}
      >
        <ArgumentNameCell argument={argument} />
        <Select
          onValueChange={(type) => (argument.type = type as ArgumentType)}
          defaultValue="String"
        >
          <SelectTrigger className="basis-1/3">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>{argumentTypesList}</SelectContent>
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
      <div className="flex flex-col justify-between space-y-2">
        <p className="cursor-default text-sm font-medium leading-none">
          Argument list
        </p>
        <div
          className={cn(
            "flex h-72 flex-col space-y-2 overflow-y-auto rounded-md border border-border p-3",
            argListEmpty ? "justify-center" : "justify-start"
          )}
        >
          {argListEmpty ? (
            <span className="cursor-default text-center text-sm text-muted-foreground">
              Currently empty. At least one argument is required.
            </span>
          ) : (
            argumentList
          )}
        </div>
        <Button
          onClick={addArgument}
          id="add-argument"
        >
          Add new argument
        </Button>
      </div>
    );
  };

  const ArgumentBox = useMemo(() => ArgumentWindow({ args }), [args]);
  const argListEmpty = args.length === 0;

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(open) => {
        setDialogOpen(open);

        if (!open) {
          resetDialogState();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Table2 className="mr-2 h-4 w-4" /> Create relation
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            Create {isOutput ? "output" : "input"} relation
          </DialogTitle>
          <DialogDescription>
            Name your relation, then add your arguments below. Arguments take an
            optional name and a datatype.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col justify-between space-y-3">
            <div className="grid gap-2">
              <Label htmlFor="relation-name">Relation name</Label>
              <Input
                type="text"
                id="relation-name"
                placeholder="Required"
                value={relationName}
                onChange={(e) => updateRelationName(e.target.value)}
                className={cn(
                  isValidName
                    ? ""
                    : "bg-red-100 hover:bg-red-50 focus:bg-red-100 focus-visible:ring-red-500"
                )}
              />
              <p className="cursor-default text-sm text-muted-foreground">
                Make sure the name also exists in your program.
              </p>
            </div>
            <div className="grid gap-2">
              <p className="cursor-default text-sm font-medium leading-none">
                Configuration
              </p>
              <div className="flex items-center justify-between space-x-8 rounded-md border border-border p-3">
                <div className="grid gap-1">
                  <Label htmlFor="io-switch">
                    {isOutput ? "Output" : "Input"}
                  </Label>
                  <p className="cursor-default text-sm text-muted-foreground">
                    {isOutput
                      ? "Read-only tables that will display your output relations upon running."
                      : "Editable tables that are considered facts in your program."}
                  </p>
                </div>
                <Switch
                  id="io-switch"
                  checked={isOutput}
                  onCheckedChange={setIsOutput}
                />
              </div>
              <div className="flex items-center justify-between space-x-8 rounded-md border border-border p-3">
                <div className="grid gap-1">
                  <Label htmlFor="probability">Probability</Label>
                  <p className="cursor-default text-sm text-muted-foreground">
                    Turn on to specify fact probability. When off, all fact
                    tuples are assumed to have a probability of 1.
                  </p>
                </div>
                <Switch
                  id="probability"
                  checked={hasProbability}
                  onCheckedChange={setHasProbability}
                />
              </div>
            </div>
          </div>
          {ArgumentBox}
        </div>
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={() => alert("delete relation! WIP")}
          >
            <Trash className="mr-2 h-4 w-4" /> Delete
          </Button>
          <Button
            disabled={!isValidName || argListEmpty}
            onClick={() => {
              addRelation(createRelation());
              resetDialogState();
              setDialogOpen(false);
            }}
          >
            <PlusSquare className="mr-2 h-4 w-4" /> Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRelationDialog;
