import { ArrowRight, BookCopy } from "lucide-react";
import Head from "next/head";
import Link from "next/link";

import { api } from "~/utils/api";

const Featured = () => {
  const { data } = api.project.getFeaturedProjects.useQuery();

  return (
    <>
      <Head>
        <title>Examples — Scallop</title>
      </Head>

      <main className="mx-auto flex min-h-screen max-w-[950px] flex-col space-y-8 p-6 sm:p-12">
        <section className="flex flex-col space-y-6">
          <h2 className="flex scroll-m-20 flex-col gap-1 text-3xl font-semibold tracking-tight">
            <BookCopy size={35} />
            Example Scallop projects
          </h2>

          <div className="flex flex-col space-y-6">
            <p className="text-pretty">
              Here you will find demos and example projects from the Scallop
              team. We hope that these will effectively showcase the
              capabilities of the language. Enter a project to see and run its
              contents.
            </p>
            <p className="text-pretty">
              In the future, members from the community will be able to publish
              and share their projects here!
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">
            From the Scallop team
          </h2>

          <div className="xs:grid-cols-2 grid grid-cols-1 gap-2.5 text-sm">
            {data?.map(({ id, title, description, createdAt }) => (
              <Link
                key={id}
                href={`/project/${id}`}
                className="group rounded-md border border-border p-5 shadow-sm transition-colors hover:bg-secondary"
              >
                <h3 className="flex items-center font-semibold group-hover:underline">
                  {title}{" "}
                  <ArrowRight
                    size={16}
                    className="ml-1 transition group-hover:translate-x-1"
                  />
                </h3>
                <p>{description}</p>
                <p className="text-muted-foreground">
                  Created on {createdAt.toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
};

export default Featured;
