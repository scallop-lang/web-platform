import { ListPlus } from "lucide-react";
import { useState } from "react";
import { cn } from "~/utils/cn";
import {
  type ArgumentType,
  type RelationRecord,
  type SclRelation,
} from "~/utils/schemas-types";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";

const BooleanCell = ({
  initialState,
  disabled,
  setState,
}: {
  initialState: boolean;
  disabled: boolean;
  setState: (value: boolean) => void;
}) => {
  const [checked, setChecked] = useState(initialState);
  function checkedChange() {
    const newChecked = !checked;
    setChecked(newChecked);
    setState(newChecked);
  }

  return (
    <div className="flex h-10 w-full justify-between overflow-x-auto rounded-md border border-input bg-background px-3 py-2 @container">
      <p
        className={cn(
          "hidden cursor-default text-sm transition @[8rem]:flex",
          checked ? "text-muted-foreground" : "font-semibold"
        )}
      >
        False
      </p>
      <div className="flex grow items-center justify-center">
        <Switch
          checked={checked}
          onCheckedChange={checkedChange}
          disabled={disabled}
        />
      </div>
      <p
        className={cn(
          "hidden cursor-default text-sm transition @[8rem]:flex",
          checked ? "font-semibold" : "text-muted-foreground"
        )}
      >
        True
      </p>
    </div>
  );
};

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

  return (
    <Card className="flex shrink-0 space-x-2 overflow-x-auto p-3">
      {header}
    </Card>
  );
};

const Table = ({
  relation,
  record,
  setRecord,
}: {
  relation: SclRelation;
  record: RelationRecord;
  setRecord: React.Dispatch<React.SetStateAction<RelationRecord>>;
}) => {
  function addFact() {
    // create initial state for each argument type in the column
    const initialValues: string[] = relation.args.map((arg) => {
      switch (arg.type) {
        case "String":
        case "Float":
        case "Integer":
          return "";
        case "Boolean":
          return "false";
      }
    });

    // create a new fact with the initial values. for now,
    // probability is hardcoded to be 1
    const newFact: [number, string[]] = [1, initialValues];

    // although we're only updating one single relation, we need to
    // copy the whole input or output record, because we can't mutate
    const recordCopy = { ...record };

    // we also need to create a copy of the relation's facts
    const factsCopy = relation.facts.slice();

    // finally, update facts prop of the relation in the record...
    recordCopy[relation.name]!.facts = [...factsCopy, newFact];

    // set copy of the record as the new state
    setRecord(recordCopy);
  }

  console.log(`current ${relation.type} record:`, record);

  function editCell(factIndex: number, colIndex: number, value: string) {
    relation.facts[factIndex]![1][colIndex] = value;
  }

  const rowList = relation.facts.map((fact, i) => {
    function createCell(type: ArgumentType, colIndex: number) {
      const initialState = fact[1][colIndex]!;
      function switchBool(value: boolean) {
        fact[1][colIndex] = value.toString();
      }

      switch (type) {
        case "Boolean":
          return (
            <BooleanCell
              key={colIndex}
              initialState={initialState.toLowerCase() === "true"}
              setState={switchBool}
              disabled={relation.type === "output"}
            />
          );
        default:
          return (
            <Input
              key={colIndex}
              type="text"
              defaultValue={initialState}
              onChange={(e) => editCell(i, colIndex, e.target.value)}
              placeholder={type}
              className="cursor-pointer transition hover:bg-secondary focus:bg-background"
              disabled={relation.type === "output"}
            />
          );
      }
    }

    const colList = relation.args.map((arg, index) =>
      createCell(arg.type, index)
    );

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
      <TableHeader relation={relation} />
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

export { Table };
