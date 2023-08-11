import { ListPlus, X } from "lucide-react";
import { useState } from "react";
import { cn } from "~/utils/cn";
import type {
  Argument,
  RelationRecord,
  SclRelation,
} from "~/utils/schemas-types";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const AddRowButton = ({
  relation,
  record,
  setRecord,
}: {
  relation: SclRelation;
  record: RelationRecord;
  setRecord: React.Dispatch<React.SetStateAction<RelationRecord>>;
}) => {
  function addRow() {
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

    // finally, update facts prop of the relation in the record...
    recordCopy[relation.name]!.facts.push(newFact);

    // set copy of the record as the new state
    setRecord(recordCopy);
  }

  return (
    <Button
      onClick={addRow}
      className="shrink-0"
    >
      <ListPlus className="mr-2 h-4 w-4" /> Add row
    </Button>
  );
};

const BooleanCell = ({
  initialState,
  disabled,
  updateCell,
}: {
  initialState: boolean;
  disabled: boolean;
  updateCell: (value: string) => void;
}) => {
  const [checked, setChecked] = useState(initialState);

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
          onCheckedChange={(value) => {
            setChecked(value);
            updateCell(value.toString());
          }}
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
    <Card className="flex shrink-0 overflow-x-auto">
      <div className="my-3 ml-3 mr-2 flex w-full space-x-2">{header}</div>
      <div className="mr-3 flex w-10 shrink-0 items-center justify-center">
        <Badge
          variant="secondary"
          className="cursor-default font-mono"
        >
          {relation.type === "input" ? "I" : "O"}
        </Badge>
      </div>
    </Card>
  );
};

const TableCell = ({
  relation,
  record,
  rowIndex,
  colIndex,
  fact,
  argument,
  setRecord,
}: {
  relation: SclRelation;
  record: RelationRecord;
  rowIndex: number;
  colIndex: number;
  fact: [number, string[]];
  argument: Argument;
  setRecord: React.Dispatch<React.SetStateAction<RelationRecord>>;
}) => {
  function updateCell(value: string) {
    const recordCopy = { ...record };
    recordCopy[relation.name]!.facts[rowIndex]![1][colIndex] = value;

    console.log("value changed", `(${rowIndex},`, `${colIndex}):`, value);

    setRecord(recordCopy);
  }

  const initialState = fact[1][colIndex]!;

  // for now, the other types will use the same input field
  switch (argument.type) {
    case "Boolean":
      return (
        <BooleanCell
          key={colIndex}
          initialState={initialState === "true"}
          updateCell={updateCell}
          disabled={relation.type === "output"}
        />
      );
    default:
      return (
        <Input
          type="text"
          key={colIndex}
          defaultValue={initialState}
          onChange={(e) => updateCell(e.target.value)}
          placeholder={argument.type}
          className="cursor-pointer transition hover:bg-secondary focus:bg-background"
          disabled={relation.type === "output"}
        />
      );
  }
};

const TableRow = ({
  relation,
  record,
  rowIndex,
  fact,
  setRecord,
}: {
  relation: SclRelation;
  record: RelationRecord;
  rowIndex: number;
  fact: [number, string[]];
  setRecord: React.Dispatch<React.SetStateAction<RelationRecord>>;
}) => {
  function deleteRow() {
    // since slice() modifies the original row as well, we should
    // create a copy first and work on that instead
    const factCopy = relation.facts.slice();

    console.log("before:", factCopy);

    const deleted = factCopy.splice(rowIndex, 1);

    console.log("after:", factCopy);
    console.log("deleted:", deleted[0]);

    const recordCopy = { ...record };
    recordCopy[relation.name]!.facts = factCopy;

    setRecord(recordCopy);
  }

  const colList = relation.args.map((argument, col) => (
    <TableCell
      key={col}
      relation={relation}
      record={record}
      rowIndex={rowIndex}
      colIndex={col}
      fact={fact}
      argument={argument}
      setRecord={setRecord}
    />
  ));

  return (
    <div
      className="flex space-x-2"
      key={rowIndex}
    >
      {colList}
      <TooltipProvider delayDuration={400}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              onClick={deleteRow}
              className="shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete row</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

// we would usually store the state of the table in its own component, but
// we're actually passing down table state via the `record` prop
const Table = ({
  relationName,
  record,
  setRecord,
}: {
  relationName: string;
  record: RelationRecord;
  setRecord: React.Dispatch<React.SetStateAction<RelationRecord>>;
}) => {
  const relation = record[relationName]!;

  console.log(`current ${relation.type} record:`, record);

  // for each row, we generate the cells for each column
  const rowList = relation.facts.map((fact, row) => (
    <TableRow
      key={row}
      relation={relation}
      record={record}
      rowIndex={row}
      fact={fact}
      setRecord={setRecord}
    />
  ));

  return (
    <div className="flex h-full flex-col justify-between space-y-3">
      <TableHeader relation={relation} />
      <Card className="grid grow gap-4 overflow-y-auto p-3">
        <div className="flex flex-col space-y-2">{rowList}</div>
      </Card>
      {relation.type === "input" ? (
        <AddRowButton
          relation={relation}
          record={record}
          setRecord={setRecord}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export { Table };
