import { FileDown, PlayCircle } from "lucide-react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "~/components/ui/button";

const Header = () => {
  return (
    <header className="flex max-h-min flex-row items-center gap-3 bg-zinc-100 p-3">
      <Link href="/">
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

const CodeEditor = () => {
  const [code, setCode] = useState(
    `// this will eventually be a fully functioning code editor.\n// for now, it holds some placeholder text I put in.\n// currently it's just a <textarea>. feel free to edit.\n\nrel name(a, b) :- name(a, c), is_a(c, b)\nrel num_animals(n) :- n = count(o: name(o, "animal"))\n\n// of course, the real editor will have syntax highlighting.`
  );

  return (
    <div className="flex flex-col gap-4">
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
          onClick={() =>
            alert(
              "should eventually download the following code, concatenated with stuff from the tables:\n\n" +
                code
            )
          }
        >
          <FileDown className="mr-2 h-5 w-5" />
          <span className="text-base">Download raw Scallop (.scl) file</span>
        </Button>
      </div>
      <div className="grow rounded-md bg-zinc-200 p-4">
        <textarea
          className="h-full w-full resize-none bg-inherit font-mono text-base"
          value={code}
          onChange={(e) => setCode(e.target.value)}
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
        <div className="bg-green-100">Test</div>
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
