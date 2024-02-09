import { Analytics } from "@vercel/analytics/react";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";

import Header from "~/components/header/header";
import { Toaster } from "~/components/ui/sonner";

import "~/styles/globals.css";

import { api } from "~/utils/api";

const App = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) => {
  return (
    <>
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

      <SessionProvider session={session}>
        <Header />
        <Component {...pageProps} />
      </SessionProvider>

      <Analytics />
      <Toaster
        richColors
        closeButton
        toastOptions={{
          style: {
            "--font-geist-sans": GeistSans.style.fontFamily,
          } as React.CSSProperties,
          className: "font-sans",
        }}
      />
    </>
  );
};

export default api.withTRPC(App);
