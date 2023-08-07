export function download(content: string) {
  const a = document.createElement("a");
  const url = URL.createObjectURL(new Blob([content], { type: "text/plain" }));

  a.href = url;
  a.download = "raw.scl";
  a.click();

  URL.revokeObjectURL(url);
}
