import Head from "next/head";
import { useRouter } from "next/router";

import Header from "~/components/header";
import { cn } from "~/utils/cn";

const CommonLayout = ({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) => {
  const { asPath } = useRouter();

  const title =
    (asPath === "/play"
      ? "Playground | "
      : asPath === "/featured"
      ? "Featured | "
      : asPath === "/dashboard"
      ? "Dashboard | "
      : asPath.includes("/project")
      ? "Project | "
      : "") + "Scallop";

  return (
    <div className={cn(className)}>
      <Head>
        <title>{title}</title>
      </Head>
      <Header />
      {children}
    </div>
  );
};

export default CommonLayout;
