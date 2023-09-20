import { createTheme } from "@uiw/codemirror-themes";

export const ScallopLight = createTheme({
  theme: "light",
  settings: {
    background: "#ffffff",
  },
  styles: [],
});

export const ScallopDark = createTheme({
  theme: "dark",
  settings: {
    background: "#2E3235",
    foreground: "#DDDDDD",
    caret: "#DDDDDD",
    selection: "#202325",
    selectionMatch: "#202325",
    gutterBackground: "#292d30",
    gutterForeground: "#808080",
    gutterBorder: "1px solid #ffffff10",
    lineHighlight: "#B9D2FF30",
  },
  styles: [],
});
