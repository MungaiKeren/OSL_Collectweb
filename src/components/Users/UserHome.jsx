import React, { useState } from "react";
import PortalUsers from "./PortalUsers";
import { Box, Button, ButtonGroup } from "@mui/material";

export default function UserHome(props) {
  const [active, setActive] = useState("System Users");

  return (
    <Box sx={{ p: 2 }}>
      <Box>
        <ButtonGroup variant="outlined">
          <Button
            variant={active === "System Users" ? "contained" : "outlined"}
            onClick={() => setActive("System Users")}
            color="secondary"
            sx={{
              backgroundColor: "secondary",
              color: "#fff",
              "&:hover": { backgroundColor: "secondary.dark" },
            }}
          >
            System Users
          </Button>
        </ButtonGroup>
      </Box>
      {active === "System Users" && <PortalUsers role={props.role} />}
    </Box>
  );
}