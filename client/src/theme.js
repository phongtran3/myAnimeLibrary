import { deepPurple, grey } from "@mui/material/colors";

export const colorTokens = {
  grey: {
    0: "#FFFFFF",
    10: "#F6F6F6",
    50: "#F0F0F0",
    100: "#E0E0E0",
    200: "#C2C2C2",
    300: "#A3A3A3",
    400: "#858585",
    500: "#666666",
    600: "#4D4D4D",
    700: "#333333",
    800: "#1A1A1A",
    900: "#0A0A0A",
    1000: "#000000",
  },
};

//mui theme setting
export const themeSettings = (mode) => {
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            //Palette for dark mode
            primary: {
              dark: deepPurple[200],
              main: deepPurple[500],
              light: deepPurple[800],
            },
            neutral: {
              dark: grey[100],
              main: grey[200],
              mediumMain: grey[300],
              medium: grey[400],
              light: grey[700],
            },
            background: {
              default: grey[900],
              alt: grey[800],
            },
          }
        : {
            // palette values for light mode
            primary: {
              extraDark: deepPurple[900],
              dark: deepPurple[800],
              main: deepPurple[500],
              light: deepPurple[200],
            },
            neutral: {
              dark: grey[800],
              main: grey[500],
              mediumMain: grey[400],
              medium: grey[300],
              light: grey[100],
            },
            background: {
              default: grey[100],
              alt: grey[50],
            },
          }),
    },
  };
};
