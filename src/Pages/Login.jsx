/* eslint-disable jsx-a11y/anchor-is-valid */
import "../Styles/login.scss";
import Button from "../components/Util/Button";
import Input from "../components/Util/Input";
import wkwp_logo from "../assets/imgs/wkwp_logo.png";
import usaid_logo from "../assets/imgs/usaid_logo.png";
import { useRef, useState } from "react";
import Loading from "../components/Util/Loading";
import ForgetPassword from "../components/Login/ForgetPassword";

export default function Login(props) {
  const rfEmail = useRef();
  const rfPassword = useRef();
  const [isErr, setIsErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [body, updateBody] = useState({
    Email: null,
    Password: null,
  });
  const ref = useRef();
  const [toggleForgot, setToggleForgot] = useState(false);

  const login = () => {
    let d = body;
    d.Email = rfEmail.current.value.toLowerCase().trim();
    d.Password = rfPassword.current.value;
    updateBody(d);
    setIsErr("");

    if (!validateEmail(body.Email))
      return setIsErr("Please Enter a Valid Email Address!");
    if (!validatePassword(body.Password))
      return setIsErr("Password must be at least 6 characters!");

    if (validateEmail(body.Email) && validatePassword(body.Password)) {
      setLoading(true);
      fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
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
            window.location.href = "/";
          } else {
            setLoading(false);
            setIsErr(data.error);
          }
        })
        .catch((err) => {
          setLoading(false);
          setIsErr("Login failed");
        });
    }
  };

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]/.,;:\s@"]+(\.[^<>()[\]/.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  return (
    <div ref={ref} className="login">
      <div className="top_logos">
        <img src={usaid_logo} alt="" />
        <div></div>
        <img src={wkwp_logo} alt="" />
      </div>
      <div className="card">
        <div className="container">
          {toggleForgot && (
            <ForgetPassword
              setLoading={setLoading}
              setToggleForgot={setToggleForgot}
            />
          )}
          <div className="left">
            <div className="sys">
              <div className="sysname">
                <h1>MEL-MIS</h1>
              </div>
            </div>
            <div className="attribution">
              <p>Powered by</p>
              <a href="https://osl.co.ke" target="blank_">
                Oakar Services Ltd
              </a>
            </div>
          </div>
          <div className="right">
            <h3>User Login</h3>
            <p className="err">{isErr}</p>
            <form
              action=""
              onSubmit={(e) => {
                e.preventDefault(e);
              }}
            >
              <Input
                ref={rfEmail}
                type="text"
                label="Email Address"
                placeholder="Email Address"
              />
              <Input
                ref={rfPassword}
                type="password"
                label="Password"
                placeholder="Password"
              />
              <p>
                Forgot password?{" "}
                <a
                  onClick={() => {
                    setToggleForgot(true);
                  }}
                  onKeyDownCapture={() => {
                    setToggleForgot(true);
                  }}
                >
                  click here
                </a>
              </p>
              <Button handleClick={login} value="Submit" />
            </form>
            {loading && <Loading />}
          </div>
        </div>
      </div>
    </div>
  );
}
