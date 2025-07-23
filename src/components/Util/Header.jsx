import {
  faBars,
  faBarsStaggered,
  faBoxes,
  faChartBar,
  faClipboard,
  faEdit,
  faGear,
  faHome,
  faMap,
  faSignOut,
  faTasks,
  faTimes,
  faUserCircle,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function Header(props) {
  const [nav, setNav] = useState(false);
  const [details, setDetails] = useState("");
  const [login, setLogin] = useState("");
  const [logout, setLogout] = useState("");
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("");
  const [role, setRole] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("gdfhgfhtkngdfhgfhtkn");

    if (token) {
      try {
        let decoded = jwtDecode(token);
        if (Date.now() >= decoded.exp * 1000) {
          window.location.href = "/login";
        } else {
          const lg = convertTime(decoded?.iat).split("GMT")[0];
          const lo = convertTime(decoded?.exp).split("GMT")[0];
          setDetails(decoded?.Name);
          setEmail(decoded?.Email);
          setPosition(decoded?.Position);
          setRole(decoded?.Role);
          setLogin(lg.substring(lg.length - 9, lg.length));
          setLogout(lo.substring(lo.length - 9, lo.length));
        }
      } catch (error) {
        window.location.href = "/login";
      }
    } else {
      window.location.href = "/login";
    }
  }, []);

  function convertTime(dt) {
    const date = new Date(dt * 1000);
    return date.toString();
  }

  return (
    <>
      <div className="header">        
        <p>
          <FontAwesomeIcon
            icon={faUserCircle}
            className="user"
            onClick={() => setShowUserPopup(true)}
          />
          {details}
          <span>
            <b> Login Time: </b> {login}
          </span>
          <span>
            <b> Logout Time: </b> {logout}
          </span>
        </p>
      </div>
      {nav && <MobileHeader setNav={setNav} />}
    </>
  );
}

const MobileHeader = (props) => {
  const pathname = window.location.pathname.split("/");

  return (
    <div className="mobheader">
      <FontAwesomeIcon
        onClick={() => {
          props.setNav(false);
        }}
        icon={faTimes}
        className="fa-times"
      />
      <h1>OSL Collect</h1>

      <hr />
      <Item
        txt="Home"
        url="/"
        active={pathname[1]}
        link=""
        icon={faHome}
        options={[]}
        showing={props.showing}
      />
      <Item
        txt="Indicators"
        url="/indicators"
        link="indicators"
        active={pathname[1]}
        icon={faChartBar}
        options={[]}
        showing={props.showing}
      />
      <Item
        url="/reports"
        link="reports"
        txt="Reports"
        active={pathname[1]}
        icon={faBoxes}
        options={[]}
        showing={props.showing}
      />
      <Item
        url="/mel"
        txt="MEL"
        link="mel"
        active={pathname[1]}
        icon={faClipboard}
        code="&#xf0ea;"
        options={[]}
        showing={props.showing}
      />
      <Item
        url="/gis"
        txt="GIS"
        link="gis"
        active={pathname[1]}
        icon={faMap}
        options={[]}
        showing={props.showing}
      />
      <Item
        txt="Counties"
        url="/counties"
        link="counties"
        active={pathname[1]}
        icon={faBarsStaggered}
        options={[]}
        showing={props.showing}
      />
      <Item
        url="/dataentry"
        txt="Data Entry"
        link="dataentry"
        active={pathname[1]}
        icon={faEdit}
        options={[]}
        showing={props.showing}
      />
      <Item
        url="/buildtool"
        txt="Tool Builder"
        link="buildtool"
        active={pathname[1]}
        icon={faClipboard}
        code="&#xf0ea;"
        options={[]}
        showing={props.showing}
      />

      <Item
        url="/wp"
        txt="Workplans"
        link="wp"
        active={pathname[1]}
        icon={faTasks}
        options={[]}
        showing={props.showing}
      />
      <Item
        txt="Users"
        url="/users"
        link="users"
        active={pathname[1]}
        icon={faUsers}
        options={[]}
        showing={props.showing}
      />
      <Item
        txt="Settings"
        url="/settings"
        link="settings"
        active={pathname[1]}
        icon={faGear}
        code="&#xf013;"
        options={[]}
        showing={props.showing}
      />
      <Item
        txt="Signout"
        active={pathname[1]}
        icon={faSignOut}
        url="/logout"
        options={[]}
        showing={props.showing}
      />
    </div>
  );
};

const Item = (params) => {
  return (
    <div
      onClick={() => {
        if (params.options?.length === 0) {
          window.location.href = params.url;
        }
        if (params.url === "/logout") {
          localStorage.removeItem("gdfhgfhtkngdfhgfhtkn");
          window.location.href = "/login";
        }
      }}
      onMouseEnter={() => { }}
      className={params.link === params.active ? "active" : "item"}
    >
      <FontAwesomeIcon icon={params.icon} />
      <p>{params.txt}</p>
    </div>
  );
};
