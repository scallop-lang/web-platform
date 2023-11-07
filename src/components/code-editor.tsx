import { lintGutter } from "@codemirror/lint";
import CodeMirror from "@uiw/react-codemirror";
import {
  Scallop,
  ScallopHighlighter,
  ScallopLinter,
} from "codemirror-lang-scallop";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Card } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { ScallopDark, ScallopLight } from "~/utils/editor-themes";

const CodeEditor = () => {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  // this is to avoid hydration mismatch due to `resolvedTheme` being
  // undefined on the server (because we use SSR)
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
    />
  );

  return <Card className="col-span-1 h-full grow p-4">{resolvedEditor}</Card>;
};

export { CodeEditor };
