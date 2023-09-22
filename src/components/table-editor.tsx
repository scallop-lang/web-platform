import React, { useState, useContext } from "react";
import { ProjectContext, TableContext } from "~/pages/project/projectContext";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { RelationRecord } from "~/utils/schemas-types";

import CreateRelationDialog from "./create-relation-dialog";
import DeleteRelation from "./delete-relation";
import { Table } from "./table";
import { Card } from "./ui/card";

const RelationSelect = ({
  bothEmpty
}: {
  bothEmpty: boolean;
}) => {
  const {inputs, outputs} = useContext(ProjectContext);
  const { activeRelationName, setActiveRelationName } = useContext(TableContext);
  const parseRelations = (record: RelationRecord) => {
    const selectItems: React.ReactNode[] = [];

    for (const [name, relation] of Object.entries(record)) {
      const types = `(${relation.args
        .map((arg) => (arg.name ? `${arg.name}: ${arg.type}` : `${arg.type}`))
        .join(", ")})`;

      // we use the relation name as the key, because it is unique
      selectItems.push(
        <SelectItem
          key={name}
          value={name}
        >
          {name + types}
        </SelectItem>
      );
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
      value={activeRelationName ? activeRelationName : undefined}
      onValueChange={setActiveRelationName}
      disabled={bothEmpty}
    >
      <SelectTrigger className="w-2/3 h-9">
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

const TableEditor = () => {
  const {inputs, outputs, setInputs, setOutputs} = useContext(ProjectContext);
  const [activeRelationName, setActiveRelationName] = useState("");

  const bothEmpty =
    Object.keys(inputs).length === 0 && Object.keys(outputs).length === 0;

  return (
    <TableContext.Provider value={{activeRelationName, setActiveRelationName}}>
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between space-x-10">
          <CreateRelationDialog/>
          <div className="flex grow justify-end space-x-2">
            <DeleteRelation/>
            <RelationSelect
              bothEmpty={bothEmpty}
            />
          </div>
        </div>
        <Card className="h-0 grow p-4">
          {bothEmpty ? (
            <div className="flex h-full cursor-default items-center justify-center text-sm text-muted-foreground">
              You don&apos;t have any relations yet. Create one first!
            </div>
          ) : activeRelationName ? (
            inputs[activeRelationName] ? (
              <Table
                record={inputs}
                setRecord={setInputs}
              />
            ) : (
              <Table
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
    </TableContext.Provider>
  );
};

export default TableEditor;
