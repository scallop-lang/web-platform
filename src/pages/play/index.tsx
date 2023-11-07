import Playground from "~/components/playground";

const Root = () => {
  return (
    <main className="flex h-[calc(100vh-53px)] flex-col gap-3 bg-background p-4">
      <Playground />
    </main>
  );
};

export default Root;
