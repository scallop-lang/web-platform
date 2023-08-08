import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { useState } from "react";

import { Button, buttonVariants } from "~/components/ui/button";

import {
  type ScallopInput,
  type ScallopOutput,
  type ScallopProgram,
} from "~/server/api/routers/scallop";
import { api } from "~/utils/api";

import TableEditor from "~/components/table-editor";
import CodeEditor from "../components/code-editor";

import { Laptop2, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

const Header = () => {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <header className="flex w-full items-center justify-between border-b border-border bg-neutral-50 p-3 dark:bg-neutral-950">
      <div className="flex items-center space-x-3">
        <Image
          src="/content/logo.svg"
          width={35}
          height={35}
          alt="Scallop logo"
        />
        <h1 className="cursor-default text-xl font-semibold">
          Scallop Playground
        </h1>
      </div>
      <div className="flex space-x-3">
        <Link
          href="https://scallop-lang.github.io/"
          target="_blank"
          className={buttonVariants({ variant: "link" })}
        >
          Website
        </Link>
        <Link
          href="https://github.com/scallop-lang"
          target="_blank"
          className={buttonVariants({ variant: "link" })}
        >
          GitHub
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="outline"
            >
              {resolvedTheme === "light" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              <div className="flex w-full items-center justify-between">
                Light <Sun className="h-4 w-4" />
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              <div className="flex w-full items-center justify-between">
                Dark <Moon className="h-4 w-4" />
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              <div className="flex w-full items-center justify-between">
                System <Laptop2 className="h-4 w-4" />
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

const Playground = () => {
  const [program, setProgram] = useState<ScallopProgram>(
    "rel grandparent(a, c) = parent(a, b, true), parent(b, c, true)"
  );
  const [inputs, setInputs] = useState<ScallopInput[]>([
    {
      type: "input",
      name: "parent",
      args: [
        { name: "a", type: "String" },
        { name: "b", type: "String" },
        { name: "c", type: "Boolean" },
      ],
      facts: [
        [1, ["Alice", "Bob", "true"]],
        [1, ["Bob", "Emily", "true"]],
      ],
    },
  ]);
  const [outputs, setOutputs] = useState<ScallopOutput[]>([
    {
      type: "output",
      name: "grandparent",
      args: [
        { name: "a", type: "String" },
        { name: "b", type: "String" },
      ],
    },
  ]);

  const { data } = api.scallop.run.useQuery({
    program: program,
    inputs: inputs,
    outputs: outputs,
  });

  console.log("data:", data);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="grid h-[calc(100vh-65px)] grid-cols-1 gap-5 bg-background p-5 lg:grid-cols-2 lg:gap-8 lg:p-8">
        <CodeEditor
          program={program}
          onProgramChange={setProgram}
        />
        <TableEditor
          inputs={inputs}
          outputs={outputs}
          onInputsChange={setInputs}
          onOutputsChange={setOutputs}
        />
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
