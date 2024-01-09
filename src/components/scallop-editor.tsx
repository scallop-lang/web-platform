import { CodeEditor } from "~/components/code-editor";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable";

const ScallopEditor = ({ program }: { program: string }) => {
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel
        defaultSize={50}
        minSize={25}
      >
        <CodeEditor program={program} />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel
        defaultSize={50}
        minSize={25}
      >
        <div className="flex h-full items-center justify-center">
          hi i&apos;m a table
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export { ScallopEditor };
