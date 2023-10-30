import Head from "next/head";
import { useRouter } from "next/router";

const ScallopHead = () => {
  const { asPath } = useRouter();

  return (
    <Head>
      <title>
        {asPath === "/play"
          ? "Playground | "
          : asPath === "/featured"
          ? "Featured | "
          : asPath === "/dashboard"
          ? "Dashboard | "
          : ""}
        Scallop
      </title>

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
