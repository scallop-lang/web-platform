import { useRouter } from "next/router";

const NotFound = () => {
  const router = useRouter();

  return (
    <main className="flex h-[calc(100vh-53px)] flex-col items-center justify-center space-y-2.5">
      <h2 className="text-5xl font-bold text-secondary-foreground">404</h2>
      <p className="text-2xl font-medium">Sorry, page not found.</p>
      <p className="rounded-md border-[1.5px] border-muted-foreground/50 bg-muted px-2 py-1 font-mono text-sm">
        {router.asPath}
      </p>
    </main>
  );
};

export default NotFound;
