import { useRef, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";

export default function ForgetPassword(props) {
  const rfEmail = useRef();
  const [isError, setIsError] = useState();
  const [body, updateBody] = useState({
    Email: "",
  });
  const [success, setSuccess] = useState("");

  const forgetPassword = () => {
    let d = { ...body };
    d.Email = rfEmail.current.value.toLowerCase().trim();
    updateBody(d);

    if (!verifyEmail(d.Email)) {
      setIsError("Please provide a valid email address!");
      setSuccess("");
      return;
    }

    props.setLoading(true);
    fetch("/api/auth/forgot", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(d),
    })
      .then((res) => {
        if (res.ok) return res.json();
        else throw Error("Failed");
      })
      .then((data) => {
        props.setLoading(false);
        if (data.success) {
          setSuccess(data.success);
          setIsError("");
          setTimeout(() => {
            props.setToggleForgot(false);
          }, 2000);
        } else {
          setIsError(data.error);
          setSuccess("");
        }
      })
      .catch(() => {
        props.setLoading(false);
        setIsError("Something went wrong!");
        setSuccess("");
      });
  };

  const verifyEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]/.,;:\s@\"]+(\.[^<>()[\]/.,;:\s@\"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  return (
    <Dialog
      open
      onClose={() => props.setToggleForgot(false)}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 1,
          bgcolor: "background.paper",
          color: "primary.main",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontWeight: 700,
          fontSize: "1.25rem",
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, color: "primary.main" }}
        >
          Reset Password
        </Typography>
        <IconButton
          aria-label="close"
          onClick={() => props.setToggleForgot(false)}
          sx={{ color: "grey.500" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ bgcolor: "background.paper", p: 2 }}>
        <Typography variant="body1" sx={{ mb: 2, color: "text.secondary" }}>
          Enter a valid email address. A password will be generated and sent to
          your email account.
        </Typography>
        {isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {isError}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        <TextField
          inputRef={rfEmail}
          type="email"
          label="Email address"
          variant="outlined"
          fullWidth
          autoFocus
          sx={{ mb: 2 }}
        />
      </DialogContent>
      <DialogActions sx={{ bgcolor: "background.paper", pb: 3, px: 3 }}>
        <Button
          onClick={forgetPassword}
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            fontWeight: 600,
            borderRadius: 2,
            py: 1.2,
            fontSize: "1rem",
            textTransform: "none",
            boxShadow: 2,
          }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
