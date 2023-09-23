import { ListPlus, ListX, MoreVertical, Settings2, Tag } from "lucide-react";
import { useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { cn } from "~/utils/cn";
import { isValidType } from "~/utils/is-valid-type";
import type {
  Argument,
  Fact,
  RelationRecord,
  SclRelation,
} from "~/utils/schemas-types";

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
import { TableContext } from "~/components/projectContext";

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

const InputCell = ({
  initialState,
  relationType,
  argument,
  updateCell,
}: {
  initialState: string;
  relationType: "input" | "output";
  argument: Argument;
  updateCell: (value: string) => void;
}) => {
  function validateUpdate(value: string) {
    let isValid = isValidType(value, argument);
    if (argument.type === "String") {
      isValid = true;
      // any reasonable string should work
    }
    setValid(isValid);
    if (!isValid) {
      return;
    }
    updateCell(value);
  }

  const [valid, setValid] = useState<boolean>(true);
  const isInput = relationType === "input";

  return (
    <Input
      key={argument.id}
      type="text"
      defaultValue={initialState}
      onChange={(e) => validateUpdate(e.target.value)}
      placeholder={argument.type}
      className={cn(
        "transition hover:bg-secondary focus:bg-background",
        isInput ? "cursor-pointer focus:cursor-text" : "cursor-default",
        valid
          ? ""
          : "border-red-300 bg-red-100 hover:bg-red-50 focus:bg-red-100 focus-visible:ring-red-500"
      )}
      readOnly={!isInput}
    />
  );
};

const TableHeader = ({ relation }: { relation: SclRelation }) => {
  const header = relation.args.map((argument) => {
    const name = argument.name;
    const type = argument.type;

    return (
      <div
        className="w-full cursor-default font-mono text-sm font-semibold leading-none"
        key={argument.id}
      >
        {name ? `${name}: ${type}` : `${type}`}
      </div>
    );
  });

  const isInput = relation.type === "input";

  return (
    <Card className="flex shrink-0 overflow-x-auto">
      {relation.probability ? (
        <div className="ml-3 flex w-20 shrink-0 items-center justify-center">
          <Tag className="h-4 w-4" />
        </div>
      ) : null}
      <div
        className={cn(
          "my-3 flex w-full space-x-2",
          isInput ? "mr-2" : "mr-3",
          relation.probability ? "ml-2" : "ml-3"
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

const ProbabilityInput = ({
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
  const isInput = relation.type === "input";

  return (
    <Input
      type="text"
      defaultValue={rowFact.tag}
      onChange={(e) =>
        setRecord({
          ...record,
          [relation.name]: {
            ...relation,
            facts: relation.facts.map((fact) => {
              if (fact.id === rowFact.id) {
                fact.tag = parseFloat(e.target.value);
              }
              return fact;
            }),
          },
        })
      }
      placeholder="Prob."
      className={cn(
        "w-20 text-center font-mono italic transition hover:bg-secondary focus:bg-background",
        isInput ? "cursor-pointer focus:cursor-text" : "cursor-default"
      )}
      readOnly={!isInput}
    />
  );
};

const RowDropdown = ({
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
        facts: relation.facts.filter((fact) => fact.id !== rowFact.id),
      },
    });
  }

  return (
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
  const colList = relation.args.map((argument, index) => {
    function updateCell(value: string) {
      setRecord({
        ...record,
        [relation.name]: {
          ...relation,
          facts: relation.facts.map((fact) => {
            if (fact.id === rowFact.id) {
              fact.tuple[index] = value;
            }
            return fact;
          }),
        },
      });
    }

    const initialState = rowFact.tuple[index]!;

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
          <InputCell
            key={argument.id}
            initialState={initialState}
            argument={argument}
            updateCell={updateCell}
            relationType={relation.type}
          />
        );
    }
  });

  return (
    <div
      className="flex space-x-2"
      key={rowFact.id}
    >
      {relation.probability ? (
        <ProbabilityInput
          relation={relation}
          record={record}
          rowFact={rowFact}
          setRecord={setRecord}
        />
      ) : null}
      {colList}
      {relation.type === "input" ? (
        <RowDropdown
          relation={relation}
          record={record}
          rowFact={rowFact}
          setRecord={setRecord}
        />
      ) : null}
    </div>
  );
};

// we would usually store the state of the table in its own component, but
// we're actually passing down table state via the `record` prop
const Table = ({
  record,
  setRecord,
}: {
  record: RelationRecord;
  setRecord: React.Dispatch<React.SetStateAction<RelationRecord>>;
}) => {
  const { activeRelationName } = useContext(TableContext);
  const relationName = activeRelationName;
  const relation = record[relationName]!;

  // for each row, we generate the cells for each column
  const rowList = relation.facts.map((fact) => (
    <TableRow
      key={fact.id}
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
