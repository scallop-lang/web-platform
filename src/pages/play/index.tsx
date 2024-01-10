import { ScallopEditor } from "~/components/scallop-editor";

const Playground = () => {
  return (
    <main className="flex h-[calc(100vh-53px)] w-full flex-col bg-background">
      <ScallopEditor editor={{ type: "playground", project: null }} />
    </main>
  );
};

export default Playground;
