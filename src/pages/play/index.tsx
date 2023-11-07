import { ScallopEditor } from "~/components/scallop-editor";

const Playground = () => {
  return (
    <main className="h-[calc(100vh-53px)] w-full bg-background p-4">
      <ScallopEditor program="" />
    </main>
  );
};

export default Playground;
