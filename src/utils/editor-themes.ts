import { createTheme } from "@uiw/codemirror-themes";

export const ScallopLight = createTheme({
  theme: "light",
  settings: {
    background: "#ffffff",
    foreground: "#2e3440",
    caret: "#3b4252",
    selection: "#eceff4",
    selectionMatch: "#e5e9f0",
    gutterBackground: "#eceff4",
    gutterForeground: "#2e3440",
    gutterBorder: "none",
    lineHighlight: "#eceff4",
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
    selectionMatch: "#B9D2FF30",
    gutterBackground: "#292d30",
    gutterForeground: "#808080",
    gutterBorder: "1px solid #ffffff10",
    lineHighlight: "#B9D2FF30",
  },
  styles: [],
});
