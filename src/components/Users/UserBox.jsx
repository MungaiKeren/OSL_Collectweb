import {
  faEnvelope,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

export default function UserBox(props) {
  const [init, setInit] = useState("");
  useEffect(() => {
    const nm = props.item.Name.split(" ");
    if (nm.length > 1) {
      setInit(nm[0].substring(0, 1) + nm[1].substring(0, 1));
    } else setInit(nm[0].substring(0, 1));
  }, []);
  return (
    <div
      className={
        props.userID === props.item.UserID ? "user-box active" : "user-box"
      }
      onClick={() => {
        props.setUserID(props?.item?.UserID);
        props?.selected?.current.scrollIntoView({ behavior: "smooth" });
      }}
    >
      <div className="left">
        <h2
          style={{ backgroundColor: props.item.Status ? "#0872BC" : "orange" }}
        >
          {init}
        </h2>
      </div>
      <div className="right">
        <h3 className="title">{props?.item?.Name}</h3>
        <p className="dark">
          <FontAwesomeIcon
            style={{ marginRight: "10px" }}
            color="#0064B6"
            icon={faEnvelope}
          />
          {props?.item?.Email}
        </p>
        <p className="dark">
          <FontAwesomeIcon
            style={{ marginRight: "10px" }}
            color="#0064B6"
            icon={faPhone}
          />{" "}
          {props?.item?.Phone}
        </p>
      </div>
    </div>
  );
}
