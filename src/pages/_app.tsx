import { type AppType } from "next/app";
import { IBM_Plex_Mono, Inter } from "next/font/google";
import ThemeProvider from "~/components/theme-provider";
import { Toaster } from "~/components/ui/toaster";
import "~/styles/globals.css";
import { api } from "~/utils/api";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const plexMono = IBM_Plex_Mono({
  weight: ["400", "700", "100", "200", "300", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-plex-mono",
});

const App: AppType = ({ Component, pageProps }) => {
  return (
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
        <Component {...pageProps} />
        <Toaster />
      </div>
    </ThemeProvider>
  );
};

export default api.withTRPC(App);
