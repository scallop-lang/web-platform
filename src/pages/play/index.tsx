import { ScallopEditor } from "~/components/scallop-editor";
import { Button } from "~/components/ui/button";

const Playground = () => {
  return (
    <main className="flex h-[calc(100vh-53px)] w-full flex-col bg-background">
      <div className="grid grid-cols-2 border-b-[1.5px] border-border p-4">
        <div className="col-span-1">
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Playground
          </h2>
          <p>info text or something.</p>
        </div>

        <div className="col-span-1 flex justify-end gap-1.5">
          <Button>Quick Layout... (dropdown)</Button>
          <Button>Export... (dropdown)</Button>
          <Button>Import</Button>
          <Button>Reset</Button>
        </div>
      </div>

      <ScallopEditor program="" />
    </main>
  );
};

export default Playground;
