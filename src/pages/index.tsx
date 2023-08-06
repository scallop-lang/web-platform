import { PlayCircle } from "lucide-react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/button";

const Playground = () => {
  return (
    <div className="min-h-screen">
      <header className="flex flex-row items-center gap-3 bg-zinc-100 p-3">
        <Link href="/">
          <Image
            className="transition hover:brightness-110"
            src="/content/logo.svg"
            width={50}
            height={50}
            alt="Scallop logo"
          />
        </Link>
        <h1 className="select-none text-2xl font-semibold">
          Scallop Playground
        </h1>
      </header>
      <main className="flex items-center justify-center">
        <Button
          className="bg-pink-300 text-black hover:bg-pink-400"
          onClick={() => alert("program should run!")}
        >
          <PlayCircle className="mr-2 h-5 w-5" />
          <span className="text-base">Run Program</span>
        </Button>
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
