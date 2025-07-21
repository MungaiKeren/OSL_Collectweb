import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useTheme } from "@mui/material/styles";
import { jwtDecode } from "jwt-decode";

export default function Settings() {
  const theme = useTheme();
  const [currentUser, setCurrentUser] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const psd = useRef();
  const npsd = useRef();
  const cpsd = useRef();

  useEffect(() => {
    const token = localStorage.getItem("gdfhgfhtkngdfhgfhtkn");
    if (token) {
      try {
        let decoded = jwtDecode(token);
        if (Date.now() >= decoded.exp * 1000) {
          window.location.href = "/login";
        } else {
          setCurrentUser(decoded);
        }
      } catch (error) {
        window.location.href = "/login";
      }
    } else {
      window.location.href = "/login";
    }
  }, []);

  const handleClickShowPassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const changePassword = async () => {
    setError("");
    setSuccess("");

    if (!psd.current.value || !npsd.current.value || !cpsd.current.value) {
      setError("All fields are required!");
      return;
    }
    if (cpsd.current.value !== npsd.current.value) {
      setError("Passwords do not match!");
      return;
    }

    const body = {
      Password: psd.current.value,
      NewPassword: npsd.current.value,
    };

    try {
      const res = await fetch(`/api/auth/${currentUser.UserID}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(data.success);
        setTimeout(() => {
          localStorage.removeItem("gdfhgfhtkngdfhgfhtkn");
          window.location.href = "/login";
        }, 2000);
      } else {
        setError(data.error);
      }
    } catch (e) {
      setError("Failed to change password. Please try again.");
    }
  };

  const convertTime = (dt) => {
    const date = new Date(dt * 1000);
    return date.toString();
  };

  const userDetailFields =
    currentUser && typeof currentUser === "object"
      ? Object.entries(currentUser)
          .filter(([key]) => !["iat", "exp"].includes(key))
          .map(([key, value]) => ({
            label: key,
            value: key === "Status" ? (value ? "Active" : "Disabled") : value,
          }))
      : [];

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, mb: 4, borderRadius: 2 }}>
        <Typography
          variant="h5"
          sx={{ mb: 2, color: "primary.main", fontWeight: 600 }}
        >
          User Details
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          {userDetailFields.length > 0 ? (
            <>
              {userDetailFields.map(({ label, value }) => (
                <Grid item xs={12} sm={6} key={label}>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: theme.palette.grey[700] }}
                    gutterBottom
                  >
                    {label}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: theme.palette.primary.main, fontWeight: 600 }}
                  >
                    {value}
                  </Typography>
                </Grid>
              ))}
              {currentUser?.iat && (
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: theme.palette.grey[700] }}
                    gutterBottom
                  >
                    Login Time
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: theme.palette.primary.main, fontWeight: 600 }}
                  >
                    {convertTime(currentUser.iat).split("GMT")[0]}
                  </Typography>
                </Grid>
              )}
              {currentUser?.exp && (
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: theme.palette.grey[700] }}
                    gutterBottom
                  >
                    Logout Time
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: theme.palette.primary.main, fontWeight: 600 }}
                  >
                    {convertTime(currentUser.exp).split("GMT")[0]}
                  </Typography>
                </Grid>
              )}
            </>
          ) : (
            <Grid item xs={12}>
              <Typography variant="body1" color="text.secondary" align="center">
                Loading user details...
              </Typography>
            </Grid>
          )}
        </Grid>
      </Paper>

      <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
        <Typography
          variant="h5"
          sx={{ mb: 2, color: "primary.main", fontWeight: 600 }}
        >
          Change Password
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            changePassword();
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                inputRef={psd}
                fullWidth
                label="Old Password"
                type={showPassword.old ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => handleClickShowPassword("old")}
                        edge="end"
                        tabIndex={-1}
                      >
                        {showPassword.old ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                inputRef={npsd}
                fullWidth
                label="New Password"
                type={showPassword.new ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => handleClickShowPassword("new")}
                        edge="end"
                        tabIndex={-1}
                      >
                        {showPassword.new ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                inputRef={cpsd}
                fullWidth
                label="Confirm Password"
                type={showPassword.confirm ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => handleClickShowPassword("confirm")}
                        edge="end"
                        tabIndex={-1}
                      >
                        {showPassword.confirm ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {success}
            </Alert>
          )}

          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={changePassword}
            sx={{
              mt: 3,
              px: 4,
              py: 1,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Change Password
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
