import { Trash, X } from "lucide-react";
import { useContext, useState } from "react";

import type { RelationRecord, SclRelation } from "~/utils/schemas-types";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { ProjectContext, TableContext } from "~/pages/project/projectContext";

const DeleteRelation = () => {
  const { inputs, outputs, setInputs, setOutputs} = useContext(ProjectContext);
  const { activeRelationName, setActiveRelationName } = useContext(TableContext);

  const record = inputs[activeRelationName] ? inputs : outputs;
  const relation = record[activeRelationName]!;

  const [dialogOpen, setDialogOpen] = useState(false);

  function closeDialogBeforeDelete(relation: SclRelation) {
    if (relation !== undefined) {
      deleteRelation(relation);
      setDialogOpen(false);
    }
  }

  // delete relation from inputs or outputs, depending on what was chosen
  function deleteRelation(relation: SclRelation) {
    if (relation.type === "input") {
      const inputsCopy = structuredClone(inputs);
      delete inputsCopy[relation.name];
      setInputs(inputsCopy);
    } else {
      const outputsCopy = structuredClone(outputs);
      delete outputsCopy[relation.name];
      setOutputs(outputsCopy);
    }
    setActiveRelationName("");
  }

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(open) => {
        setDialogOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          disabled={!activeRelationName}
        >
          <Trash className="mr-2 w-4 h-4" /> Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Wait! Don&apos;t delete yet!</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the relation{" "}
            <b>{activeRelationName}</b>?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">
            <X className="mr-2 h-4 w-4" /> No, cancel.
          </Button>
          <Button
            variant="destructive"
            onClick={() => closeDialogBeforeDelete(relation)}
          >
            <Trash className="mr-2 h-4 w-4" /> Yes, delete.
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteRelation;
