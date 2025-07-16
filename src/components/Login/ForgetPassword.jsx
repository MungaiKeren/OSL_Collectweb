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
import Divider from "@mui/material/Divider";
import Swal from "sweetalert2";

export default function ForgetPassword(props) {
  const rfEmail = useRef();
  const [body, updateBody] = useState({
    Email: "",
  });

  const forgetPassword = async () => {
    let d = { ...body };
    d.Email = rfEmail.current.value.toLowerCase().trim();
    updateBody(d);

    if (!verifyEmail(d.Email)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Email",
        text: "Please provide a valid email address!",
        zIndex: 1500,
      });
      return;
    }

    props.setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(d),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      props.setLoading(false);
      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: data.success,
          timer: 1800,
          showConfirmButton: false,
          zIndex: 1500,
        });
        setTimeout(() => {
          props.setToggleForgot(false);
        }, 1800);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.error,
          zIndex: 1500,
        });
      }
    } catch (err) {
      props.setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong!",
        zIndex: 1500,
      });
    }
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
      PaperProps={{ sx: { zIndex: 1200 } }}
      slotProps={{ backdrop: { sx: { zIndex: 1100 } } }}
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
