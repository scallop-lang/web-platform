import { PlusSquare, Table2, Trash, X } from "lucide-react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { cn } from "~/utils/cn";
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

const CreateRelationDialog = ({
  addRelation,
}: {
  addRelation: (relation: SclRelation) => void;
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  // current state of the relation being created
  const [isOutput, setIsOutput] = useState(false);
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

  // when the dialog closes, we should also reset the dialog state
  function closeDialog() {
    setIsOutput(false);
    setRelationName("");
    setArgs([]);

    setDialogOpen(false);
  }

  const argumentTypesList = argumentTypes.map((type) => (
    <SelectItem
      key={uuidv4()}
      value={type}
    >
      {type}
    </SelectItem>
  ));

  const argListEmpty = args.length === 0;
  const argumentList = args.map((argument, index) => (
    <div
      className="flex w-full justify-between space-x-4"
      key={argument.id}
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
                onChange={(e) => setRelationName(e.target.value)}
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
            <PlusSquare className="mr-2 h-4 w-4" /> Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRelationDialog;
