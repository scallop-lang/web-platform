import Head from "next/head";
import { useRouter } from "next/router";

const ScallopHead = () => {
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
    <Head>
      <title>{title}</title>

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
  );
};

export default ScallopHead;
