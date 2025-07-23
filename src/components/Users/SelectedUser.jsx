import React, { useState, useRef, useEffect } from "react";
import Confirm from "../Util/Confirm";
import { Paper, Typography, Stack, Button, useTheme } from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  MenuItem,
  Button as MUIButton,
  CircularProgress,
  Divider,
} from "@mui/material";

function formatDate(inputDate) {
  const date = new Date(inputDate);

  // Format the day with the appropriate suffix
  const day = date.getDate();
  const dayWithSuffix = getDayWithSuffix(day);

  const options = { year: "numeric", month: "short" };
  const formattedDate = date.toLocaleDateString("en-US", options);

  return `${dayWithSuffix} ${formattedDate}`;
}

function getDayWithSuffix(day) {
  if (day >= 11 && day <= 13) {
    return `${day}th`;
  }

  switch (day % 10) {
    case 1:
      return `${day}st`;
    case 2:
      return `${day}nd`;
    case 3:
      return `${day}rd`;
    default:
      return `${day}th`;
  }
}

export default function SelectedUser(props) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const theme = useTheme();

  const openConfirm = () => {
    setShowConfirm(true);
  };

  const closeConfirm = () => {
    setShowConfirm(false);
  };

  function updateUser(status) {
    props.setLoading(true);
    fetch(`/api/${props.url}/${props?.userDetails?.UserID}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ Status: !status }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else throw Error("");
      })
      .then((data) => {
        props.setLoading(false);
        props.setRefresh(!props.refresh);

        window.location.reload();
      })
      .catch((err) => {
        props.setLoading(false);
      });
  }

  function deleteUser() {
    props.setLoading(true);
    fetch(`/api/${props.url}/${props?.userDetails?.UserID}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else throw Error("");
      })
      .then((data) => {
        props.setLoading(false);
        props.setRefresh(!props.refresh);

        window.location.reload();
      })
      .catch((err) => {
        props.setLoading(false);
      });
  }

  return (
    <Paper
      elevation={2}
      sx={{ p: 2, background: theme.palette.background.paper }}
    >
      <Stack spacing={1.2}>
        <Typography
          variant="h6"
          fontWeight={600}
          color={theme.palette.primary.main}
        >
          {props?.userDetails?.Name}
        </Typography>
        <Typography variant="body2" color={theme.palette.text.secondary}>
          <b>Email:</b> {props?.userDetails?.Email}
        </Typography>
        <Typography variant="body2" color={theme.palette.text.secondary}>
          <b>Phone:</b> {props?.userDetails?.Phone}
        </Typography>
        <Typography variant="body2" color={theme.palette.text.secondary}>
          <b>Position:</b> {props?.userDetails?.Position}
        </Typography>
        <Typography variant="body2" color={theme.palette.text.secondary}>
          <b>County:</b> {props?.userDetails?.County}
        </Typography>
        <Typography variant="body2" color={theme.palette.text.secondary}>
          <b>Level:</b> {props?.userDetails?.Level}
        </Typography>
        <Typography variant="body2" color={theme.palette.text.secondary}>
          <b>Role:</b> {props?.userDetails?.Role}
        </Typography>
        <Typography
          variant="body2"
          color={
            props?.userDetails?.Status
              ? theme.palette.success.main
              : theme.palette.error.main
          }
        >
          <b>Status:</b> {props?.userDetails?.Status ? "Active" : "Disabled"}
        </Typography>
        <Typography variant="body2" color={theme.palette.text.secondary}>
          <b>Date Created:</b> {formatDate(props?.userDetails?.createdAt)}
        </Typography>
        <Typography variant="body2" color={theme.palette.text.secondary}>
          <b>Date Updated:</b> {formatDate(props?.userDetails?.updatedAt)}
        </Typography>
        {props.role !== "Regular User" && props.role !== "Guest" && (
          <Stack direction="row" spacing={2} mt={2}>
            <Button
              variant="contained"
              size="small"
              color={props?.userDetails?.Status ? "warning" : "success"}
              onClick={() => {
                updateUser(props?.userDetails?.Status);
              }}
            >
              {props?.userDetails?.Status ? "Deactivate" : "Activate"}
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setClicked(true)}
              size="small"
            >
              Update
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => openConfirm()}
              size="small"
            >
              Delete
            </Button>
          </Stack>
        )}
      </Stack>
      {showConfirm && (
        <Confirm
          closeConfirm={closeConfirm}
          deleteFunction={() => {
            deleteUser();
          }}
        />
      )}
      {clicked && (
        <UpdatePopUp
          setClicked={setClicked}
          setRefresh={setRefresh}
          refresh={refresh}
          userId={props?.userDetails?.UserID}
        />
      )}
    </Paper>
  );
}

const UpdatePopUp = (props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState("");
  const theme = useTheme();

  useEffect(() => {
    fetch(`/api/auth/${props?.userId}`)
      .then((res) => {
        if (res.ok) return res.json();
        else throw Error("");
      })
      .then((data) => {
        setData(data);
      })
      .catch((err) => {
        // handle error
      });
  }, []);

  const pos = [
    "",
    "Rural Water Specialist",
    "Governance & Urban Water Specialist",
    "WKWP Staff",
    "Component Lead",
    "IT Specialist",
    "MEL Specialist",
    "WRM Officer",
    "Communication Manager",
    "MEL Lead",
    "DCOP",
    "COP",
    "USAID Staff",
    "Stakeholder",
    "Field Officer",
  ];
  const cnty = [
    "",
    "Bungoma",
    "Busia",
    "Homa Bay",
    "Kakamega",
    "Kisii",
    "Kisumu",
    "Migori",
    "Siaya",
    "All",
  ];
  const fname = useRef();
  const sname = useRef();
  const email = useRef();
  const phone = useRef();
  const position = useRef();
  const role = useRef();
  const county = useRef();
  const level = useRef();

  function titleCase(str) {
    let splitStr = str.toLowerCase().split(" ");
    for (let i = 0; i < splitStr.length; i++) {
      splitStr[i] =
        splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(" ");
  }

  const UpdateUser = () => {
    const body = {
      Name:
        titleCase(fname.current.value.trim()) +
        " " +
        titleCase(sname.current.value.trim()),
      Phone: phone.current.value,
      Email: email.current.value.toLowerCase().trim(),
      Position: position.current.value,
      County: county.current.value,
      Level: level.current.value,
      Role: role.current.value,
    };

    setError("");

    const validateForm = () => {
      let result = true;
      if (!validateEmail(body.Email)) {
        result = false;
        setError("Please Enter a valid email address!");
        setLoading(false);
        return result;
      }
      if (!body.Phone || body.Phone.length !== 10) {
        result = false;
        setError("Enter a valid phone number");
        setLoading(false);
        return result;
      }
      if (fname.current.value === "" || sname.current.value === "") {
        result = false;
        setError("Two names are required!");
        setLoading(false);
        return result;
      }
      return result;
    };

    if (validateForm()) {
      setLoading(true);
      fetch(`/api/auth/${props?.userId}`, {
        method: "put",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
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
            setTimeout(() => {
              props.setClicked(false);
              props.setRefresh(!props.refresh);
            }, 2000);
          } else {
            setError(data.error);
          }
        })
        .catch((err) => {
          setLoading(false);
        });
    }
  };

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  return (
    <Dialog
      open
      onClose={() => props.setClicked(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ color: theme.palette.primary.light, fontWeight: 600 }}>
        Update User Details
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              inputRef={fname}
              label="First Name *"
              fullWidth
              required
              size="small"
              defaultValue={data?.Name?.split(" ")[0] || ""}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              inputRef={sname}
              label="Surname *"
              fullWidth
              required
              size="small"
              defaultValue={data?.Name?.split(" ").slice(1).join(" ") || ""}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              inputRef={email}
              label="Email *"
              type="email"
              fullWidth
              required
              size="small"
              defaultValue={data?.Email || ""}
              disabled
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              inputRef={phone}
              label="Phone *"
              type="number"
              fullWidth
              required
              size="small"
              defaultValue={data?.Phone || ""}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              inputRef={position}
              label="Position *"
              select
              fullWidth
              required
              size="small"
              defaultValue={data?.Position || ""}
            >
              {pos.map((option, idx) => (
                <MenuItem key={idx} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              inputRef={county}
              label="County *"
              select
              fullWidth
              required
              size="small"
              defaultValue={data?.County || ""}
            >
              {cnty.map((option, idx) => (
                <MenuItem key={idx} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              inputRef={level}
              label="Level *"
              select
              fullWidth
              required
              size="small"
              defaultValue={data?.Level || ""}
            >
              {["", "Full Access", "Dashboard", "Mobile"].map((option, idx) => (
                <MenuItem key={idx} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              inputRef={role}
              label="Role *"
              select
              fullWidth
              required
              size="small"
              defaultValue={data?.Role || ""}
            >
              {["", "Regular User", "Guest", "Admin", "Data Collector"].map(
                (option, idx) => (
                  <MenuItem key={idx} value={option}>
                    {option}
                  </MenuItem>
                )
              )}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12 }}>
            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}
          </Grid>
        </Grid>
        {loading && (
          <Grid container justifyContent="center" sx={{ mt: 2 }}>
            <CircularProgress />
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <MUIButton onClick={() => props.setClicked(false)} color="inherit">
          Cancel
        </MUIButton>
        <MUIButton onClick={UpdateUser} variant="contained" color="secondary">
          Submit
        </MUIButton>
      </DialogActions>
    </Dialog>
  );
};
