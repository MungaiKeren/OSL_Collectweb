/* eslint-disable no-duplicate-case */
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import "../../Styles/dataentry.scss";
import Confirm from "../Util/Confirm";
import Input from "../Util/Input";
import Loading from "../Util/Loading";
import Select from "../Util/Select";
import Step2Questions from "./Step2Questions";

export default function UpdateTool(props) {
  const [active, setActive] = useState("Tool Details");
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(null);
  const [data, setData] = useState(null);
  const pathname = window.location.pathname.split("/");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/toolslist/${pathname[3]}`)
      .then((res) => {
        if (res.ok) return res.json();
        else throw Error("");
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  }, [editing, active]);

  return (
    <div className="toolbuilder">
      <div className="new">
        <div className="topbar">
          <h4>Update Data Collection Tool</h4>
          <p
            onClick={() => {
              window.location.href = "/buildtool";
            }}
          >
            <FontAwesomeIcon icon={faArrowRight} /> Tools
          </p>
        </div>
        <div className="rmf">
          <div className="bar">
            <Item txt="Tool Details" active={active} setActive={setActive} />
            <Item
              txt="Data Collection Questions"
              active={active}
              setActive={setActive}
            />
          </div>
          {active === "Tool Details" && (
            <Step1 data={data} setActive={setActive} editing={editing} />
          )}
          {active === "Data Collection Questions" && (
            <>
              {data !== null ? (
                <Step2Questions
                  data={data}
                  setActive={setActive}
                  editing={editing}
                />
              ) : (
                <Error />
              )}
            </>
          )}
          {loading && <Loading />}
        </div>
      </div>
    </div>
  );
}

const Item = (props) => {
  return (
    <div
      onClick={() => {
        props.setActive(props.txt);
      }}
      className="item"
    >
      <p className={props.txt === props.active ? "active" : ""}>{props.txt}</p>
    </div>
  );
};

const Step1 = (props) => {
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState("");
  const [body, setBody] = useState({
    ToolName: null,
    County: null,
    Description: null,
    DataTableName: null,
    Status: null,
  });
  const ToolName = useRef();
  const County = useRef();
  const Description = useRef();
  const DataTableName = useRef();
  const Status = useRef();

  const openConfirm = () => {
    setShowConfirm(true);
  };

  const closeConfirm = () => {
    setShowConfirm(false);
  };

  const deleteTool = () => {
    setError("");
    setLoading(true);
    fetch(`/api/toolslist/${props.data.ID}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else throw Error("");
      })
      .then((data) => {
        if (data.success) setError(data.success);
        else setError(data.error);
        setTimeout(() => {
          window.location.href = "/buildtool";
        }, 2000);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError("Oops! Something went wrong!");
      });
  };

  const updateTool = (e) => {
    setError("");
    let d = body;
    d.ToolName = ToolName.current.value;
    d.County = County.current.value;
    d.Description = Description.current.value;
    d.DataTableName = DataTableName.current.value;
    d.Status = Status.current.value;
    setBody(d);

    const chck = Object.values(d);
    const cols = Object.keys(d);
    let valid = true;
    chck.map((item, i) => {
      if (item === null || item === "") {
        valid = false;
        if (!valid) return setError(`${cols[i]} is required!`);
      }
    });
    if (!valid) return;

    if (!isValidTableName(d.DataTableName))
      return setError("Invalid Data Table Name");

    setLoading(true);

    fetch(`/api/toolslist/${props.data.ID}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(d),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else throw Error("");
      })
      .then((data) => {
        setLoading(false);
        if (data.success) {
          setError(data.success);
          localStorage.setItem("tsediting", data.ID);
          setTimeout(() => {
            props.setActive("Data Collection Questions");
          }, 2000);
        } else {
          setError(data.error);
        }
      })
      .catch((err) => {
        setLoading(false);
        setError("Oops! Something went wrong!");
      });
  };

  function isValidTableName(name) {
    // Regular expression to match valid PostgreSQL table names
    const tableNameRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

    return tableNameRegex.test(name);
  }

  return (
    <div>
      <div className="div2equal">
        <Input
          ref={ToolName}
          value={props?.data?.ToolName}
          label="Tool Name *"
        />

        <Select
          ref={County}
          value={props?.data?.County}
          label="County"
          data={[
            "",
            "Bungoma",
            "Busia",
            "Homabay",
            "Kakamega",
            "Kisumu",
            "Kisii",
            "Migori",
            "Siaya",
            "All",
          ]}
        />
      </div>
      <Input
        ref={Description}
        value={props?.data?.Description}
        label="Tool Description *"
        type="textarea"
      />
      <div className="div2equal">
        <Input
          ref={DataTableName}
          value={props?.data?.DataTableName}
          label="Data Table Name (cannot have spaces) *"
        />
        <Select
          ref={Status}
          value={props?.data?.Status}
          label="Form Status"
          data={["Active", "Inactive"]}
        />
      </div>

      <h6>{error}</h6>

      <div className="div2equal">
        <button
          style={{ backgroundColor: "#BA0C2F" }}
          onClick={() => {
            localStorage.removeItem("tsediting");
            openConfirm();
          }}
        >
          Delete Tool
        </button>
        <button
          style={{ backgroundColor: "#0064B6" }}
          onClick={() => {
            updateTool();
          }}
        >
          Next
        </button>
      </div>
      {showConfirm && (
        <Confirm closeConfirm={closeConfirm} deleteFunction={deleteTool} />
      )}
      <br />
      {loading && <Loading />}
    </div>
  );
};

const Error = (props) => {
  return (
    <div className="error">
      <p>This form is only available after filling the basic details</p>
    </div>
  );
};
