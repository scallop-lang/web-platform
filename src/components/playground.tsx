import CodeEditor from "./code-editor";
import TableEditor from "./table-editor";

const Playground = () => {
  return (
    <div className="grid h-full auto-rows-fr grid-cols-2 gap-3">
      <CodeEditor />
      <TableEditor />
    </div>
  );
};

export default Playground;
