import { GeistMono, GeistSans } from "geist/font";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";

import CommonLayout from "~/components/common-layout";

import "~/styles/globals.css";

import { Toaster } from "~/components/ui/sonner";
import { api } from "~/utils/api";

const App = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) => {
  return (
    <SessionProvider session={session}>
      <style
        jsx
        global
      >{`
        :root {
          font-family: ${GeistSans.style.fontFamily};
        }

        .font-mono {
          font-family: ${GeistMono.style.fontFamily};
        }
      `}</style>
      <CommonLayout
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans`}
      >
        <Component {...pageProps} />
      </CommonLayout>
      <Toaster richColors />
    </SessionProvider>
  );
};

export default api.withTRPC(App);
