import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";
import Header from "../components/Util/Header";
import Navigation from "../components/Util/Navigation";
import Settings from "../components/Settings/Settings";
import ToolBuilder from "../components/ToolBuilder/ToolBuilder";
import NewTool from "../components/ToolBuilder/NewTool";
import UpdateTool from "../components/ToolBuilder/UpdateTool";
import UserHome from "../components/Users/UserHome";
import TBData from "../components/ToolBuilder/TBData";
import { jwtDecode } from "jwt-decode";

export default function Home(props) {
  const theme = useTheme();
  const [showing, setShowing] = useState(true);
  const pathname = window.location.pathname.split("/");
  const [shownavigation, setShowNavigation] = useState(false);
  const [role, setRole] = useState();

  const handleResize = () => {
    if (window.innerWidth < 768) {
      setShowing(false);
    } else {
      setShowing(true);
    }
  };

  useEffect(() => {
    handleResize();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("gdfhgfhtkngdfhgfhtkn");
    if (token) {
      let decoded = jwtDecode(token);
      setRole(decoded.Role);
    }
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: theme.palette.background.default,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ display: "flex", flex: 1, minHeight: 0 }}>
        {/* Navigation Panel */}
        <Box
          sx={{
            width: showing ? 225 : 64,
            minWidth: showing ? 225 : 64,
            bgcolor: theme.palette.background.paper,
            borderRight: `1px solid ${theme.palette.grey[200]}`,
            transition: "width 0.3s cubic-bezier(.4,2,.6,1)",
            display: "flex",
            flexDirection: "column",
            zIndex: 1,
          }}
        >
          <Navigation
            showing={showing}
            setShowing={setShowing}
            shownavigation={shownavigation}
            role={role}
          />
        </Box>
        {/* Main Content Panel */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            bgcolor: "rgb(245, 246, 250)",
          }}
        >
          <Paper
            elevation={0}
            sx={{
              borderBottom: `1px solid ${theme.palette.grey[200]}`,
              borderRadius: 0,
              bgcolor: theme.palette.background.paper,
              px: { xs: 1, sm: 3 },
              py: 1,
            }}
          >
            <Header
              showing={showing}
              setShowing={setShowing}
              setShowNavigation={setShowNavigation}
              shownavigation={setShowNavigation}
            />
          </Paper>
          <Box sx={{ flex: 1, p: { xs: 1, sm: 3 }, overflow: "auto" }}>
            {pathname[1] === "buildtool" && pathname.length === 2 && (
              <ToolBuilder />
            )}
            {pathname[1] === "buildtool" && pathname[2] === "new" && (
              <NewTool />
            )}
            {pathname[1] === "buildtool" && pathname[2] === "update" && (
              <UpdateTool />
            )}
            {pathname[1] === "buildtool" && pathname[2] === "data" && (
              <TBData />
            )}
            {pathname[1] === "users" && <UserHome role={role} />}
            {pathname[1] === "settings" && <Settings />}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
