import { lintGutter } from "@codemirror/lint";
import CodeMirror, { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import {
  Scallop,
  ScallopHighlighter,
  ScallopLinter,
} from "codemirror-lang-scallop";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";

import { Card } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { ScallopDark, ScallopLight } from "~/utils/editor-themes";
import { relationButtonPlugin } from "~/utils/relation-button";

import GooglePicker from "~/components/google-picker";
import SaveToDrive from "~/components/save-to-drive";

const CodeEditor = ({ program }: { program: string }) => {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  const cmRef = React.useRef<ReactCodeMirrorRef>(null);

  function replaceEditorContent(value: string) { 
    if (cmRef.current) {
      const transaction = cmRef.current.view?.state.update({
        changes: {
          from: 0,
          to: cmRef.current.view?.state.doc.length,
          insert: value,
        }
      });
      
      if (transaction) {
        cmRef.current.view?.dispatch(transaction);
        console.log(program);
      }
    }
  }

  // this is to avoid hydration mismatch due to `resolvedTheme` being
  // undefined on the server (because we use SSR)
  useEffect(() => {
    setMounted(true);
  }, []);

  const resolvedEditor = !mounted ? (
    <Skeleton className="h-full w-full rounded-md" />
  ) : (
    <>
    <GooglePicker changeEditorFunction={replaceEditorContent}/>
    <SaveToDrive program={program}/>
    <CodeMirror
      ref={cmRef}
      value={program}
      height="100%"
      extensions={[
        Scallop(),
        ScallopHighlighter(resolvedTheme!),
        ScallopLinter,
        lintGutter(),
        relationButtonPlugin,
      ]}
      theme={resolvedTheme === "light" ? ScallopLight : ScallopDark}
      autoFocus={true}
      placeholder={`// write your Scallop program here`}
      style={{ height: "100%" }}
    />
    </>
  );

  return <Card className="h-full p-4">{resolvedEditor}</Card>;
};

export { CodeEditor };
