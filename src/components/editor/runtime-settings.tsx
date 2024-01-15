import { Settings } from "lucide-react";

import { Button } from "~/components/ui/button";

type RuntimeProps =
  | { provenance: "unit" | "proofs" | "minmaxprob" | "addmultprob" }
  | { provenance: "topkproofs"; k: number };

const RuntimeSettings = ({
  setRuntime,
}: {
  setRuntime: React.Dispatch<React.SetStateAction<RuntimeProps>>;
}) => {
  return (
    <Button variant="outline">
      <Settings
        className="mr-1.5"
        size={16}
      />{" "}
      Runtime
    </Button>
  );
};

export { RuntimeSettings, type RuntimeProps };
