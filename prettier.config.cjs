/** @type {import("prettier").Config & import("@ianvs/prettier-plugin-sort-imports").PrettierConfig}} */
const config = {
  plugins: [
    require.resolve("prettier-plugin-tailwindcss"),
    require.resolve("@ianvs/prettier-plugin-sort-imports"),
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

module.exports = config;
