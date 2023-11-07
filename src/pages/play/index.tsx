import { ScallopEditor } from "~/components/scallop-editor";

const Playground = () => {
  return (
    <main className="flex h-[calc(100vh-53px)] flex-col gap-3 bg-background p-4">
      <ScallopEditor />
    </main>
  );
};

export default Playground;
