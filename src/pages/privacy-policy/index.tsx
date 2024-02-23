import { Shield } from "lucide-react";
import Head from "next/head";

const PrivacyPolicy = () => {
  return (
    <>
      <Head>
        <title>Privacy Policy — Scallop</title>
      </Head>

      <main className="mx-auto flex min-h-[calc(100vh-53px)] max-w-[950px] flex-col space-y-6 p-6 sm:p-12">
        <h2 className="flex scroll-m-20 flex-col gap-1 text-3xl font-semibold tracking-tight">
          <Shield size={35} />
          Privacy policy
        </h2>

        <section className="space-y-6">test</section>
      </main>
    </>
  );
};

export default PrivacyPolicy;
