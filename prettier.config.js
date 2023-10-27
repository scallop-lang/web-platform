/** @type {import("prettier").Config & import("@ianvs/prettier-plugin-sort-imports").PrettierConfig}} */
const config = {
  plugins: [
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
  singleAttributePerLine: true,
  importOrder: [
    "<BUILT_IN_MODULES>",
    "",
    "<THIRD_PARTY_MODULES>",
    "",
    "~/",
    "",
    "^[.]",
  ],
};

export default config;
