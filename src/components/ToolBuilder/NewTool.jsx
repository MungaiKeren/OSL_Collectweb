import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import "../../Styles/dataentry.scss";
import Loading from "../Util/Loading";
import Input from "../Util/Input";
import Select from "../Util/Select";
import Step2Questions from "./Step2Questions";
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Divider,
  useTheme,
  TextField,
  Select as MUISelect,
  MenuItem,
  Grid,
  Button as MUIButton,
  CircularProgress,
} from "@mui/material";

export default function NewTool(props) {
  const [active, setActive] = useState("Tool Details");
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(null);
  const [data, setData] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const e = localStorage.getItem("tsediting");
    setEditing(e);
  }, [active]);

  useEffect(() => {
    if (editing !== null) {
      setLoading(true);
      fetch(`/api/toolslist/${editing}`)
        .then((res) => {
          if (res.ok) return res.json();
          else throw Error("");
        })
        .then((data) => {
          setData(data);
          setLoading(false);
        })
        .catch((e) => {
          setLoading(false);
        });
    }
  }, [editing, active]);

  return (
    <Box
      sx={{
        p: { xs: 1, md: 3 },
        background: theme.palette.background.paper,
        minHeight: "100vh",
      }}
    >
      <Paper sx={{ p: 2, mb: 3 }} elevation={2}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography
            variant="h6"
            fontWeight={600}
            color={theme.palette.primary.main}
          >
            New Data Collection Tool
          </Typography>
          <Button
            variant="text"
            color="secondary"
            onClick={() => {
              window.location.href = "/buildtool";
            }}
            startIcon={<FontAwesomeIcon icon={faArrowRight} />}
          >
            Tools
          </Button>
        </Stack>
        <Divider sx={{ my: 2 }} />
        <Stack direction="row" mb={3}>
          <Button
            variant={active === "Tool Details" ? "contained" : "outlined"}
            color="secondary"
            onClick={() => setActive("Tool Details")}
            sx={{
              backgroundColor: "secondary",
              color: active === "Tool Details" ? "white" : "primary",
              fontWeight: 600,
              borderRadius: 0,
              width: "50%",
            }}
          >
            Tool Details
          </Button>
          <Button
            variant={
              active === "Data Collection Questions" ? "contained" : "outlined"
            }
            color="secondary"
            onClick={() => setActive("Data Collection Questions")}
            sx={{
              backgroundColor: "secondary",
              color:
                active === "Data Collection Questions" ? "white" : "primary",
              fontWeight: 600,
              borderRadius: 0,
              width: "50%",
            }}
          >
            Data Collection Questions
          </Button>
        </Stack>
        {active === "Tool Details" && (
          <Step1 data={data} setActive={setActive} editing={editing} />
        )}
        {active === "Data Collection Questions" && (
          <>
            {editing !== null ? (
              <Step2Questions
                data={data}
                setActive={setActive}
                editing={editing}
              />
            ) : (
              <Error />
            )}
          </>
        )}
        {loading && <Loading />}
      </Paper>
    </Box>
  );
}

const Item = (props) => {
  return (
    <div
      onClick={() => {
        props.setActive(props.txt);
      }}
      className="item"
    >
      <p className={props.txt === props.active ? "active" : ""}>{props.txt}</p>
    </div>
  );
};

const Step1 = (props) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");
  const [body, setBody] = useState({
    ToolName: props?.data?.ToolName || "",
    County: props?.data?.County || "",
    Description: props?.data?.Description || "",
    DataTableName: props?.data?.DataTableName || "",
    Status: props?.data?.Status || "Active",
  });
  const theme = useTheme();

  const createDocument = (e) => {
    setError("");
    let d = { ...body };
    const chck = Object.values(d);
    const cols = Object.keys(d);
    let valid = true;
    chck.map((item, i) => {
      if (item === null || item === "") {
        valid = false;
        if (!valid) return setError(`${cols[i]} is required!`);
      }
    });
    if (!valid) return;

    if (!isValidTableName(d.DataTableName))
      return setError("Invalid Data Table Name");

    setLoading(true);

    fetch("/api/toolslist/create", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(d),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else throw Error("");
      })
      .then((data) => {
        setLoading(false);
        if (data.success) {
          setError(data.success);
          localStorage.setItem("tsediting", data.ID);
          setTimeout(() => {
            props.setActive("Data Collection Questions");
          }, 2000);
        } else {
          setError(data.error);
        }
      })
      .catch((err) => {
        setLoading(false);
        setError("Oops! Something went wrong!");
      });
  };

  function isValidTableName(name) {
    // Regular expression to match valid PostgreSQL table names
    const tableNameRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
    return tableNameRegex.test(name);
  }

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label="Tool Name *"
          value={body.ToolName}
          onChange={(e) => setBody({ ...body, ToolName: e.target.value })}
          fullWidth
          required
          size="small"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label="County"
          value={body.County}
          onChange={(e) => setBody({ ...body, County: e.target.value })}
          select
          fullWidth
          size="small"
        >
          {[
            "",
            "Bungoma",
            "Busia",
            "Homabay",
            "Kakamega",
            "Kisumu",
            "Kisii",
            "Migori",
            "Siaya",
            "All",
          ].map((option, idx) => (
            <MenuItem key={idx} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TextField
          label="Tool Description *"
          value={body.Description}
          onChange={(e) => setBody({ ...body, Description: e.target.value })}
          fullWidth
          required
          size="small"
          multiline
          minRows={3}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label="Data Table Name (cannot have special characters) *"
          value={body.DataTableName}
          onChange={(e) => setBody({ ...body, DataTableName: e.target.value })}
          fullWidth
          required
          size="small"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label="Form Status"
          value={body.Status}
          onChange={(e) => setBody({ ...body, Status: e.target.value })}
          select
          fullWidth
          size="small"
        >
          {["Active", "Inactive"].map((option, idx) => (
            <MenuItem key={idx} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid size={{ xs: 12 }}>
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
      </Grid>
      <Grid
        size={{ xs: 12 }}
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <MUIButton
          onClick={createDocument}
          variant="contained"
          color="secondary"          
          sx={{
            fontWeight: 600,
            backgroundColor: "secondary",
            color: "white",
            px: 5
          }}
        >
          Submit
        </MUIButton>
      </Grid>
      {loading && (
        <Grid
          size={{ xs: 12 }}
          sx={{ display: "flex", justifyContent: "center", mt: 2 }}
        >
          <CircularProgress />
        </Grid>
      )}
    </Grid>
  );
};

const Error = (props) => {
  return (
    <div className="error">
      <p>This form is only available after filling the basic details</p>
    </div>
  );
};
