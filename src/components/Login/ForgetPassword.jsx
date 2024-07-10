import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";
import Button from "../Util/Button";
import Input from "../Util/Input";

export default function ForgetPassword(props) {
  const rfEmail = useRef();
  const [isError, setIsError] = useState();
  const [body, updateBody] = useState({
    Email: null,
  });

  const forgetPassword = () => {
    let d = body;
    d.Email = rfEmail.current.value.toLowerCase().trim();
    updateBody(d);

    if (!verifyEmail(body.Email)) {
      return setIsError("Please provide a valid email address!");
    }

    if (verifyEmail(body.Email)) {
      props.setLoading(true);
      fetch("/api/auth/forgot", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
      })
        .then((res) => {
          if (res.ok) return res.json();
          else throw Error("Failed");
        })
        .then((data) => {
          if (data.success) {
            props.setLoading(false);
            setIsError(data.success);
            setTimeout(() => {
              props.setToggleForgot(false);
            }, 2000);
          } else {
            props.setLoading(false);
            setIsError(data.error);
          }
        })
        .catch((error) => {
          props.setLoading(false);
          setIsError("Something went wrong!");
        });
    }
  };

  const verifyEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]/.,;:\s@"]+(\.[^<>()[\]/.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  return (
    <div className="forgot">
      <div className="card1">
        <FontAwesomeIcon
          onClick={() => {
            props.setToggleForgot(false);
          }}
          className="fa-times"
          icon={faTimes}
        />
        <h3>Reset Password</h3>
        <p>
          Enter a valid email address. A password will be generated and sent to
          your email account
        </p>
        <br />
        <form
          action=""
          onSubmit={(e) => {
            e.preventDefault(e);
          }}
        >
          <Input ref={rfEmail} type="email" label="Email address" />
          <p className="err">{isError}</p>
          <Button value="Submit" handleClick={forgetPassword} />
        </form>
      </div>
    </div>
  );
}
