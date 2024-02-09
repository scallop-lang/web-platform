import { PanelResizeHandle } from "react-resizable-panels";

const ResizeHandle = () => {
  return (
    <PanelResizeHandle>
      <div className="h-full rounded-sm p-1.5 transition-colors hover:bg-muted" />
    </PanelResizeHandle>
  );
};

export { ResizeHandle };
