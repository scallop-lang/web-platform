import { type AppType } from "next/app";
import { IBM_Plex_Mono, Inter } from "next/font/google";
import "~/styles/globals.css";
import { api } from "~/utils/api";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const plexMono = IBM_Plex_Mono({
  weight: ["400", "700", "100", "200", "300", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-plex-mono",
  preload: false,
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <style
        jsx
        global
      >{`
        html {
          font-family: ${inter.style.fontFamily};
        }
      `}</style>
      <div className={`${inter.variable} ${plexMono.variable} font-sans`}>
        <Component {...pageProps} />
      </div>
    </>
  );
};

export default api.withTRPC(MyApp);
