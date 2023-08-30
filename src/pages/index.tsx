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
      <div className="min-h-screen">
        <Header />
        <main className="h-[calc(100vh-65px)] bg-background p-5 lg:p-8">
          <div className="flex flex-col">
            <h3>Your projects</h3>
            <Card className="w-[350px]">
              <CardHeader>
                <CardTitle>Create new project</CardTitle>
                <CardDescription>
                  Start an empty project, or take a look at the demos below.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href="/new">Create</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
          <div className="flex flex-col">
            <h3>AAAI demos</h3>
          </div>
        </main>
      </div>
    </>
  );
};

export default App;
