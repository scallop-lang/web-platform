import { Panel, PanelGroup } from "react-resizable-panels";

import { CodeEditor } from "~/components/code-editor";
import { ResizeHandle } from "~/components/resize-handle";
import { Card } from "~/components/ui/card";

const ScallopEditor = () => {
  return (
    <PanelGroup
      direction="horizontal"
      id="scallop-editor"
    >
      <Panel
        id="code-editor"
        defaultSize={50}
        className="mr-1"
      >
        <CodeEditor />
      </Panel>

      <ResizeHandle />

      <Panel
        id="sidebar-group"
        defaultSize={50}
        className="ml-1"
      >
        <PanelGroup
          direction="vertical"
          id="sidebar"
        >
          <Panel
            id="inputs"
            defaultSize={50}
            className="mb-1"
          >
            <Card className="col-span-1 h-full grow p-4 text-sm">Inputs</Card>
          </Panel>

          <ResizeHandle />

          <Panel
            id="outputs"
            defaultSize={50}
            className="mt-1"
          >
            <Card className="col-span-1 h-full grow p-4 text-sm">Outputs</Card>
          </Panel>
        </PanelGroup>
      </Panel>
    </PanelGroup>
  );
};

export { ScallopEditor };
