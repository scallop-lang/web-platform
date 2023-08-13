import { ListPlus, ListX, MoreVertical, Settings2 } from "lucide-react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { cn } from "~/utils/cn";
import type { Fact, RelationRecord, SclRelation } from "~/utils/schemas-types";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";

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

    // set copy of the record as the new state
    setRecord({
      ...record,
      [relation.name]: {
        ...relation,
        facts: [
          ...relation.facts,
          { id: uuidv4(), tag: 1, tuple: initialValues },
        ],
      },
    });
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
  relationType,
  updateCell,
}: {
  initialState: boolean;
  relationType: "input" | "output";
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
        {relationType === "input" ? (
          <Switch
            checked={checked}
            onCheckedChange={(value) => {
              setChecked(value);
              updateCell(value.toString());
            }}
          />
        ) : (
          <Switch
            checked={checked}
            className="cursor-default"
          />
        )}
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
  const header = relation.args.map((arg) => {
    return (
      <div
        className="w-full cursor-default font-mono text-sm font-semibold leading-none"
        key={arg.id}
      >
        {arg.name ? `${arg.name}: ${arg.type}` : `${arg.type}`}
      </div>
    );
  });

  const isInput = relation.type === "input";

  return (
    <Card className="flex shrink-0 overflow-x-auto">
      <div
        className={cn(
          "my-3 ml-3 flex w-full space-x-2",
          isInput ? "mr-2" : "mr-3"
        )}
      >
        {header}
      </div>
      {isInput ? (
        <div className="mr-3 flex w-10 shrink-0 items-center justify-center">
          <Settings2 className="h-4 w-4" />
        </div>
      ) : null}
    </Card>
  );
};

const TableRow = ({
  relation,
  record,
  rowFact,
  setRecord,
}: {
  relation: SclRelation;
  record: RelationRecord;
  rowFact: Fact;
  setRecord: React.Dispatch<React.SetStateAction<RelationRecord>>;
}) => {
  function deleteRow() {
    setRecord({
      ...record,
      [relation.name]: {
        ...relation,
        facts: relation.facts.filter((f) => f.id !== rowFact.id),
      },
    });
  }

  const colList = relation.args.map((argument, argIndex) => {
    function updateCell(value: string) {
      setRecord({
        ...record,
        [relation.name]: {
          ...relation,
          facts: relation.facts.map((fact) => {
            if (fact.id === rowFact.id) {
              fact.tuple[argIndex] = value;
            }
            return fact;
          }),
        },
      });
    }

    const initialState = rowFact.tuple[argIndex]!;
    const isInput = relation.type === "input";

    // for now, the other types will use the same input field.
    //
    // we only need to differentiate between table cell siblings (the row). this
    // means using the same argument.id across a column is fine (not siblings)!
    switch (argument.type) {
      case "Boolean":
        return (
          <BooleanCell
            key={argument.id}
            initialState={initialState === "true"}
            updateCell={updateCell}
            relationType={relation.type}
          />
        );
      default:
        return (
          <Input
            key={argument.id}
            type="text"
            defaultValue={initialState}
            onChange={(e) => updateCell(e.target.value)}
            placeholder={argument.type}
            className={cn(
              "transition hover:bg-secondary focus:bg-background",
              isInput ? "cursor-pointer focus:cursor-text" : "cursor-default"
            )}
            readOnly={!isInput}
          />
        );
    }
  });

  return (
    <div
      className="flex space-x-2"
      key={rowFact.id}
    >
      {colList}
      {relation.type === "input" ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              onClick={deleteRow}
              className="shrink-0"
              aria-haspopup
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Edit row</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={deleteRow}>
              <ListX className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
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

  // for each row, we generate the cells for each column
  const rowList = relation.facts.map((fact, row) => (
    <TableRow
      key={row}
      relation={relation}
      record={record}
      rowFact={fact}
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
      ) : null}
    </div>
  );
};

export { Table };
