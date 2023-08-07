import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import TableEditor from "~/components/TableEditor";
import { CodeEditor } from "../components/CodeEditor";

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

const Playground = () => {
  const [program, setProgram] = useState(
    "rel grandparent(a, c) = parent(a, b), parent(b, c)"
  );

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
