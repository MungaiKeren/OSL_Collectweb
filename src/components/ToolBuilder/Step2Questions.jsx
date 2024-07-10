import {
  faAngleDoubleDown,
  faAngleDoubleUp,
  faEdit,
  faPlusCircle,
  faPlusSquare,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loading from "../Util/Loading";
import Input from "../Util/Input";
import Select from "../Util/Select";
import { useEffect, useRef, useState } from "react";

export default function Step2Questions(props) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [order, setOrder] = useState(false);
  const [body, setBody] = useState([]);
  const [mydata, setMyData] = useState(null);
  const [choices, setChoices] = useState([]);
  const [qtype, setQType] = useState(null);
  const [editing, setEditing] = useState(null);
  const sq = useRef();
  const lq = useRef();
  const mcq = useRef();
  const rq = useRef();
  const ch = useRef();
  const sdt = useRef();
  const dq = useRef();
  const mcdt = useRef();

  useEffect(() => {
    if (props.data) {
      setLoading(true);
      fetch(`/api/questions/bytablename/${props.data.DataTableName}`)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else throw Error("");
        })
        .then((data) => {
          setLoading(false);

          setBody(data);
          if (mydata == null) {
            setMyData(data);
          }
        })
        .catch((err) => {
          setLoading(false);
          setError("Oops! Something went wrong!");
        });
    }
  }, [props.data, refresh]);

  const createDocument = (body) => {
    setError("");
    setChoices([]);
    setLoading(true);
    fetch(`/api/questions/create`, {
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
        setBody(data);
      })
      .catch((err) => {
        setLoading(false);
        setError("Oops! Something went wrong!");
      });
  };

  const updateDocument = (body) => {
    setError("");
    setChoices([]);
    setLoading(true);
    fetch(`/api/questions/${editing}`, {
      method: "PUT",
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
        setEditing(null);
        setLoading(false);
        setBody(data);
      })
      .catch((err) => {
        setLoading(false);
        setError("Oops! Something went wrong!");
      });
  };

  useEffect(() => {
    if (editing != null) {
      const index = body
        .map((e) => {
          return e.ID;
        })
        .indexOf(editing);
      if (index != -1) {
        setChoices(body[index]?.Choices);
      } else setChoices([]);
    } else setChoices([]);
  }, [editing]);

  function addSimpleQuestion() {
    const q = sq.current.value;
    const dt = sdt.current.value;
    if (q !== "") {
      const d = {
        Question: q,
        Column: q
          .replaceAll(" ", "_")
          .substring(0, q.length > 60 ? 60 : q.length),
        Required: rq.current.value,
        DataType: dt,
        QuestionType: "Short Answer",
        Choices: [],
        TableName: props.data.DataTableName,
      };
      if (editing == null) {
        createDocument(d);
      } else {
        updateDocument(d);
      }

      setQType(null);
    }
  }

  function addLongQuestion() {
    const q = lq.current.value;
    if (q !== "") {
      const d = {
        Question: q,
        Column: q
          .replaceAll(" ", "_")
          .substring(0, q.length > 60 ? 60 : q.length),
        Required: rq.current.value,
        DataType: "LONGTEXT",
        QuestionType: "Long Answer",
        Choices: [],
        TableName: props.data.DataTableName,
      };
      if (editing == null) {
        createDocument(d);
      } else {
        updateDocument(d);
      }
      setQType(null);
    }
  }

  function addSCQuestion() {
    const q = mcq.current.value;
    if (q !== "" && choices.length > 1) {
      const d = {
        Question: q,
        Column: q
          .replaceAll(" ", "_")
          .substring(0, q.length > 60 ? 60 : q.length),
        Required: rq.current.value,
        DataType: mcdt.current.value,
        QuestionType: "Single Choice",
        Choices: choices,
        TableName: props.data.DataTableName,
      };
      if (editing == null) {
        createDocument(d);
      } else {
        updateDocument(d);
      }
      setQType(null);
    }
  }

  function addMCQuestion() {
    const q = mcq.current.value;
    if (q !== "" && choices.length > 1) {
      const d = {
        Question: q,
        Column: q
          .replaceAll(" ", "_")
          .substring(0, q.length > 60 ? 60 : q.length),
        Required: rq.current.value,
        DataType: mcdt.current.value,
        QuestionType: "Multiple Choice",
        Choices: choices, // 'choices' should be an array containing multiple choices
        TableName: props.data.DataTableName,
      };
      if (editing == null) {
        createDocument(d);
      } else {
        updateDocument(d);
      }
      setQType(null);
    }
  }

  function addLocationQuestion() {
    const dataType = "DECIMAL";
    const tableName = props.data.DataTableName;

    // Create Latitude question
    const d = {
      Question: mcq.current.value,
      Column: "geom",
      Required: "Yes",
      DataType: dataType,
      QuestionType: "Location",
      Choices: [],
      TableName: tableName,
    };

    if (editing == null) {
      const index = body
        .map((e) => {
          return e?.Column;
        })
        .indexOf("geom");
      if (index !== -1) return setError("Location is already defined");
      createDocument(d);
    } else {
      updateDocument(d);
    }
    setQType(null);
  }

  function addDateQuestion() {
    const q = dq.current.value;
    if (q !== "") {
      const d = {
        Question: q,
        Column: q
          .replaceAll(" ", "_")
          .substring(0, q.length > 60 ? 60 : q.length),
        Required: rq.current.value,
        DataType: "DATE",
        QuestionType: "Date",
        Choices: [],
        TableName: props.data.DataTableName,
      };
      if (editing == null) {
        createDocument(d);
      } else {
        updateDocument(d);
      }
      setQType(null);
    }
  }

  const QItem = (params) => {
    const [chs, setChs] = useState("");
    const [index, setIndex] = useState(params.item.Order);

    useEffect(() => {
      let d = "";
      params.item.Choices.map((e) => {
        if (d === "") d += e;
        else d += ", " + e;
      });
      setChs(d);
    }, []);

    useEffect(() => {
      fetch(`/api/questions/${params.item.ID}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ Order: params.index + 1 }),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else throw Error("");
        })
        .then((data) => {
          setIndex(params.index + 1);
        })
        .catch((err) => {});
    }, [order]);

    const deleteQuestion = () => {
      setError("");
      setLoading(true);
      fetch(`/api/questions/${params.item.ID}`, {
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
          removeItem(params.item.ID);
          setRefresh(!refresh);
        })
        .catch((err) => {
          setLoading(false);
          setError("Oops! Something went wrong!");
        });
    };

    const removeItem = (idToRemove) => {
      const updatedItems = [...body];
      const indexToRemove = updatedItems.findIndex(
        (item) => item.id === idToRemove
      );
      if (indexToRemove !== -1) {
        updatedItems.splice(indexToRemove, 1);

        setBody(updatedItems);
      }
    };

    function getQType(txt) {
      switch (txt) {
        case "Short Answer":
          return "Q1";
        case "Long Answer":
          return "Q2";
        case "Single Choice":
          return "Q3";
        case "Multiple Choice":
          return "Q4";
        case "Date":
          return "Q5";
        case "Location":
          return "Q6";
        default:
          return "";
      }
    }

    return (
      <div
        className="qitem"
        style={{
          backgroundColor: editing == params.item.ID ? "wheat" : "transparent",
        }}
      >
        <FontAwesomeIcon
          onClick={() => {
            deleteQuestion();
          }}
          icon={faTimes}
          className="fa-times"
        />
        <FontAwesomeIcon
          onClick={() => {
            setEditing(params.item.ID);
            setQType(getQType(params.item.QuestionType));
          }}
          icon={faEdit}
          className="fa-edit"
        />
        <FontAwesomeIcon
          onClick={() => {
            moveCard(params.index, 1);
          }}
          icon={faAngleDoubleDown}
          className="fa-movedown"
        />
        <FontAwesomeIcon
          onClick={() => {
            moveCard(params.index, -1);
          }}
          icon={faAngleDoubleUp}
          className="fa-moveup"
        />
        <label>{index}</label>
        <div>
          <h3>{params.item.Question}</h3>
          <p>{params.item.QuestionType}</p>
        </div>
        <div>
          <h5>Required</h5>
          <p>{params.item.Required}</p>
        </div>
        <div>
          <h5>Data Type</h5>
          <p>{params.item.DataType}</p>
        </div>
        <div>
          {chs != "" && <h5>Choices</h5>}
          <p>{chs}</p>
        </div>

        <h5></h5>
      </div>
    );
  };

  useEffect(() => {
    console.log(mydata, body);
    if (mydata != null && !arraysAreEqual(mydata, body)) {
      createTable();
    }
  }, [mydata, body]);

  function arraysAreEqual(arr1, arr2) {
    // Check if arrays are of same length
    if (arr1.length !== arr2.length) {
      return false;
    }

    // Sort the arrays based on some unique property (like id)
    arr1.sort((a, b) => a.Order - b.Order);
    arr2.sort((a, b) => a.Order - b.Order);

    // Compare each element of the arrays
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i]?.ID !== arr2[i]?.ID) {
        return false;
      }
      if (arr1[i]?.Question !== arr2[i]?.Question) {
        return false;
      }
      if (arr1[i]?.DataType !== arr2[i]?.DataType) {
        return false;
      }
      if (arr1[i]?.Order !== arr2[i]?.Order) {
        return false;
      }
      if (arr1[i]?.Required !== arr2[i]?.Required) {
        return false;
      }
    }
    return true;
  }

  const Choice = (params) => {
    function removeItem() {
      const newArray = [...choices];
      newArray.splice(params.index, 1);
      setChoices(newArray);
    }

    return (
      <div className="ch">
        <label htmlFor="">{params.index + 1}</label>
        <h3>{params.item}</h3>
        <FontAwesomeIcon
          onClick={() => {
            removeItem();
          }}
          icon={faTimes}
        />
      </div>
    );
  };

  function createTable() {
    setError("");
    setLoading(true);
    fetch(`/api/toolslist/createtable`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        columns: body,
        TableName: props.data.DataTableName,
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else throw Error("");
      })
      .then((data) => {
        if (data.success) setError(data.success);
        else setError(data.error);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError("Oops! Something went wrong!");
      });
  }

  const moveCard = (currentIndex, direction) => {
    const newIndex = currentIndex + direction;
    if (newIndex < 0 || newIndex >= body.length) {
      return;
    }
    const newItems = [...body];

    [newItems[currentIndex], newItems[newIndex]] = [
      newItems[newIndex],
      newItems[currentIndex],
    ];
    // Update the "Order" attribute of the items
    newItems[currentIndex].Order = newIndex;
    newItems[newIndex].Order = currentIndex;
    setBody(newItems);
  };

  return (
    <div>
      <h4>Form Questions</h4>
      <hr />

      <div className="flist">
        {body &&
          body?.length > 0 &&
          body?.map((item, i) => {
            return <QItem key={i} id={item.Order} item={item} index={i} />;
          })}
      </div>
      <h6>{error}</h6>
      {qtype === "Q1" && (
        <div className="simple">
          <h4>Short Answer Question</h4>
          <FontAwesomeIcon
            onClick={() => {
              setQType(null);
              setEditing(null);
            }}
            className="fa-times"
            icon={faTimes}
          />
          <div className="div12">
            <Input
              value={
                editing != null
                  ? body[
                      body
                        .map((e) => {
                          return e.ID;
                        })
                        .indexOf(editing)
                    ]?.Question
                  : ""
              }
              ref={sq}
              label="Question"
            />
            <Select
              value={
                editing != null
                  ? body[
                      body
                        .map((e) => {
                          return e.ID;
                        })
                        .indexOf(editing)
                    ]?.Required
                  : "No"
              }
              ref={rq}
              label="Required"
              data={["Yes", "No"]}
            />
            <Select
              ref={sdt}
              value={
                editing != null
                  ? body[
                      body
                        .map((e) => {
                          return e.ID;
                        })
                        .indexOf(editing)
                    ]?.DataType
                  : "TEXT"
              }
              label="Data Type"
              data={["TEXT", "INTEGER", "DECIMAL", "DATE"]}
            />
          </div>
          <p
            onClick={() => {
              addSimpleQuestion();
            }}
          >
            {editing == null ? "Add Question" : "Update Question"}
          </p>
        </div>
      )}
      {qtype === "Q2" && (
        <div className="simple">
          <h4>Long Answer Question</h4>
          <FontAwesomeIcon
            onClick={() => {
              setQType(null);
              setEditing(null);
            }}
            className="fa-times"
            icon={faTimes}
          />
          <div className="div12">
            <Input
              value={
                editing != null
                  ? body[
                      body
                        .map((e) => {
                          return e.ID;
                        })
                        .indexOf(editing)
                    ]?.Question
                  : ""
              }
              ref={lq}
              label="Question"
            />
            <Select
              value={
                editing != null
                  ? body[
                      body
                        .map((e) => {
                          return e.ID;
                        })
                        .indexOf(editing)
                    ]?.Required
                  : "No"
              }
              ref={rq}
              label="Required"
              data={["Yes", "No"]}
            />
          </div>

          <p
            onClick={() => {
              addLongQuestion();
            }}
          >
            {editing == null ? "Add Question" : "Update Question"}
          </p>
        </div>
      )}
      {qtype === "Q3" && (
        <div className="simple">
          <h4>Single Choice Question</h4>
          <FontAwesomeIcon
            onClick={() => {
              setQType(null);
              setEditing(null);
            }}
            className="fa-times"
            icon={faTimes}
          />
          <div className="div12">
            <Input
              value={
                editing != null
                  ? body[
                      body
                        .map((e) => {
                          return e.ID;
                        })
                        .indexOf(editing)
                    ]?.Question
                  : ""
              }
              ref={mcq}
              label="Question"
            />
            <Select
              value={
                editing != null
                  ? body[
                      body
                        .map((e) => {
                          return e.ID;
                        })
                        .indexOf(editing)
                    ]?.Required
                  : "No"
              }
              ref={rq}
              label="Required"
              data={["Yes", "No"]}
            />
            <Select
              ref={mcdt}
              value={
                editing != null
                  ? body[
                      body
                        .map((e) => {
                          return e.ID;
                        })
                        .indexOf(editing)
                    ]?.DataType
                  : "TEXT"
              }
              label="Data Type"
              data={["TEXT", "INTEGER", "DECIMAL", "DATE"]}
            />
          </div>

          <div className="chlist">
            {choices.length > 0 &&
              choices.map((item, i) => {
                return <Choice key={i} item={item} index={i} />;
              })}
          </div>

          <div className="div1auto">
            <Input ref={ch} label="Add Option" />
            <FontAwesomeIcon
              onClick={() => {
                const q = ch.current.value;
                if (q !== "") {
                  setChoices([...choices, q]);
                }
              }}
              className="add"
              icon={faPlusSquare}
            />
          </div>

          <p
            onClick={() => {
              addSCQuestion();
            }}
          >
            {editing == null ? "Add Question" : "Update Question"}
          </p>
        </div>
      )}
      {qtype === "Q4" && (
        <div className="simple">
          <h4>Multiple Choice Question</h4>
          <FontAwesomeIcon
            onClick={() => {
              setQType(null);
              setEditing(null);
            }}
            className="fa-times"
            icon={faTimes}
          />
          <div className="div12">
            <Input
              value={
                editing != null
                  ? body[
                      body
                        .map((e) => {
                          return e.ID;
                        })
                        .indexOf(editing)
                    ]?.Question
                  : ""
              }
              ref={mcq}
              label="Question"
            />
            <Select
              value={
                editing != null
                  ? body[
                      body
                        .map((e) => {
                          return e.ID;
                        })
                        .indexOf(editing)
                    ]?.Required
                  : "No"
              }
              ref={rq}
              label="Required"
              data={["Yes", "No"]}
            />
            <Select
              ref={mcdt}
              value={
                editing != null
                  ? body[
                      body
                        .map((e) => {
                          return e.ID;
                        })
                        .indexOf(editing)
                    ]?.DataType
                  : "TEXT"
              }
              label="Data Type"
              data={["TEXT", "INTEGER", "DECIMAL", "DATE"]}
            />
          </div>

          <div className="chlist">
            {choices.length > 0 &&
              choices.map((item, i) => {
                return <Choice key={i} item={item} index={i} />;
              })}
          </div>

          <div className="div1auto">
            <Input ref={ch} label="Add Option" />
            <FontAwesomeIcon
              onClick={() => {
                const q = ch.current.value;
                if (q !== "") {
                  setChoices([...choices, q]);
                }
              }}
              className="add"
              icon={faPlusSquare}
            />
          </div>

          <p
            onClick={() => {
              addMCQuestion();
            }}
          >
            {editing == null ? "Add Question" : "Update Question"}
          </p>
        </div>
      )}
      {qtype === "Q5" && (
        <div className="simple">
          <h4>Date Question</h4>
          <FontAwesomeIcon
            onClick={() => {
              setQType(null);
              setEditing(null);
            }}
            className="fa-times"
            icon={faTimes}
          />
          <div className="div12">
            <Input
              value={
                editing != null
                  ? body[
                      body
                        .map((e) => {
                          return e.ID;
                        })
                        .indexOf(editing)
                    ]?.Question
                  : ""
              }
              ref={dq}
              label="Question"
            />
            <Select
              value={
                editing != null
                  ? body[
                      body
                        .map((e) => {
                          return e.ID;
                        })
                        .indexOf(editing)
                    ]?.Required
                  : "No"
              }
              ref={rq}
              label="Required"
              data={["Yes", "No"]}
            />
          </div>

          <p
            onClick={() => {
              addDateQuestion();
            }}
          >
            {editing == null ? "Add Question" : "Update Question"}
          </p>
        </div>
      )}
      {qtype === "Q6" && (
        <div className="simple">
          <h4>Location Question (Latitude,Longitude)</h4>
          <FontAwesomeIcon
            onClick={() => {
              setQType(null);
              setEditing(null);
            }}
            className="fa-times"
            icon={faTimes}
          />
          <Input
            value={
              editing != null
                ? body[
                    body
                      .map((e) => {
                        return e.ID;
                      })
                      .indexOf(editing)
                  ]?.Question
                : ""
            }
            ref={mcq}
            label="Question"
          />

          <p
            onClick={() => {
              addLocationQuestion();
            }}
          >
            {editing == null ? "Add Question" : "Update Question"}
          </p>
        </div>
      )}
      <hr />
      <div className="choices">
        <div
          onClick={() => {
            setQType("Q1");
          }}
        >
          <FontAwesomeIcon className="fas" icon={faPlusCircle} />
          <p>Short Answer Questions</p>
        </div>
        <div
          onClick={() => {
            setQType("Q2");
          }}
        >
          <FontAwesomeIcon className="fas" icon={faPlusCircle} />
          <p>Long Answer Questions</p>
        </div>
        <div
          onClick={() => {
            setQType("Q3");
          }}
        >
          <FontAwesomeIcon className="fas" icon={faPlusCircle} />
          <p>Single Choice Questions</p>
        </div>
        <div
          onClick={() => {
            setQType("Q4");
          }}
        >
          <FontAwesomeIcon className="fas" icon={faPlusCircle} />
          <p>Multiple Choice Questions</p>
        </div>
        <div
          onClick={() => {
            setQType("Q5");
          }}
        >
          <FontAwesomeIcon className="fas" icon={faPlusCircle} />
          <p>Date Question</p>
        </div>
        <div
          onClick={() => {
            setQType("Q6");
          }}
        >
          <FontAwesomeIcon className="fas" icon={faPlusCircle} />
          <p>Location</p>
        </div>
      </div>

      {loading && <Loading />}
    </div>
  );
}
