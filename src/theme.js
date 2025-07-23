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
        elevation: 0,
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          color: "#23263a", // dark navy for input text
          "::placeholder": {
            color: "#6c6f7e", // subtle grey for placeholder
            opacity: 1,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          color: "#23263a",
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: "#fff", // or theme.palette.background.paper
          color: "#23263a", // or theme.palette.text.primary
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: "#23263a", // or theme.palette.text.primary
          "&.Mui-selected": {
            backgroundColor: "#ffb400", // or theme.palette.secondary.light
            color: "#23263a",
          },
          "&.Mui-selected:hover": {
            backgroundColor: "#ffe082", // or theme.palette.accent.light
          },
        },
      },
    },
  },
});

export default theme;
