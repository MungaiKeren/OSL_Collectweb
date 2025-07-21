import {
  faBarsStaggered,
  faBoxes,
  faChartBar,
  faClipboard,
  faEdit,
  faGear,
  faHome,
  faMap,
  faSignOut,
  faTasks,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import { useTheme } from "@mui/material/styles";
import contactDev from "../../assets/imgs/ContactDev.png";

export default function Navigation(props) {
  const theme = useTheme();
  const pathname = window.location.pathname.split("/");

  const navItems = [
    {
      txt: "Home",
      url: "/",
      link: "",
      icon: faHome,
    },
    {
      txt: "Tool Builder",
      url: "/buildtool",
      link: "buildtool",
      icon: faClipboard,
    },
    {
      txt: "Users",
      url: "/users",
      link: "users",
      icon: faUsers,
    },
    {
      txt: "Settings",
      url: "/settings",
      link: "settings",
      icon: faGear,
    },
    {
      txt: "Signout",
      url: "/logout",
      link: "logout",
      icon: faSignOut,
    },
  ];

  const handleNav = (item) => {
    if (item.url === "/logout") {
      localStorage.removeItem("gdfhgfhtkngdfhgfhtkn");
      window.location.href = "/login";
    } else {
      window.location.href = item.url;
    }
  };

  return (
    <Box
      sx={{
        width: props.showing ? 225 : 64,
        minWidth: props.showing ? 225 : 64,
        bgcolor: theme.palette.background.paper,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        borderRight: `1px solid ${theme.palette.grey[200]}`,
        transition: "width 0.3s cubic-bezier(.4,2,.6,1)",
        zIndex: 1,
      }}
    >
      <Box
        sx={{
          py: 3,
          px: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: props.showing ? "flex-start" : "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: "primary.main",
            letterSpacing: 1,
            fontSize: props.showing ? "1.3rem" : 0,
            transition: "font-size 0.3s cubic-bezier(.4,2,.6,1)",
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          {props.showing && "OSL Collect"}
        </Typography>
      </Box>
      <Divider />
      <List sx={{ flex: 1, py: 1 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.txt}
            selected={
              item.link === pathname[1] ||
              (item.url === "/" && pathname[1] === "")
            }
            onClick={() => handleNav(item)}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              mx: 1,
              color:
                item.link === pathname[1] ||
                (item.url === "/" && pathname[1] === "")
                  ? "primary.main"
                  : theme.palette.grey[800],
              bgcolor:
                item.link === pathname[1] ||
                (item.url === "/" && pathname[1] === "")
                  ? theme.palette.action.selected
                  : "transparent",
              "&:hover": {
                bgcolor: theme.palette.action.hover,
              },
              minHeight: 48,
              justifyContent: props.showing ? "flex-start" : "center",
              px: props.showing ? 2 : 1,
              transition: "all 0.2s cubic-bezier(.4,2,.6,1)",
            }}
          >
            <ListItemIcon
              sx={{
                color:
                  item.link === pathname[1] ||
                  (item.url === "/" && pathname[1] === "")
                    ? "primary.main"
                    : theme.palette.grey[700],
                minWidth: 0,
                mr: props.showing ? 2 : 0,
                justifyContent: "center",
              }}
            >
              <FontAwesomeIcon icon={item.icon} />
            </ListItemIcon>
            {props.showing && <ListItemText primary={item.txt} />}
          </ListItemButton>
        ))}
      </List>
      <Divider sx={{ my: 1 }} />
      {props.showing && (
        <Box sx={{ px: 2, pb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Avatar
              src={contactDev}
              alt="Contact Developer"
              sx={{ width: 36, height: 36, mr: 1 }}
            />
            <Box>
              <Typography variant="caption" color="text.secondary">
                Developed by
              </Typography>
              <Typography variant="body2" color="primary.main" fontWeight={600}>
                Oakar Services
              </Typography>
              <Typography
                variant="caption"
                color="accent.main"
                sx={{ fontWeight: 600, cursor: "pointer" }}
              >
                Contact Developer
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
