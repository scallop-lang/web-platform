import { ScallopEditor } from "~/components/scallop-editor";
import GooglePicker from "~/components/google-picker";

const Playground = () => {
  return (
    <main className="h-[calc(100vh-53px)] w-full bg-background p-4">
      <GooglePicker />
      <ScallopEditor program="" />
    </main>
  );
};

export default Playground;
