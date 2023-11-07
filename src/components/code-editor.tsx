import { lintGutter } from "@codemirror/lint";
import CodeMirror from "@uiw/react-codemirror";
import {
  Scallop,
  ScallopHighlighter,
  ScallopLinter,
} from "codemirror-lang-scallop";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { ScallopDark, ScallopLight } from "~/utils/editor-themes";

import { Card } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

const CodeEditor = () => {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  // this is to avoid hydration mismatch due to `resolvedTheme` being
  // undefined on the server
  useEffect(() => {
    setMounted(true);
  }, []);

  const resolvedEditor = !mounted ? (
    <Skeleton className="h-full w-full rounded-md" />
  ) : (
    <CodeMirror
      value={""}
      height="100%"
      extensions={[
        Scallop(),
        ScallopHighlighter(resolvedTheme!),
        ScallopLinter,
        lintGutter(),
      ]}
      theme={resolvedTheme === "light" ? ScallopLight : ScallopDark}
      autoFocus={true}
      placeholder={`// write your Scallop program here`}
      style={{ height: "100%" }}
      onChange={(code) => console.log("code: ", code)}
    />
  );

  return <Card className="col-span-1 h-full grow p-4">{resolvedEditor}</Card>;
};

export default CodeEditor;
