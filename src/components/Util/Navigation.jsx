import {
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
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import contactDev from "../../assets/imgs/ContactDev.png";
import logo from "../../assets/imgs/usaid_logo.png";

export default function Navigation(props) {
  const pathname = window.location.pathname.split("/");

  const Item = (params) => {
    const [showing, setShowing] = useState(false);

    return (
      <div
        style={{
          backgroundColor: showing ? "#60606010" : "transparent",
        }}
      >
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
          className={params.link === params.active ? "active" : "item"}
          style={{
            padding: params.showing ? "1em" : "5x 0 5px 0",
            gridTemplateColumns: params.showing ? "20px auto" : "auto",
          }}
        >
          <FontAwesomeIcon icon={params.icon} />
          {params.showing && <p>{params.txt}</p>}
        </div>
        {showing &&
          params.options.length > 0 &&
          params.options.map((item, i) => {
            return (
              <a key={i} href={params.url + "/" + item}>
                {item}
              </a>
            );
          })}
      </div>
    );
  };

  return (
    <div
      style={{ width: props.showing ? "225px" : "fit-content" }}
      className="navigation"
    >
      <div className="logo">
        <h2>OSL Collect</h2>
        {/* <img
          style={{ maxWidth: props.showing ? "200px" : "30px" }}
          src={logo}
          alt=""
        /> */}
      </div>
      <div className="line-container">
        <div className="circle-point start-point"></div>
        <div className="circle-point end-point"></div>
      </div>
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
      {props.showing && (
        <div className="sysname">
          <h2>OSL Collect</h2>
        </div>
      )}
      <div className="contactdev">
        <img
          style={{ maxWidth: props.showing ? "200px" : "30px" }}
          src={contactDev}
          alt=""
        />
        <div className="contactdevtxt">
          <div>
            <p className="txt">Developed by</p>
            <p className="osl">Oakar Services</p>
            <p className="devlink">Contact Developer</p>
          </div>
        </div>
      </div>
    </div>
  );
}
