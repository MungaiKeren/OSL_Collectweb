import React, { useState } from "react";
import "../../Styles/userhome.scss";
import MUsers from "./MUsers";
import PortalUsers from "./PortalUsers";

export default function UserHome(props) {
  const [active, setActive] = useState("System Users");

  return (
    <div className="userhome">
      <div className="vtop">
        <Item txt="System Users" active={active} setActive={setActive} />
        {/* <Item txt="Mobile Users" active={active} setActive={setActive} /> */}
      </div>
      {active === "System Users" && <PortalUsers role={props.role}/>}
      {active === "Mobile Users" && <MUsers />}
    </div>
  );
}

const Item = (props) => {
  return (
    <div
      onClick={() => {
        props.setActive(props.txt);
      }}
      className={props.active === props.txt ? "vactive" : "vitem"}
    >
      <p>{props.txt}</p>
    </div>
  );
};
