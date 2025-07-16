import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1a2236",
      light: "#273053",
      dark: "#111627",
    },
    secondary: {
      main: "#ff6f3c",
      light: "#ff8c61",
      dark: "#c43d00",
    },
    accent: {
      main: "#ffb400",
      light: "#ffe082",
      dark: "#b28704",
    },
    background: {
      default: "#181a20",
      paper: "#ffffff",
    },
    text: {
      primary: "#f5f6fa",
      secondary: "#b0b3c6",
    },
    grey: {
      100: "#f4f4f6",
      200: "#e0e0e3",
      300: "#b0b3c6",
      400: "#6c6f7e",
      500: "#23263a",
    },
    // You can add other color categories as needed
  },
  typography: {
    fontFamily: "'IBM Plex Sans', 'Roboto', Arial, sans-serif",
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0px 4px 16px #60606010",
          borderRadius: "16px",
          padding: "16px",
        },
      },
      defaultProps: {
        // optional defaults
        elevation: 0, // disable default shadow if custom one is used
      },
    },
  },
});

export default theme;
