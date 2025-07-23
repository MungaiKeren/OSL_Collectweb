import {
  faBars,
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
  faTimes,
  faUserCircle,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import Divider from "@mui/material/Divider";

export default function Header(props) {
  const [nav, setNav] = useState(false);
  const [details, setDetails] = useState("");
  const [login, setLogin] = useState("");
  const [logout, setLogout] = useState("");
  const theme = useTheme();
  useEffect(() => {
    const token = localStorage.getItem("gdfhgfhtkngdfhgfhtkn");

    if (token) {
      try {
        let decoded = jwtDecode(token);
        if (Date.now() >= decoded.exp * 1000) {
          window.location.href = "/login";
        } else {
          const lg = convertTime(decoded?.iat).split("GMT")[0];
          const lo = convertTime(decoded?.exp).split("GMT")[0];
          setDetails(decoded?.Name);
          setLogin(lg.substring(lg.length - 9, lg.length));
          setLogout(lo.substring(lo.length - 9, lo.length));
        }
      } catch (error) {
        window.location.href = "/login";
      }
    } else {
      window.location.href = "/login";
    }
  }, []);

  function convertTime(dt) {
    const date = new Date(dt * 1000);
    return date.toString();
  }

  return (
    <>
      <AppBar
        position="static"
        sx={{
          background: theme.palette.background.paper,
          color: theme.palette.secondary.dark,
          boxShadow: "none",
        }}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="user"
            sx={{ mr: 2 }}
          >
            <FontAwesomeIcon icon={faUserCircle} />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: 500 }}
          >
            {details}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography
              variant="body2"
              sx={{ color: theme.palette.secondary.dark }}
            >
              <b>Login Time:</b> {login}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: theme.palette.secondary.dark }}
            >
              <b>Logout Time:</b> {logout}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      {nav && <MobileHeader setNav={setNav} />}
    </>
  );
}

const MobileHeader = (props) => {
  const theme = useTheme();
  const pathname = window.location.pathname.split("/");

  return (
    <Box
      sx={{
        background: theme.palette.background.paper,
        color: theme.palette.secondary.dark,
        minHeight: "100vh",
        p: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <IconButton
          onClick={() => {
            props.setNav(false);
          }}
          sx={{ color: theme.palette.text.primary }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1, ml: 2, fontWeight: 600 }}>
          OSL Collect
        </Typography>
      </Box>
      <Divider sx={{ mb: 2, background: theme.palette.grey[300] }} />
      <Item
        txt="Home"
        url="/"
        active={pathname[1]}
        link=""
        icon={faHome}
        options={[]}
        showing={props.showing}
      />
      <Item
        txt="Indicators"
        url="/indicators"
        link="indicators"
        active={pathname[1]}
        icon={faChartBar}
        options={[]}
        showing={props.showing}
      />
      <Item
        url="/reports"
        link="reports"
        txt="Reports"
        active={pathname[1]}
        icon={faBoxes}
        options={[]}
        showing={props.showing}
      />
      <Item
        url="/mel"
        txt="MEL"
        link="mel"
        active={pathname[1]}
        icon={faClipboard}
        code="&#xf0ea;"
        options={[]}
        showing={props.showing}
      />
      <Item
        url="/gis"
        txt="GIS"
        link="gis"
        active={pathname[1]}
        icon={faMap}
        options={[]}
        showing={props.showing}
      />
      <Item
        txt="Counties"
        url="/counties"
        link="counties"
        active={pathname[1]}
        icon={faBarsStaggered}
        options={[]}
        showing={props.showing}
      />
      <Item
        url="/dataentry"
        txt="Data Entry"
        link="dataentry"
        active={pathname[1]}
        icon={faEdit}
        options={[]}
        showing={props.showing}
      />
      <Item
        url="/buildtool"
        txt="Tool Builder"
        link="buildtool"
        active={pathname[1]}
        icon={faClipboard}
        code="&#xf0ea;"
        options={[]}
        showing={props.showing}
      />
      <Item
        url="/wp"
        txt="Workplans"
        link="wp"
        active={pathname[1]}
        icon={faTasks}
        options={[]}
        showing={props.showing}
      />
      <Item
        txt="Users"
        url="/users"
        link="users"
        active={pathname[1]}
        icon={faUsers}
        options={[]}
        showing={props.showing}
      />
      <Item
        txt="Settings"
        url="/settings"
        link="settings"
        active={pathname[1]}
        icon={faGear}
        code="&#xf013;"
        options={[]}
        showing={props.showing}
      />
      <Item
        txt="Signout"
        active={pathname[1]}
        icon={faSignOut}
        url="/logout"
        options={[]}
        showing={props.showing}
      />
    </Box>
  );
};

const Item = (params) => {
  return (
    <div
      onClick={() => {
        if (params.options?.length === 0) {
          window.location.href = params.url;
        }
        if (params.url === "/logout") {
          localStorage.removeItem("gdfhgfhtkngdfhgfhtkn");
          window.location.href = "/login";
        }
      }}
      onMouseEnter={() => {}}
      className={params.link === params.active ? "active" : "item"}
    >
      <FontAwesomeIcon icon={params.icon} />
      <p>{params.txt}</p>
    </div>
  );
};
