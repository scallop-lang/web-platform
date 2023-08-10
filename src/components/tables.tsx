import { ListPlus } from "lucide-react";
import {
  type ArgumentType,
  type RelationRecord,
  type SclRelation,
} from "~/utils/schemas-types";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";

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

  return <Card className="flex space-x-2 p-3">{header}</Card>;
};

const InputTable = ({
  relation,
  inputs,
  setInputs,
}: {
  relation: SclRelation;
  inputs: RelationRecord;
  setInputs: React.Dispatch<React.SetStateAction<RelationRecord>>;
}) => {
  // facts can only be added for input relations
  function addFact() {
    const values: string[] = [];

    // create an entry for each argument
    relation.args.forEach((arg) => {
      switch (arg.type) {
        case "String":
          values.push("");
          break;
        case "Boolean":
          values.push("");
          break;
        case "Float":
          values.push("");
          break;
        case "Integer":
          values.push("");
          break;
      }
    });

    // first add the new fact to the relation itself
    // for now, probability is hardcoded to be 1
    relation.facts = [...relation.facts, [1, values]];

    // then update inputs with the new relation
    const inputsCopy = { ...inputs };
    inputsCopy[relation.name] = relation;

    setInputs(inputsCopy);
  }

  const rowList = relation.facts.map((fact, i) => {
    function createCell(type: ArgumentType, colIndex: number) {
      switch (type) {
        case "Boolean":
          return (
            <div className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2">
              <p className="cursor-default text-sm font-semibold">False</p>
              <Switch />
              <p className="cursor-default text-sm font-semibold">True</p>
            </div>
          );
        default:
          return (
            <Input
              key={colIndex}
              type="text"
              defaultValue={fact[1][colIndex]}
              placeholder={type}
              className="cursor-pointer transition hover:bg-secondary focus:bg-background"
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

const OutputTable = ({ relation }: { relation: SclRelation }) => {
  return (
    <div className="flex h-full flex-col space-y-5">
      <TableHeader relation={relation} />
      <div className="flex grow cursor-default items-center justify-center text-sm text-muted-foreground">
        No output to display... yet...?
      </div>
    </div>
  );
};

export { InputTable, OutputTable };
