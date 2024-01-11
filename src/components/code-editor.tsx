import { lintGutter } from "@codemirror/lint";
import type { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import CodeMirror from "@uiw/react-codemirror";
import {
  Scallop,
  ScallopHighlighter,
  ScallopLinter,
} from "codemirror-lang-scallop";

import { ScallopLight } from "~/utils/editor-themes";
import { relationButtonPlugin } from "~/utils/relation-button";

const CodeEditor = ({
  program,
  setProgram,
  cmRef,
}: {
  program: string;
  setProgram: React.Dispatch<React.SetStateAction<string>>;
  cmRef: React.RefObject<ReactCodeMirrorRef>;
}) => {
  return (
    <CodeMirror
      ref={cmRef}
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
      onChange={(value) => setProgram(value)}
    />
  );
};

export { CodeEditor };
