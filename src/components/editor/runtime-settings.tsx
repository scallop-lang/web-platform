import { Check, Settings } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Provenances } from "~/utils/schemas-types";

type RuntimeProps =
  | { provenance: "unit" | "proofs" | "minmaxprob" | "addmultprob" }
  | { provenance: "topkproofs"; k: number };

const RuntimeSettings = ({
  runtime,
  setRuntime,
}: {
  runtime: RuntimeProps;
  setRuntime: React.Dispatch<React.SetStateAction<RuntimeProps>>;
}) => {
  const [open, setOpen] = useState(false);
  const [provenance, setProvenance] = useState(runtime.provenance);
  const [kValueStr, setKValueStr] = useState(
    runtime.provenance === "topkproofs" ? String(runtime.k) : "",
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setProvenance(runtime.provenance);
        setKValueStr(
          runtime.provenance === "topkproofs" ? String(runtime.k) : "",
        );
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="secondary">
          <Settings
            className="mr-1.5"
            size={16}
          />{" "}
          Runtime
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Runtime settings</DialogTitle>
          <DialogDescription>
            Configure the context that your program should run with. Note that
            selecting <span className="font-mono">topkproofs</span> as the
            provenance also requires a k-value.
          </DialogDescription>
        </DialogHeader>

        <div>
          <Label>Provenance</Label>
          <Select
            value={provenance}
            onValueChange={(value) =>
              setProvenance(value as RuntimeProps["provenance"])
            }
          >
            <SelectTrigger className="font-mono">
              <SelectValue
                aria-label={provenance}
                placeholder="Select a provenance"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Provenances.map((provenance) => (
                  <SelectItem
                    key={provenance}
                    value={provenance}
                    className="font-mono"
                  >
                    {provenance}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {provenance === "topkproofs" ? (
          <div>
            <Label htmlFor="k-value-input">k-value</Label>
            <Input
              id="k-value-input"
              placeholder="Enter a k-value (must be a positive integer)"
              value={kValueStr}
              onChange={(e) => setKValueStr(e.target.value)}
            />
          </div>
        ) : null}

        <DialogFooter>
          <Button
            type="button"
            onClick={() => {
              if (provenance === "topkproofs") {
                const maybeKValue = parseInt(kValueStr);

                if (Number.isNaN(maybeKValue) || maybeKValue <= 0) {
                  setRuntime({ provenance, k: 3 });
                  toast.info(
                    "The k-value you entered was invalid. It has been changed to the default value (k=3).",
                  );
                } else {
                  setRuntime({ provenance, k: maybeKValue });
                }
              } else {
                setRuntime({ provenance });
              }

              setOpen(false);
            }}
          >
            <Check
              className="mr-1.5"
              size={16}
            />{" "}
            Confirm changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { RuntimeSettings, type RuntimeProps };
