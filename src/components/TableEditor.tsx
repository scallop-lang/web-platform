import { PlusSquare } from "lucide-react";
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
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";

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
  return (
    <Select>
      <SelectTrigger className="grow">
        <SelectValue placeholder="Select an input table"></SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Select a relation</SelectLabel>
          {jsonArray.map((rel, index) => (
            <SelectItem
              key={index}
              value={rel.name + rel.id}
            >
              <span className="font-mono">{rel.name}</span>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

function TableEditor() {
  const [jsonArray, setJsonArray] = useState<Relation[]>([]); // this stores the relations
  const [colArray, setColArray] = useState<ColumnField[]>([]);
  const [rowArray, setRowArray] = useState<Record<string, string>[]>([]); // kind of useless atm
  const [open, setOpen] = useState(false); // toggle dialog box
  const [newItemName, setNewItemName] = useState("");

  useEffect(() => {
    console.log(jsonArray);
  }, [jsonArray]);

  function addItem() {
    const newItem: Relation = {
      id: Date.now(),
      name: newItemName,
      columns: colArray,
      rows: rowArray,
    };
    setJsonArray((prevState) => [...prevState, newItem]);
    resetItem();
  }

  function resetItem() {
    setOpen(false);
    setNewItemName("");
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
      <div className="flex items-center justify-between gap-10">
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
              <DialogTitle>Create Relation</DialogTitle>
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Enter the name here..."
                className="bg-neutral-200"
              />
              <DialogHeader>
                <DialogTitle>Arguments</DialogTitle>
                <DialogDescription>
                  Enter an optional name, datatype, then rearrange the order.
                </DialogDescription>
              </DialogHeader>
            </DialogHeader>
            <div className="overflow-hidden">
              <div className="columnAdjuster">
                <div className="mb-2 flex items-center">
                  <Button
                    onClick={addColumnField}
                    className="h-10 w-10 shrink-0 bg-sky-300 text-black hover:bg-sky-400"
                  ></Button>
                  <p className="ml-2">Add your arguments here</p>
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
            </div>
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
