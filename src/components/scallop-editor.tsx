import { CodeEditor } from "~/components/code-editor";
import { Card } from "~/components/ui/card";

const ScallopEditor = () => {
  return (
    <div className="grid h-full auto-rows-fr grid-cols-2 gap-3">
      <CodeEditor />
      <Card className="col-span-1 h-full grow p-4 text-sm">panel</Card>
    </div>
  );
};

export { ScallopEditor };
