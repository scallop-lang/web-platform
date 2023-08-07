import CodeMirror from "@uiw/react-codemirror";
import { FileDown, PlayCircle } from "lucide-react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import TableEditor from "~/components/TableEditor";
import { Button } from "~/components/ui/button";
import { downloadRawFile } from "../utils/downloadRawFile";

const Header = () => {
  return (
    <header className="flex max-h-min flex-row items-center gap-3 bg-zinc-100 p-3">
      <Link
        href="https://scallop-lang.github.io/"
        target="_blank"
      >
        <Image
          className="transition hover:brightness-110"
          src="/content/logo.svg"
          width={50}
          height={50}
          alt="Scallop logo"
        />
      </Link>
      <h1 className="select-none text-2xl font-semibold">Scallop Playground</h1>
    </header>
  );
};

const EditorToolbar = ({ code }: { code: string }) => {
  return (
    <div className="flex items-center justify-between">
      <Button
        className="bg-pink-300 text-black hover:bg-pink-400"
        onClick={() =>
          alert("should eventually run the following code:\n\n" + code)
        }
      >
        <PlayCircle className="mr-2 h-5 w-5" />
        <span className="text-base">Run Program</span>
      </Button>
      <Button
        variant="outline"
        onClick={() => downloadRawFile(code)}
      >
        <FileDown className="mr-2 h-5 w-5" />
        <span className="text-base">Download raw Scallop (.scl) file</span>
      </Button>
    </div>
  );
};

const CodeEditor = () => {
  const [code, setCode] = useState(
    `rel name(a, b) :- name(a, b), is_a(c, b)\nrel num_animals(n) :- count(o: name(o, "animal"))`
  );

  return (
    <div className="flex flex-col space-y-4">
      <EditorToolbar code={code} />
      <div className="h-0 grow rounded-md bg-zinc-200 p-4">
        <CodeMirror
          value={code}
          height="100%"
          autoFocus={true}
          placeholder={`// write your Scallop program here`}
          style={{ height: "100%" }}
          onChange={setCode}
        />
      </div>
    </div>
  );
};

const Playground = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="grid h-[calc(100vh-74px)] grid-cols-1 gap-8 p-8 lg:grid-cols-2">
        <CodeEditor />
        <TableEditor />
      </main>
    </div>
  );
};

const App = () => {
  return (
    <>
      <Head>
        <title>Scallop Playground</title>
        <link
          rel="icon"
          type="image/svg+xml"
          href="/favicon.svg"
        />
        <link
          rel="icon"
          type="image/png"
          href="/favicon.png"
        />
      </Head>
      <Playground />
    </>
  );
};

export default App;
