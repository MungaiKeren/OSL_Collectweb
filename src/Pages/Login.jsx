/* eslint-disable jsx-a11y/anchor-is-valid */
import { useRef, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Link from "@mui/material/Link";
import Fade from "@mui/material/Fade";
import CircularProgress from "@mui/material/CircularProgress";
import ForgetPassword from "../components/Login/ForgetPassword";

export default function Login(props) {
  const rfEmail = useRef();
  const rfPassword = useRef();
  const [isErr, setIsErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [body, updateBody] = useState({
    Email: "",
    Password: "",
  });
  const [toggleForgot, setToggleForgot] = useState(false);
  const [cardIn, setCardIn] = useState(false);

  // Animate card in on mount
  useState(() => {
    setTimeout(() => setCardIn(true), 100);
  }, []);

  const login = () => {
    let d = { ...body };
    d.Email = rfEmail.current.value.toLowerCase().trim();
    d.Password = rfPassword.current.value;
    updateBody(d);
    setIsErr("");

    if (!validateEmail(d.Email))
      return setIsErr("Please Enter a Valid Email Address!");
    if (!validatePassword(d.Password))
      return setIsErr("Password must be at least 6 characters!");

    setLoading(true);
    fetch("/api/auth/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(d),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw Error("Login Failed");
        }
      })
      .then((data) => {
        if (data.success) {
          localStorage.setItem("gdfhgfhtkngdfhgfhtkn", data.token);
          localStorage.removeItem("path");
          setIsErr(data.success);
          setLoading(false);
          window.location.href = "/buildtool";
        } else {
          setLoading(false);
          setIsErr(data.error);
        }
      })
      .catch((err) => {
        setLoading(false);
        setIsErr("Login failed");
      });
  };

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]/.,;:\s@\"]+(\.[^<>()[\]/.,;:\s@\"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        // Background image plan: Replace the URL below with your chosen Unsplash/abstract image
        background: `linear-gradient(rgba(26,34,54,0.7), rgba(26,34,54,0.7)), url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80') center/cover no-repeat`,
      }}
    >
      <Fade in={cardIn} timeout={800}>
        <Paper
          elevation={8}
          sx={{
            minWidth: { xs: 420, sm: 400 },
            maxWidth: 520,
            px: { xs: 3, sm: 5 },
            py: { xs: 4, sm: 6 },
            borderRadius: 4,
            boxShadow: 6,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            bgcolor: "background.paper",
            position: "relative",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "primary.main",
              mb: 1,
              letterSpacing: 1,
            }}
          >
            OSL Collect
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ color: "text.secondary", mb: 3 }}
          >
            User Login
          </Typography>
          {isErr && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {isErr}
            </Alert>
          )}
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              login();
            }}
            sx={{ width: "100%" }}
            autoComplete="off"
          >
            <TextField
              inputRef={rfEmail}
              type="email"
              label="Email Address"
              variant="outlined"
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <TextField
              inputRef={rfPassword}
              type="password"
              label="Password"
              variant="outlined"
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
              <Link
                component="button"
                variant="body2"
                underline="hover"
                sx={{ color: "secondary.main", cursor: "pointer" }}
                onClick={() => setToggleForgot(true)}
              >
                Forgot password?
              </Link>
            </Box>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                fontWeight: 600,
                borderRadius: 2,
                py: 1.3,
                fontSize: "1.1rem",
                textTransform: "none",
                boxShadow: 2,
                mb: 1,
                transition: "all 0.3s cubic-bezier(.4,2,.6,1)",
                "&:hover": {
                  backgroundColor: "secondary.main",
                  color: "white",
                  boxShadow: 4,
                  transform: "scale(1.03)",
                },
              }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={26} color="inherit" />
              ) : (
                "Login"
              )}
            </Button>
          </Box>
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", mt: 3, letterSpacing: 1 }}
          >
            Powered by{" "}
            <Link
              href="https://osl.co.ke"
              target="_blank"
              sx={{ color: "accent.main", fontWeight: 600 }}
            >
              Oakar Services Ltd
            </Link>
          </Typography>
        </Paper>
      </Fade>
      {toggleForgot && (
        <ForgetPassword
          setLoading={setLoading}
          setToggleForgot={setToggleForgot}
        />
      )}
    </Box>
  );
}
