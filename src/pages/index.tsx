import { Plus } from "lucide-react";
import Head from "next/head";
import Link from "next/link";
import Header from "~/components/header";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

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
      <Header />
      <main className="flex min-h-screen flex-col space-y-10 bg-background p-5 lg:p-8">
        <div className="flex flex-col space-y-1.5">
          <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Your projects
          </h3>
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>New project</CardTitle>
              <CardDescription>
                Start an empty project from scratch. Just the defaults. No
                relations defined.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col space-y-1.5">
          <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
            AAAI demos
          </h3>
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>Coming soon...</CardTitle>
              <CardDescription>lol</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
};

export default App;
