import { lintGutter } from "@codemirror/lint";
import CodeMirror from "@uiw/react-codemirror";
import {
  Scallop,
  ScallopHighlighter,
  ScallopLinter,
} from "codemirror-lang-scallop";

import { Card } from "~/components/ui/card";
import { ScallopLight } from "~/utils/editor-themes";
import { relationButtonPlugin } from "~/utils/relation-button";

const CodeEditor = ({ program }: { program: string }) => {
  return (
    <Card className="h-full p-4">
      <CodeMirror
        value={program}
        height="100%"
        extensions={[
          Scallop(),
          ScallopHighlighter("light"),
          ScallopLinter,
          lintGutter(),
          relationButtonPlugin,
        ]}
        theme={ScallopLight}
        autoFocus={true}
        placeholder={`// write your Scallop program here`}
        style={{ height: "100%" }}
      />
    </Card>
  );
};

export { CodeEditor };
