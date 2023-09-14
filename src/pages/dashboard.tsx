import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

const Dashboard = () => {
  return (
    <main className="flex min-h-screen flex-col space-y-10 bg-background p-5">
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
              <Link href="/">
                <Plus className="mr-2 h-4 w-4" />
                Create
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Dashboard;
