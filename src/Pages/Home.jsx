import "../Styles/home.scss";
import Header from "../components/Util/Header";
import Navigation from "../components/Util/Navigation";
import { useState, useEffect } from "react";
import Settings from "../components/Settings/Settings";
import ToolBuilder from "../components/ToolBuilder/ToolBuilder";
import NewTool from "../components/ToolBuilder/NewTool";
import UpdateTool from "../components/ToolBuilder/UpdateTool";
import UserHome from "../components/Users/UserHome";
import TBData from "../components/ToolBuilder/TBData";
import { jwtDecode } from "jwt-decode";

export default function Home(props) {
  const [showing, setShowing] = useState(true);
  const pathname = window.location.pathname.split("/");
  const [shownavigation, setShowNavigation] = useState(false);
  const [role, setRole] = useState();

  const handleResize = () => {
    if (window.innerWidth < 768) {
      setShowing(false);
    } else {
      setShowing(true);
    }
  };

  useEffect(() => {
    handleResize();
  }, []);


  useEffect(() => {
    const token = localStorage.getItem("gdfhgfhtkngdfhgfhtkn");
    if (token) {
      let decoded = jwtDecode(token);
      setRole(decoded.Role);
    }
  }, []);

  return (
    <div className="home">
      <div
        style={{ gridTemplateColumns: !showing ? "auto 1fr" : "225px 1fr" }}
        className="main"
      >
        <div className="left_panel">
          <Navigation
            showing={showing}
            setShowing={setShowing}
            shownavigation={shownavigation}
            role={role}
          />
        </div>
        <div className="right_panel">
          <Header
            showing={showing}
            setShowing={setShowing}
            setShowNavigation={setShowNavigation}
            shownavigation={setShowNavigation}
          />

          <div className="full">
            {pathname[1] === "buildtool" && pathname.length === 2 && <ToolBuilder />}

            {pathname[1] === "buildtool" && pathname[2] === "new" && <NewTool />}

            {pathname[1] === "buildtool" && pathname[2] === "update" && <UpdateTool />}

            {pathname[1] === "buildtool" && pathname[2] === "data" && <TBData />}

            {pathname[1] === "users" && <UserHome role={role} />}

            {pathname[1] === "settings" && <Settings />}
          </div>
        </div>
      </div>
    </div>
  );
}
