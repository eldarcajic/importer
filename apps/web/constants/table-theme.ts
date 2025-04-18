import { themeQuartz } from "ag-grid-community";

export const darkTheme = themeQuartz.withParams({
  accentColor: "#806f63",
  backgroundColor: "#151515",
  browserColorScheme: "dark",
  chromeBackgroundColor: {
    ref: "foregroundColor",
    mix: 0.07,
    onto: "backgroundColor",
  },
  foregroundColor: "#FFF",
  headerBackgroundColor: "#151515",
  headerFontSize: 14,
  oddRowBackgroundColor: "#78716c33",
});
