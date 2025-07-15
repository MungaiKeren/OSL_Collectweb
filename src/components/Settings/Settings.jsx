import { useEffect, useRef, useState } from "react";
import "../../Styles/settings.scss";
import Button from "../Util/Button";
import Input from "../Util/Input";
import { jwtDecode } from "jwt-decode";

export default function Settings(props) {
  const [currentUser, setCurrentUser] = useState("");
  const [error, setError] = useState("");
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

  function changePassword() {
    if (
      cpsd.current.value === "" ||
      npsd.current.value === "" ||
      psd.current.value === ""
    ) {
      return setError("All fields are required!");
    }
    if (cpsd.current.value !== npsd.current.value) {
      return setError("Passwords do not match!");
    }
    let body = {
      Password: psd.current.value,
      NewPassword: npsd.current.value,
    };
    fetch(`/api/auth/${currentUser.UserID}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((res) => {
        if (res.ok) return res.json();
        else throw Error("");
      })
      .then((data) => {
        if (data.success) {
          setError(data.success);
          setTimeout(() => {
            localStorage.removeItem("gdfhgfhtkngdfhgfhtkn");
            window.location.href = "/login";
          }, 2000);
        } else setError(data.error);
      })
      .catch((e) => {});
  }

  function convertTime(dt) {
    const date = new Date(dt * 1000);
    return date.toString();
  }

  return (
    <div className="settings">
      <div className="list">
        <h3>User Details</h3>
        <hr />
        <div className="div2equal">
          {currentUser !== "" &&
            Object.keys(currentUser).map((item, i) => {
              if (item !== "iat" && item !== "exp") {
                if (item === "Status") {
                  return (
                    <p>
                      <b>{item}: </b>
                      {currentUser[item] ? "Active" : "Disabled"}
                    </p>
                  );
                } else {
                  return (
                    <p>
                      <b>{item}: </b>
                      {currentUser[item]}
                    </p>
                  );
                }
              } else if (item === "iat") {
                return (
                  <p>
                    <b>Login Time: </b>
                    {convertTime(currentUser[item]).split("GMT")[0]}
                  </p>
                );
              } else if (item === "exp") {
                return (
                  <p>
                    <b>Logout Time: </b>
                    {convertTime(currentUser[item]).split("GMT")[0]}
                  </p>
                );
              }
            })}
        </div>
        <br></br>
        <h3>Change Password</h3>
        <hr />
        <form
          action=""
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <Input ref={psd} label="Old Password" type="password" />
          <div className="pc div2equal">
            <Input ref={npsd} label="New Password" type="password" />
            <Input ref={cpsd} label="Confirm Password" type="password" />
          </div>
          <p>{error}</p>
          <Button value="Submit" handleClick={changePassword} />
        </form>
      </div>
    </div>
  );
}
