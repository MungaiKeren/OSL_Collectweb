import { Paper, Box, Avatar, Typography, useTheme } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

export default function UserBox(props) {
  const [init, setInit] = useState("");
  const theme = useTheme();
  useEffect(() => {
    const nm = props.item.Name.split(" ");
    if (nm.length > 1) {
      setInit(nm[0].substring(0, 1) + nm[1].substring(0, 1));
    } else setInit(nm[0].substring(0, 1));
  }, []);
  const isActive = props.userID === props.item.UserID;
  return (
    <Paper
      elevation={isActive ? 6 : 1}
      onClick={() => {
        props.setUserID(props?.item?.UserID);
        props?.selected?.current.scrollIntoView({ behavior: "smooth" });
      }}
      sx={{
        display: "flex",
        alignItems: "center",
        p: 2,
        mb: 1,
        borderRadius: 3,
        cursor: "pointer",
        border: isActive
          ? `2px solid ${theme.palette.secondary.main}`
          : `1px solid ${theme.palette.grey[200]}`,
        transition: "box-shadow 0.2s, border 0.2s, background 0.2s",
        "&:hover": {
          boxShadow: 6,
          background: theme.palette.grey[100],
        },
      }}
    >
      <Avatar
        sx={{
          bgcolor: props.item.Status
            ? theme.palette.primary.main
            : theme.palette.warning.main,
          color: "#fff",
          width: 48,
          height: 48,
          fontWeight: 700,
          fontSize: 22,
          mr: 2,
        }}
      >
        {init}
      </Avatar>
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="subtitle1"
          fontWeight={600}
          color={theme.palette.primary.main}
        >
          {props?.item?.Name}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FontAwesomeIcon
            icon={faEnvelope}
            color={theme.palette.primary.main}
            style={{ marginRight: 6 }}
          />
          <Typography
            variant="body2"
            color={theme.palette.text.secondary}
            sx={{ mr: 2 }}
          >
            {props?.item?.Email}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FontAwesomeIcon
            icon={faPhone}
            color={theme.palette.primary.main}
            style={{ marginRight: 6 }}
          />
          <Typography variant="body2" color={theme.palette.text.secondary}>
            {props?.item?.Phone}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}
