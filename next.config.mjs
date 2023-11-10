/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  trailingSlash: false,

  // eslint-disable-next-line @typescript-eslint/require-await
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/play",
        permanent: false,
      },
    ];
  },

  // see https://github.com/vercel/geist-font/issues/13#issuecomment-1798598309
  transpilePackages: ["geist"],
};

export default config;
