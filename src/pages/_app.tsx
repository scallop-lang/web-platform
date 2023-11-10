import { GeistMono, GeistSans } from "geist/font";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";

import CommonLayout from "~/components/common-layout";
import ThemeProvider from "~/components/theme-provider";
import { Toaster } from "~/components/ui/toaster";

import "~/styles/globals.css";

import { api } from "~/utils/api";

const App = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) => {
  return (
    <SessionProvider session={session}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
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
          <Toaster />
        </CommonLayout>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(App);
