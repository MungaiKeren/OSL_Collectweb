import {
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import "../../Styles/dataentry.scss";
import Button from "../Util/Button";
import Input from "../Util/Input";
import Loading from "../Util/Loading";
import Select from "../Util/Select";
import Step2Questions from "./Step2Questions";

export default function NewTool(props) {
  const [active, setActive] = useState("Tool Details");
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const e = localStorage.getItem("tsediting");

    setEditing(e);
  }, [active]);

  useEffect(() => {
    if (editing !== null) {
      setLoading(true);
      fetch(`/api/toolslist/${editing}`)
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
    }
  }, [editing, active]);

  return (
    <div className="toolbuilder">
      <div className="new">
        <div className="topbar">
          <h4>New Data Collection Tool</h4>
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
              {editing !== null ? (
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

  const createDocument = (e) => {
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

    fetch("/api/toolslist/create", {
      method: "POST",
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
        console.log(data);
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
        console.log(err);        
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
          label="Data Table Name (cannot have special characters) *"
        />
        <Select
          ref={Status}
          value={props?.data?.Status}
          label="Form Status"
          data={["Active", "Inactive"]}
        />
      </div>

      <h6>{error}</h6>
      <Button handleClick={createDocument} value="Submit" />
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
