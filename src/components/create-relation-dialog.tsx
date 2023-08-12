import { PlusSquare, Table2, Trash, X } from "lucide-react";
import { useState } from "react";
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
          <Table2 className="mr-2 h-4 w-4" /> Create relation
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
            <PlusSquare className="mr-2 h-4 w-4" /> Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRelationDialog;
