import { FileDown, PlayCircle, PlusSquare } from "lucide-react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";

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
  );
};

const CodeEditor = () => {
  const [code, setCode] = useState(
    `// this will eventually be a fully functioning code editor.\n// for now, it holds some placeholder text I put in.\n// currently it's just a <textarea>. feel free to edit.\n\nrel name(a, b) :- name(a, c), is_a(c, b)\nrel num_animals(n) :- n = count(o: name(o, "animal"))\n\n// of course, the real editor will have syntax highlighting.`
  );

  return (
    <div className="flex flex-col gap-4">
      <EditorToolbar code={code} />
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

const CreateRelationModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="shrink-0 bg-pink-300 text-black hover:bg-pink-400">
          <PlusSquare className="mr-2 h-5 w-5" />
          <span className="text-base">Create Relation</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Relation</DialogTitle>
          <DialogDescription>
            This is where you&apos;ll be creating and editing your relation
            signatures/arguments. Work in progress.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

const TableSelect = () => {
  return (
    <Select>
      <SelectTrigger className="grow">
        <SelectValue placeholder="Select an input table"></SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>
            Of course, num_animals(n) is an <br /> output relation, so it&apos;s
            not displayed here.
          </SelectLabel>
          <SelectItem value="name(a: String, b: String)">
            <span className="font-mono">name(a: String, b: String)</span>
          </SelectItem>
          <SelectItem value="is_a(x: String, y: String)">
            <span className="font-mono">is_a(x: String, y: String)</span>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

const TableEditor = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-10">
        <CreateRelationModal />
        <TableSelect />
        <div className="flex items-center gap-3">
          <Label className="text-base">Input</Label>
          <Switch />
          <Label className="text-base">Output</Label>
        </div>
      </div>
      <div className="grow rounded-md bg-zinc-200 p-4">
        this is where we&apos;re going to render the tables.
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
