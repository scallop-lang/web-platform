import { type AppType } from "next/app";
import { Inter } from "next/font/google";
import "~/styles/globals.css";
import { api } from "~/utils/api";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className={`${inter.variable} font-sans`}>
      <Component {...pageProps} />
    </div>
  );
};

export default api.withTRPC(MyApp);
