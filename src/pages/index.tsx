import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import TableEditor from "~/components/table-editor";
import CodeEditor from "../components/code-editor";

import { Laptop2, Moon, Sun } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Skeleton } from "~/components/ui/skeleton";

import type { RelationRecord, SclProgram } from "~/utils/schemas-types";

const Header = () => {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  // to avoid hydration mismatch, we render a skeleton before page is mounted on client
  // this is because on the server, `resolvedTheme` is undefined
  // also see https://github.com/pacocoursey/next-themes#avoid-hydration-mismatch
  useEffect(() => setMounted(true), []);

  const resolvedIcon = !mounted ? (
    <Skeleton className="h-4 w-4 rounded-full" />
  ) : resolvedTheme === "light" ? (
    <Sun className="h-4 w-4" />
  ) : (
    <Moon className="h-4 w-4" />
  );

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
      <div className="flex space-x-7">
        <Link
          href="https://scallop-lang.github.io/"
          target="_blank"
          className="inline-flex items-center justify-center text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          Website
        </Link>
        <Link
          href="https://github.com/scallop-lang"
          target="_blank"
          className="inline-flex items-center justify-center text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          GitHub
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              aria-haspopup
              aria-label="Toggle light or dark mode"
            >
              {resolvedIcon}
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
  const [program, setProgram] = useState<SclProgram>(
    "rel grandparent(a, c) = parent(a, b, true), parent(b, c, true)"
  );

  const [inputs, setInputs] = useState<RelationRecord>({
    parent: {
      type: "input",
      name: "parent",
      args: [
        { name: "a", type: "String" },
        { type: "String" },
        { name: "c", type: "Boolean" },
      ],
      probability: false,
      facts: [
        [1, ["Alice", "Bob", "true"]],
        [1, ["Bob", "Emily", "true"]],
      ],
    },
  });

  const [outputs, setOutputs] = useState<RelationRecord>({
    grandparent: {
      type: "output",
      name: "grandparent",
      args: [{ type: "String" }, { name: "b", type: "String" }],
      probability: false,
      facts: [],
    },
  });

  return (
    <div className="min-h-screen">
      <Header />
      <main className="grid h-[calc(100vh-65px)] grid-cols-1 gap-5 bg-background p-5 lg:grid-cols-2 lg:gap-8 lg:p-8">
        <CodeEditor
          inputs={inputs}
          outputs={outputs}
          program={program}
          setProgram={setProgram}
        />
        <TableEditor
          inputs={inputs}
          outputs={outputs}
          setInputs={setInputs}
          setOutputs={setOutputs}
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
