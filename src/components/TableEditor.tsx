import { Plus, PlusSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";
import { Input } from "./ui/input";

interface ColumnField {
  id: number;
  name: string;
  type: string;
}

interface Relation {
  id: number;
  name: string;
  columns: ColumnField[];
  rows: Record<string, string>[];
  // column array, each element is a column component
  // row array, each element is a row component
}

const TableSelect = ({ jsonArray }: { jsonArray: Relation[] }) => {
  const relationList = jsonArray.map((rel, index) => (
    <SelectItem
      key={index}
      value={rel.name}
    >
      {rel.name}
    </SelectItem>
  ));

  const isEmpty = relationList.length === 0;

  return (
    <Select disabled={isEmpty}>
      <SelectTrigger className="grow">
        <SelectValue
          placeholder={
            isEmpty
              ? "Create a relation first"
              : "Select an input relation table"
          }
        ></SelectValue>
      </SelectTrigger>
      <SelectContent>{relationList}</SelectContent>
    </Select>
  );
};

function TableEditor() {
  const [jsonArray, setJsonArray] = useState<Relation[]>([]); // this stores the relations
  const [colArray, setColArray] = useState<ColumnField[]>([]);
  const [rowArray, setRowArray] = useState<Record<string, string>[]>([]); // kind of useless atm
  const [open, setOpen] = useState(false); // toggle dialog box
  const [relationName, setRelationName] = useState("");

  // for debugging, remove later
  useEffect(() => {
    console.log(jsonArray);
  }, [jsonArray]);

  function addItem() {
    const newItem: Relation = {
      id: Date.now(),
      name: relationName,
      columns: colArray,
      rows: rowArray,
    };
    setJsonArray((prevState) => [...prevState, newItem]);
    resetItem();
  }

  function resetItem() {
    setOpen(false);
    setRelationName("");
    setColArray([]);
  }

  function addColumnField() {
    const newColumnField: ColumnField = {
      id: Date.now(),
      name: "",
      type: "String",
    };
    setColArray((prevState) => [...prevState, newColumnField]);
  }

  function removeColumnField({ i }: { i: number }) {
    const newColArray = [...colArray];
    newColArray.splice(i, 1);
    setColArray(newColArray);
  }

  function titleChange({
    column,
    title,
  }: {
    column: ColumnField;
    title: string;
  }) {
    column.name = title;
  }
  function typeChange({ column, type }: { column: ColumnField; type: string }) {
    column.type = type;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between space-x-10">
        <Dialog
          open={open}
          onOpenChange={setOpen}
        >
          <DialogTrigger asChild>
            <Button className="shrink-0 bg-pink-300 text-black hover:bg-pink-400">
              <PlusSquare className="mr-2 h-5 w-5" />
              <span className="text-base">Create Relation</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-2xl">Create relation</DialogTitle>
              <DialogDescription className="text-base">
                Enter a name for your relation. Then, add your arguments. Each
                argument takes an optional name and a datatype.
              </DialogDescription>
            </DialogHeader>
            <div className="grid w-full gap-1.5">
              <Label
                className="text-base"
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
              <p className="text-base font-medium">Arguments</p>
              <div className="flex items-center space-x-3">
                <Button
                  onClick={addColumnField}
                  size="icon"
                  id="add-argument"
                  className="shrink-0 bg-sky-300 text-black hover:bg-sky-400"
                >
                  <Plus className="h-5 w-5" />
                </Button>
                <Label
                  htmlFor="add-argument"
                  className="text-base font-normal"
                >
                  Add argument
                </Label>
              </div>
            </div>

            <div className="columnList">
              {colArray.map((columnField, index) => (
                <div
                  className="mb-2 flex justify-between"
                  key={index}
                >
                  <input
                    type="text"
                    onChange={(e) =>
                      titleChange({
                        column: columnField,
                        title: e.target.value,
                      })
                    }
                    placeholder="Enter the title here..."
                    className="bg-neutral-200"
                  />
                  <Select
                    defaultValue={"String"}
                    onValueChange={(e) =>
                      typeChange({ column: columnField, type: e })
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="String">String</SelectItem>
                        <SelectItem value="Int32">Int-32</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Button onClick={() => removeColumnField({ i: index })}>
                    Delete
                  </Button>
                </div>
              ))}
            </div>
            <DialogFooter className="mt-6">
              <Button onClick={resetItem}>Delete</Button>
              <Button
                onClick={addItem}
                className="shrink-0 bg-sky-300 text-black hover:bg-sky-400"
              >
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <TableSelect jsonArray={jsonArray} />
        <div className="flex items-center gap-3">
          <Label className="text-base">Input</Label>
          <Switch />
          <Label className="text-base">Output</Label>
        </div>
      </div>
      <div className="grow rounded-md bg-zinc-200 p-4"></div>
    </div>
  );
}

export default TableEditor;
