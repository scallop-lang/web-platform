import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { IBM_Plex_Mono, Inter } from "next/font/google";

import Layout from "~/components/layout";
import ThemeProvider from "~/components/theme-provider";
import { Toaster } from "~/components/ui/toaster";

import "~/styles/globals.css";

import { api } from "~/utils/api";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  preload: true,
});

const plexMono = IBM_Plex_Mono({
  weight: ["400", "700", "100", "200", "300", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-plex-mono",
  preload: false,
});

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
            font-family: ${inter.style.fontFamily};
          }

          .font-mono {
            font-family: ${plexMono.style.fontFamily};
          }
        `}</style>
        <div className={`${inter.variable} ${plexMono.variable} font-sans`}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
          <Toaster />
        </div>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(App);
