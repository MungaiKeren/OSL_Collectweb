import { useEffect, useState } from "react";
import "../../Styles/tbquestionnaire.scss";
import usaid from "../../assets/imgs/usaid_logo.png";
import wkwp from "../../assets/imgs/wkwp_logo.png";
import Button from "../Util/Button";
import { useLocation } from "react-router-dom";
import Input from "../Util/Input";
import Select from "../Util/Select";
import Loading from "../Util/Loading";

export default function TBQuestionnaire(props) {
  const [table, setTable] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [filled, setFilled] = useState(false);
  const [body, setBody] = useState({});
  const location = useLocation();
  const pathname = location.pathname.split("/");

  useEffect(() => {
    if (data == null) {
      setLoading(true);
      fetch(`/api/questions/bytablename/${pathname[2]}`)
        .then((res) => {
          if (res.ok) return res.json();
          else throw Error("");
        })
        .then((data) => {
          setLoading(false);
          setData(data);
          const object = data.reduce((acc, currentItem) => {
            acc[`${currentItem.Column}`] = null;
            return acc;
          }, {});
          if (object.hasOwnProperty("geom")) {
            delete object.geom;
            object.Latitude = null;
            object.Longitude = null;
          }
          setBody(object);
          console.log(object);
        })
        .catch((e) => {
          setLoading(false);
        });
    }
  }, []);

  useEffect(() => {
    if (table == null) {
      setLoading(true);
      fetch(`/api/toolslist/bytablename/${pathname[2]}`)
        .then((res) => {
          if (res.ok) return res.json();
          else throw Error("");
        })
        .then((data) => {
          setLoading(false);
          if (data && data.length > 0) {
            setTable(data[0]);
          }
        })
        .catch((e) => {
          setLoading(false);
        });
    }
  }, []);

  useEffect(() => {
    const d = localStorageWithExpiry.getItem("filled");
    if (d != null) {
      setFilled(true);
    }
  }, []);

  function getType(txt) {
    switch (txt) {
      case "TEXT":
        return "text";
      case "DECIMAL":
        return "number";
      case "DATE":
        return "date";
      default:
        break;
    }
  }

  const localStorageWithExpiry = {
    setItem: function (key, value, ttl) {
      const now = new Date();
      const item = {
        value: value,
        expiry: now.getTime() + ttl * 1000, // ttl is in seconds
      };
      localStorage.setItem(key, JSON.stringify(item));
    },
    getItem: function (key) {
      const itemStr = localStorage.getItem(key);
      if (!itemStr) {
        return null;
      }
      const item = JSON.parse(itemStr);
      const now = new Date();
      if (now.getTime() > item.expiry) {
        localStorage.removeItem(key);
        return null;
      }
      return item.value;
    },
  };

  const uploadQuestions = () => {
    setError("");
    const chck = Object.values(body);
    const cols = Object.keys(body);
    let valid = true;
    chck.map((item, i) => {
      const index = data
        .map((e) => {
          return e.Column;
        })
        .indexOf(cols[i]);

      console.log(index);

      if (data[index]?.Required == "Yes" && (item == null || item == "")) {
        valid = false;
        if (!valid) return setError(`${data[index]?.Question} is required!`);
      }
      if (data[index]?.DataType == "DATE" && item == null) {
        let d = body;
        d[`${cols[i]}`] = new Date().toISOString().split("T")[0];
        setBody(d);
      }
      if (cols[i] == "Latitude" && (item == null || item == "")) {
        valid = false;
        return setError(`Latitude is required!`);
      }
      if (cols[i] == "Longitude" && (item == null || item == "")) {
        valid = false;
        return setError(`Longitude is required!`);
      }
    });

    if (!valid) return;

    setLoading(true);

    fetch(`/api/toolslist/submittabledata/${pathname[2]}`, {
      method: "POST",
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
          localStorageWithExpiry.setItem("filled", true, 3600);
          setFilled(true);
        } else {
          setError(data.error);
        }
      })
      .catch((err) => {
        setLoading(false);
        setError("Oops! Something went wrong!");
      });
  };
  return (
    <div className="questionnaire">
      <div className="qheader">
        <div className="qcontainer">
          <img className="usaid" src={usaid} alt="" />
          <h1>WKWP Questionnaire</h1>
          <img className="wkwp" src={wkwp} alt="" />
        </div>
      </div>
      <div className="tableheader">
        <div className="tcontainer">
          <h4>Data Collection Form</h4>
          <p>
            <b>Survey Form Title: {table?.ToolName}</b>
          </p>
          <p>
            <b>Description: {table?.Description}</b>
          </p>
          <p>
            <b>Target Counties: {table?.County}</b>
          </p>
          <p>
            <b>Date Created: {table?.updatedAt.split("T")[0]}</b>
          </p>
        </div>
      </div>
      <div className="questions">
        <h3>Survey Questions</h3>
        <p>All questions with an asterisks are mandatory!</p>
        <br />
        {!filled ? (
          <div className="quiz">
            {data &&
              data.length > 0 &&
              data.map((item, i) => {
                if (item.Column === "geom") {
                  return (
                    <div key={i} className="other">
                      <div className="div2equal">
                        <Input
                          handleChange={(v) => {
                            let d = body;
                            d.Latitude = v;
                            setBody(d);
                          }}
                          type="number"
                          label="Latitude"
                        />
                        <Input
                          handleChange={(v) => {
                            let d = body;
                            d.Longitude = v;
                            setBody(d);
                          }}
                          type="number"
                          label="Longitude"
                        />
                      </div>
                    </div>
                  );
                } else {
                  if (
                    item.QuestionType == "Single Choice" ||
                    item.QuestionType == "Mulitple Choice"
                  ) {
                    return (
                      <Select
                        key={i}
                        setChanged={(v) => {
                          let d = body;
                          d[item.Column] = v;
                          setBody(d);
                          console.log(d);
                        }}
                        data={item.Choices}
                        label={`${item.Order}. ${item.Question} ${
                          item.Required == "Yes" ? "*" : ""
                        }`}
                      />
                    );
                  } else
                    return (
                      <Input
                        key={i}
                        handleChange={(v) => {
                          let d = body;
                          d[item.Column] = v;
                          setBody(d);
                          console.log(d);
                        }}
                        type={
                          item.QuestionType == "Long Answer"
                            ? "textarea"
                            : getType(item.DataType)
                        }
                        label={`${item.Order}. ${item.Question}  ${
                          item.Required == "Yes" ? "*" : ""
                        }`}
                        value={
                          item.QuestionType == "Date"
                            ? new Date().toISOString().split("T")[0]
                            : ""
                        }
                      />
                    );
                }
              })}
          </div>
        ) : (
          <div className="filled">
            <h4>Thank you for submitting your response</h4>
          </div>
        )}
        <h6>{error}</h6>
        <Button
          handleClick={
            !filled
              ? uploadQuestions
              : () => {
                  localStorageWithExpiry.setItem("filled", null, 3600);
                  setFilled(false);
                }
          }
          value={!filled ? "Submit" : "Submit Again?"}
        />
      </div>
      {loading && <Loading />}
    </div>
  );
}
