import { ArrowRight, Loader } from "lucide-react";
import { type NextRouter } from "next/router";
import { useState } from "react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

const ProjectCard = ({
  router,
  projectId,
  name,
  description,
  createdAt,
  showDate = true,
}: {
  router: NextRouter;
  projectId: string;
  name: string;
  description: string | null;
  createdAt: Date;
  showDate?: boolean;
}) => {
  const [loading, setLoading] = useState(false);

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="truncate">{name}</CardTitle>
        <CardDescription className="line-clamp-2 flex flex-col space-y-2">
          <span>{description ? description : "No description provided."}</span>
          {showDate ? (
            <span>
              Created on {createdAt.toLocaleDateString()} at{" "}
              {createdAt.toLocaleTimeString()}
            </span>
          ) : null}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={async () => {
            setLoading(true);
            await router.push(`/project/${projectId}`);
          }}
          className="w-fit"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" /> Loading...
            </>
          ) : (
            <>
              <ArrowRight className="mr-2 h-4 w-4" />
              Go to project
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
