import {
  faSearch,
  faTimes,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useRef, useEffect } from "react";
import Confirm from "../Util/Confirm";
import Input from "../Util/Input";
import Select from "../Util/Select";
import Button from "../Util/Button";
import Loading from "../Util/Loading";

function formatDate(inputDate) {
  const date = new Date(inputDate);

  // Format the day with the appropriate suffix
  const day = date.getDate();
  const dayWithSuffix = getDayWithSuffix(day);

  const options = { year: "numeric", month: "short" };
  const formattedDate = date.toLocaleDateString("en-US", options);

  return `${dayWithSuffix} ${formattedDate}`;
}

function getDayWithSuffix(day) {
  if (day >= 11 && day <= 13) {
    return `${day}th`;
  }

  switch (day % 10) {
    case 1:
      return `${day}st`;
    case 2:
      return `${day}nd`;
    case 3:
      return `${day}rd`;
    default:
      return `${day}th`;
  }
}

export default function SelectedUser(props) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const openConfirm = () => {
    setShowConfirm(true);
  };

  const closeConfirm = () => {
    setShowConfirm(false);
  };

  function updateUser(status) {
    props.setLoading(true);
    fetch(`/api/${props.url}/${props?.userDetails?.UserID}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ Status: !status }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else throw Error("");
      })
      .then((data) => {
        props.setLoading(false);
        props.setRefresh(!props.refresh);

        window.location.reload();
      })
      .catch((err) => {
        props.setLoading(false);
      });
  }

  function deleteUser() {
    props.setLoading(true);
    fetch(`/api/${props.url}/${props?.userDetails?.UserID}`, {
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
        props.setLoading(false);
        props.setRefresh(!props.refresh);

        window.location.reload();
      })
      .catch((err) => {
        props.setLoading(false);
      });
  }

  return (
    <>
      <p>Name: {props?.userDetails?.Name}</p>
      <p>Email: {props?.userDetails?.Email}</p>
      <p>Phone: {props?.userDetails?.Phone}</p>
      <p>Position: {props?.userDetails?.Position}</p>
      <p>County: {props?.userDetails?.County}</p>
      <p>Level: {props?.userDetails?.Level}</p>
      <p>Role: {props?.userDetails?.Role}</p>
      <p>Status: {props?.userDetails?.Status ? "Active" : "Disabled"}</p>
      <p>Date Created: {formatDate(props?.userDetails?.createdAt)}</p>
      <p>Date Updated: {formatDate(props?.userDetails?.updatedAt)}</p>

      {props.role !== "Regular User" && props.role !== "Guest" && (
        <div className="actions">
          <h6
            onClick={() => {
              updateUser(props?.userDetails?.Status);
            }}
          >
            {props?.userDetails?.Status ? "Deactivate" : "Activate"}
          </h6>
          <h6
            onClick={() => {
              setClicked(true);
            }}
          >
            Update
          </h6>
          <h6
            onClick={() => {
              openConfirm();
              // deleteUser();
            }}
          >
            Delete
          </h6>
        </div>
      )}

      {showConfirm && (
        <Confirm
          closeConfirm={closeConfirm}
          deleteFunction={() => {
            deleteUser();
          }}
        />
      )}

      {clicked && (
        <UpdatePopUp
          setClicked={setClicked}
          setRefresh={setRefresh}
          refresh={refresh}
          userId={props?.userDetails?.UserID}
        />
      )}
    </>
  );
}

const UpdatePopUp = (props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState("");

  useEffect(() => {
    fetch(`/api/auth/${props?.userId}`)
      .then((res) => {
        if (res.ok) return res.json();
        else throw Error("");
      })
      .then((data) => {
        console.log(data);
        setData(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);


  const pos = [
    "",
    "Rural Water Specialist",
    "Governance & Urban Water Specialist",
    "WKWP Staff",
    "Component Lead",
    "IT Specialist",
    "MEL Specialist",
    "WRM Officer",
    "Communication Manager",
    "MEL Lead",
    "DCOP",
    "COP",
    "USAID Staff",
    "Stakeholder",
    "Field Officer",
  ];

  const cnty = [
    "",
    "Bungoma",
    "Busia",
    "Homa Bay",
    "Kakamega",
    "Kisii",
    "Kisumu",
    "Migori",
    "Siaya",
    "All",
  ];
  const fname = useRef();
  const sname = useRef();
  const email = useRef();
  const phone = useRef();
  const position = useRef();
  const role = useRef();
  const county = useRef();
  const level = useRef();

  function titleCase(str) {
    let splitStr = str.toLowerCase().split(" ");
    for (let i = 0; i < splitStr.length; i++) {
      splitStr[i] =
        splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(" ");
  }

  const UpdateUser = () => {
    const body = {
      Name:
        titleCase(fname.current.value.trim()) +
        " " +
        titleCase(sname.current.value.trim()),
      Phone: phone.current.value,
      Email: email.current.value.toLowerCase().trim(),
      Position: position.current.value,
      County: county.current.value,
      Level: level.current.value,
      Role: role.current.value,
    };

    setError("");

    const validateForm = () => {
      let result = true;
      if (!validateEmail(body.Email)) {
        result = false;
        setError("Please Enter a valid email address!");
        setLoading(false);
        return result;
      }
      if (!body.Phone || body.Phone.length !== 10) {
        result = false;
        setError("Enter a valid phone number");
        setLoading(false);
        return result;
      }
      if (fname.current.value === "" || sname.current.value === "") {
        result = false;
        setError("Two names are required!");
        setLoading(false);
        return result;
      }

      return result;
    };

    if (validateForm()) {
      setLoading(true);
      fetch(`/api/auth/${props?.userId}`, {
        method: "put",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
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
            setTimeout(() => {
              props.setClicked(false);
              props.setRefresh(!props.refresh);
            }, 2000);
          } else {
            setError(data.error);
          }
        })
        .catch((err) => {
          setLoading(false);
        });
    }
  };

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  return (
    <div className="popup">
      <div className="wrap">
        <div className="head">
          <h3>Update User Details</h3>
          <FontAwesomeIcon
            onClick={() => {
              props.setClicked(false);
            }}
            className="fa-times"
            icon={faTimes}
          />
        </div>

        <hr />
        <div className="new">
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="div2equal">
              <Input
                ref={fname}
                type="text"
                label="First Name *"
                value={(data?.Name)?.split(" ")[0]}
              />
              <Input
                ref={sname}
                type="text"
                label="Surname *"
                value={(data?.Name)?.split(" ").slice(1).join(" ")}
              />
            </div>
            <div className="div2equal">
              <Input
                ref={email}
                type="email"
                label="Email *"
                value={data?.Email}
              />
              <Input
                ref={phone}
                type="number"
                label="Phone *"
                value={data?.Phone}
              />
            </div>

            <div className="div2equal">
              <Select
                ref={position}
                data={pos}
                label="Position *"
                value={data?.Position}
              />
              <Select
                ref={county}
                data={cnty}
                label="County *"
                value={data?.County}
              />
            </div>

            <div className="div2equal">
              <Select
                ref={level}
                data={["", "Full Access", "Dashboard", "Mobile"]}
                label="Level *"
                value={data?.Level}
              />
              <Select
                ref={role}
                data={["", "Regular User", "Guest", "Admin", "Data Collector"]}
                label="Role *"
                value={data?.Role}
              />
            </div>

            <h6>{error}</h6>
            <Button handleClick={UpdateUser} value="Submit" />
          </form>
          {loading && <Loading />}
        </div>
      </div>
    </div>
  );
};
