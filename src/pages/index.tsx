import Head from "next/head";

import { useState } from "react";

import TableEditor from "~/components/table-editor";
import CodeEditor from "../components/code-editor";

import Header from "~/components/header";
import type { RelationRecord, SclProgram } from "~/utils/schemas-types";

const Playground = () => {
  const [program, setProgram] = useState<SclProgram>(
    "rel grandparent(a, c) = parent(a, b, true), parent(b, c, true)"
  );

  const [inputs, setInputs] = useState<RelationRecord>({
    parent: {
      type: "input",
      name: "parent",
      args: [
        { id: "0", name: "a", type: "String" },
        { id: "1", type: "String" },
        { id: "2", name: "c", type: "Boolean" },
      ],
      probability: false,
      facts: [
        { id: "0", tag: 1, tuple: ["Alice", "Bob", "true"] },
        { id: "1", tag: 1, tuple: ["Bob", "Emily", "true"] },
        { id: "2", tag: 1, tuple: ["Anthony", "Jason", "true"] },
        { id: "3", tag: 1, tuple: ["Steve", "Origami Angel", "true"] },
        { id: "4", tag: 1, tuple: ["Thomas", "Walter", "true"] },
        { id: "5", tag: 1, tuple: ["Charles", "Ryan", "true"] },
        { id: "6", tag: 1, tuple: ["Aaron", "Rajiv", "true"] },
      ],
    },
  });

  const [outputs, setOutputs] = useState<RelationRecord>({
    grandparent: {
      type: "output",
      name: "grandparent",
      args: [
        { id: "0", type: "String" },
        { id: "1", name: "b", type: "String" },
      ],
      probability: true,
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
          setOutputs={setOutputs}
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
