import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

const Playground = () => {
  return (
    <div className="min-h-screen">
      <header className="flex flex-row items-center gap-3 bg-zinc-100 p-3">
        <Link href="/">
          <Image
            src="/content/logo.svg"
            width={50}
            height={50}
            alt="Scallop logo"
          />
        </Link>
        <h1 className="text-2xl font-semibold">Scallop Playground</h1>
      </header>
      <div className="flex items-center justify-center">Hello world!</div>
    </div>
  );
};

const App = () => {
  return (
    <>
      <Head>
        <title>Scallop Playground</title>
        <meta
          name="description"
          content="Scallop Playground"
        />
        <link
          rel="icon"
          href="/favicon.ico"
        />
      </Head>
      <Playground />
    </>
  );
};

export default App;
