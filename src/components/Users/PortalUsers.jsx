import {
  faSearch,
  faTimes,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import "../../Styles/users.scss";
// import Button from "../Util/Button";
import Input from "../Util/Input";
import Loading from "../Util/Loading";
import Pagination from "../Util/Pagination";
import Select from "../Util/Select";
import SelectedUser from "./SelectedUser";
import UserBox from "./UserBox";
import {
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Paper,
  MenuItem,
} from "@mui/material";

export default function PortalUsers(props) {
  const [offset, setOffset] = useState(0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(null);
  const [userID, setUserID] = useState(null);
  const [clicked, setClicked] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [userDetails, setUserDetails] = useState();
  const selected = useRef();

  useEffect(() => {
    setLoading(true);
    fetch(`/api/auth/paginated/${offset * 12}`, {
      method: "get",
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((data) => {
        setLoading(false);

        setData(data);
        if (data.data.length > 0) {
          setUserID(data.data[0].UserID);
        }
      })
      .catch((error) => {
        setLoading(false);
      });
  }, [refresh, offset]);

  useEffect(() => {
    selectedUser();
  }, [userID]);

  const selectedUser = () => {
    setLoading(true);
    fetch(`/api/auth/${userID}`, {
      method: "get",
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((data) => {
        setLoading(false);
        setUserDetails(data);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  function quickSearch(value) {
    setData(null);
    setLoading(true);
    fetch(`/api/auth/quicksearch/${value}`, {
      method: "get",
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((data) => {
        setLoading(false);
        setData(data);
        if (data.data.length > 0) {
          setUserID(data.data[0].UserID);
        }
      })
      .catch((error) => {
        setLoading(false);
      });
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography
            variant="h6"
            sx={{ mb: 1, color: "primary.light", fontWeight: 600 }}
          >
            MEL-MIS Users
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 1,
            }}
          >
            <TextField
              size="small"
              variant="outlined"
              placeholder="Name..."
              onChange={(e) => {
                const v = e.target.value;
                if (v !== "") {
                  quickSearch(v);
                } else {
                  setRefresh(!refresh);
                }
              }}
              sx={{ width: 250 }}
              InputProps={{
                endAdornment: (
                  <IconButton size="small">
                    <FontAwesomeIcon icon={faSearch} />
                  </IconButton>
                ),
              }}
            />

            {props.role !== "Regular User" && props.role !== "Guest" && (
              <Button
                variant="contained"
                color="secondary"
                startIcon={<FontAwesomeIcon icon={faUserPlus} />}
                onClick={() => setClicked(true)}
                sx={{
                  ml: 2,
                  backgroundColor: "secondary",
                  color: "#fff",
                  "&:hover": { backgroundColor: "secondary.dark" },
                }}
              >
                New User
              </Button>
            )}
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Box sx={{ minHeight: 400 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {data && data?.data?.length > 0 ? (
                  data?.data?.map((item, index) => (
                    <UserBox
                      key={index}
                      item={item}
                      userID={userID}
                      setUserID={setUserID}
                      selected={isMobile ? selected : null}
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No users found.
                  </Typography>
                )}
              </Box>
              {data && (
                <Box sx={{ mt: 2 }}>
                  <Pagination
                    totalItems={data?.total}
                    currentPage={offset}
                    onPageChange={(v) => {
                      setOffset(v);
                    }}
                  />
                </Box>
              )}
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 2, minHeight: 400 }} ref={selected}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                User Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {userDetails ? (
                <SelectedUser
                  setLoading={setLoading}
                  userDetails={userDetails}
                  setRefresh={setRefresh}
                  refresh={refresh}
                  url="auth"
                  role={props.role}
                />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Click on a user to see their details
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
        {loading && <Loading />}
      </Paper>
      {clicked && (
        <Popup
          setClicked={setClicked}
          setRefresh={setRefresh}
          refresh={refresh}
        />
      )}
    </Box>
  );
}

const Popup = (props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
  const password = useRef();
  const cpassword = useRef();
  const [subcounties, setSubCounties] = useState([]);
  const [selectedSC, setSelectedSC] = useState(null);
  const [wards, setWards] = useState([]);
  const [markets, setMarkets] = useState([]);

  function titleCase(str) {
    let splitStr = str.toLowerCase().split(" ");
    for (let i = 0; i < splitStr.length; i++) {
      splitStr[i] =
        splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(" ");
  }

  const createUser = () => {
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
      Password: password.current.value,
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
      if (
        !validatePassword(body.Password) ||
        !validatePassword(cpassword.current.value)
      ) {
        result = false;
        setError("Password must be at least 6 characters!");
        setLoading(false);
        return result;
      }
      if (body.Password !== cpassword.current.value) {
        result = false;
        setError("Passwords do not match!!!");
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
      fetch(`/api/auth/register`, {
        method: "POST",
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
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };
  const validatePassword = (password) => {
    return password.length >= 6;
  };

  return (
    <Dialog
      open
      onClose={() => props.setClicked(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle
        sx={{ color: "primary.light", fontWeight: 600 }}
      >
        New User
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Box
          component="form"
          onSubmit={(e) => e.preventDefault()}
          sx={{ mt: 1 }}
        >
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                inputRef={fname}
                label="First Name *"
                fullWidth
                required
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                inputRef={sname}
                label="Surname *"
                fullWidth
                required
                size="small"
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
                defaultValue=""
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
                defaultValue=""
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
                defaultValue=""
              >
                {["", "Full Access", "Dashboard", "Mobile"].map(
                  (option, idx) => (
                    <MenuItem key={idx} value={option}>
                      {option}
                    </MenuItem>
                  )
                )}
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
                defaultValue=""
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
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                inputRef={password}
                label="Password *"
                type="password"
                fullWidth
                required
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                inputRef={cpassword}
                label="Confirm Password *"
                type="password"
                fullWidth
                required
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              {error && (
                <Typography color="error" variant="body2">
                  {error}
                </Typography>
              )}
            </Grid>
          </Grid>
        </Box>
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <CircularProgress />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.setClicked(false)} color="inherit">
          Cancel
        </Button>
        <Button onClick={createUser} variant="contained" color="secondary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};
