import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { RelationRecord, SclRelation } from "~/utils/schemas-types";
import CreateRelationDialog from "./create-relation-dialog";
import { Table } from "./table";
import { Card } from "./ui/card";

const RelationSelect = ({
  inputs,
  outputs,
  bothEmpty,
  setActiveRelationName,
}: {
  inputs: RelationRecord;
  outputs: RelationRecord;
  bothEmpty: boolean;
  setActiveRelationName: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const parseRelations = (record: RelationRecord) => {
    const selectItems: React.ReactNode[] = [];
    let index = 0;

    for (const [name, relation] of Object.entries(record)) {
      const types = `(${relation.args
        .map((arg) => (arg.name ? `${arg.name}: ${arg.type}` : `${arg.type}`))
        .join(", ")})`;

      selectItems.push(
        <SelectItem
          key={index}
          value={name}
        >
          {name + types}
        </SelectItem>
      );

      index += 1;
    }

    return selectItems;
  };

  const inputItems = bothEmpty ? [] : parseRelations(inputs);
  const outputItems = bothEmpty ? [] : parseRelations(outputs);

  const noItem = (
    <SelectItem
      disabled
      value="none"
    >
      None
    </SelectItem>
  );

  return (
    <Select
      onValueChange={setActiveRelationName}
      disabled={bothEmpty}
    >
      <SelectTrigger className="basis-1/2">
        <SelectValue placeholder={bothEmpty ? "Empty" : "Nothing selected"} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Input relations</SelectLabel>
          {inputItems.length === 0 ? noItem : inputItems}
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Output relations</SelectLabel>
          {outputItems.length === 0 ? noItem : outputItems}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

const TableEditor = ({
  inputs,
  outputs,
  setInputs,
  setOutputs,
}: {
  inputs: RelationRecord;
  outputs: RelationRecord;
  setInputs: React.Dispatch<React.SetStateAction<RelationRecord>>;
  setOutputs: React.Dispatch<React.SetStateAction<RelationRecord>>;
}) => {
  const [activeRelationName, setActiveRelationName] = useState("");

  // adds newly created relation to inputs or outputs, depending on
  // what was chosen in the create relation dialog
  function addRelation(relation: SclRelation) {
    if (relation.type === "input") {
      const inputsCopy = { ...inputs };
      inputsCopy[relation.name] = relation;
      setInputs(inputsCopy);
    } else {
      const outputsCopy = { ...outputs };
      outputsCopy[relation.name] = relation;
      setOutputs(outputsCopy);
    }
  }

  const bothEmpty =
    Object.keys(inputs).length === 0 && Object.keys(outputs).length === 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between space-x-10">
        <CreateRelationDialog addRelation={addRelation} />
        <RelationSelect
          inputs={inputs}
          outputs={outputs}
          bothEmpty={bothEmpty}
          setActiveRelationName={setActiveRelationName}
        />
      </div>
      <Card className="h-0 grow p-4">
        {bothEmpty ? (
          <div className="flex h-full cursor-default items-center justify-center text-sm text-muted-foreground">
            You don&apos;t have any relations yet. Create one first!
          </div>
        ) : activeRelationName ? (
          inputs[activeRelationName] ? (
            <Table
              relationName={activeRelationName}
              record={inputs}
              setRecord={setInputs}
            />
          ) : (
            <Table
              relationName={activeRelationName}
              record={outputs}
              setRecord={setOutputs}
            />
          )
        ) : (
          <div className="flex h-full cursor-default items-center justify-center text-sm text-muted-foreground">
            Select a relation table to view its contents.
          </div>
        )}
      </Card>
    </div>
  );
};

export default TableEditor;
