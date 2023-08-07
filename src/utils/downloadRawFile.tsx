export const downloadRawFile = (code: string) => {
  const a = document.createElement("a");
  const url = URL.createObjectURL(new Blob([code], { type: "text/plain" }));

  a.href = url;
  a.download = "raw.scl";
  a.click();

  URL.revokeObjectURL(url);
};
