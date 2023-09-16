import { Trash, X } from "lucide-react";
import { useState } from "react";

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

const DeleteRelation = ({
  inputs,
  outputs,
  selectedRelationName,
  deleteRelation,
}: {
  inputs: RelationRecord;
  outputs: RelationRecord;
  selectedRelationName: string;
  deleteRelation: (relation: SclRelation) => void;
}) => {
  const record = inputs[selectedRelationName] ? inputs : outputs;
  const relation = record[selectedRelationName]!;

  const [dialogOpen, setDialogOpen] = useState(false);

  function closeDialogBeforeDelete(relation: SclRelation) {
    if (relation !== undefined) {
      deleteRelation(relation);
      setDialogOpen(false);
    }
  }

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(open) => {
        setDialogOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button disabled={!selectedRelationName}>
          <Trash /> Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Wait! Don&apos;t Delete Yet!</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the relation{" "}
            <b>{selectedRelationName}</b>?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={() => closeDialogBeforeDelete(relation)}
          >
            <Trash className="mr-2 h-4 w-4" /> Yes, Delete.
          </Button>
          <Button onClick={() => setDialogOpen(false)}>
            <X className="mr-2 h-4 w-4" /> No, Cancel.
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteRelation;
