import React, { useState, useEffect } from 'react';
import { Label } from "~/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
  } from "~/components/ui/dialog";
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
import { Button } from "~/components/ui/button";
import { PlusSquare } from 'lucide-react';

interface Relation {
    id: number;
    name: string;
    // column array, each element is a column component
    // row array, each element is a row component
}

const TableSelect = ({ jsonArray } : {jsonArray : Relation[]}) => {
    return (
      <Select>
        <SelectTrigger className="grow">
          <SelectValue placeholder="Select an input table"></SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {jsonArray.map((rel, index) => (
                <SelectItem key={index} value={rel.name + rel.id}>
                  <span className="font-mono">{rel.name}</span>
                </SelectItem>)
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    );
};

function TableEditor() {
    const [jsonArray, setJsonArray] = useState<Relation[]>([]);; // this stores the relations
    const [open, setOpen] = useState(false); // toggle dialog box
    const [newItemName, setNewItemName] = useState('');

    useEffect(() => {
      console.log(jsonArray);
    }, [jsonArray]);

    function addItem(){
        const newItem: Relation = {
            id: Date.now(),
            name: newItemName,
        };
        setJsonArray(prevState => [...prevState, newItem]);
        setOpen(false);
        setNewItemName('');
    }

    return(
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-10">
                <Dialog open={open} onOpenChange={setOpen}> 
                  <DialogTrigger asChild>
                      <Button className="shrink-0 bg-pink-300 text-black hover:bg-pink-400">
                          <PlusSquare className="mr-2 h-5 w-5" />
                          <span className="text-base">Create Relation</span>
                      </Button>
                  </DialogTrigger>
                  <DialogContent>
                      <DialogHeader>
                          <DialogTitle>Create Relation</DialogTitle>
                          <DialogDescription>
                          This is where you&apos;ll be creating and editing your relation
                          signatures/arguments. Work in progress.
                          </DialogDescription>
                      </DialogHeader>
                      <div>
                          <DialogFooter>
                              <input
                                  type="text"
                                  value={newItemName}
                                  onChange={(e) => setNewItemName(e.target.value)}
                                  placeholder="Enter item name"
                              />
                              <button onClick={addItem}>Confirm</button>
                          </DialogFooter>
                      </div>
                  </DialogContent>
                </Dialog>
                <TableSelect jsonArray={jsonArray}/>
                <div className="flex items-center gap-3">
                <Label className="text-base">Input</Label>
                <Switch />
                <Label className="text-base">Output</Label>
                </div>
            </div>
            <div className="grow rounded-md bg-zinc-200 p-4">
            </div>
        </div>
    )
}

export default TableEditor;