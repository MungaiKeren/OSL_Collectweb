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
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Stack,
  Grid,
  Divider,
  useTheme,
  Tooltip,
  TextField,
  MenuItem,
} from "@mui/material";

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
  const theme = useTheme();

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
      <Paper
        elevation={editing == params.item.ID ? 6 : 2}
        sx={{
          display: "flex",
          alignItems: "center",
          p: 2,
          mb: 2,
          background:
            editing == params.item.ID
              ? theme.palette.secondary.light
              : theme.palette.background.paper,
          border:
            editing == params.item.ID
              ? `2px solid ${theme.palette.secondary.main}`
              : `1px solid ${theme.palette.grey[200]}`,
          transition: "box-shadow 0.2s, border 0.2s, background 0.2s",
        }}
      >
        <Stack
          direction="column"
          spacing={1}
          alignItems="center"
          sx={{ mr: 2 }}
        >
          <Tooltip title="Delete">
            <IconButton onClick={deleteQuestion} color="error" size="small">
              <FontAwesomeIcon icon={faTimes} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton
              onClick={() => {
                setEditing(params.item.ID);
                setQType(getQType(params.item.QuestionType));
              }}
              color="primary"
              size="small"
            >
              <FontAwesomeIcon icon={faEdit} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Move Down">
            <IconButton
              onClick={() => {
                moveCard(params.index, 1);
              }}
              color="secondary"
              size="small"
            >
              <FontAwesomeIcon icon={faAngleDoubleDown} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Move Up">
            <IconButton
              onClick={() => {
                moveCard(params.index, -1);
              }}
              color="secondary"
              size="small"
            >
              <FontAwesomeIcon icon={faAngleDoubleUp} />
            </IconButton>
          </Tooltip>
        </Stack>
        <Box sx={{ flex: 1 }}>
          <Stack direction="row" alignItems="center" spacing={2} mb={1}>
            <Typography
              variant="subtitle2"
              color={theme.palette.text.secondary}
            >
              #{params.index + 1}
            </Typography>
            <Typography
              variant="h6"
              color={theme.palette.primary.main}
              fontWeight={600}
            >
              {params.item.Question}
            </Typography>
            <Typography variant="body2" color={theme.palette.text.secondary}>
              {params.item.QuestionType}
            </Typography>
          </Stack>
          <Grid container spacing={1}>
            <Grid item xs={6} sm={3}>
              <Typography
                variant="caption"
                color={theme.palette.text.secondary}
              >
                <b>Required:</b> {params.item.Required}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography
                variant="caption"
                color={theme.palette.text.secondary}
              >
                <b>Data Type:</b> {params.item.DataType}
              </Typography>
            </Grid>
            {params.item.Choices && params.item.Choices.length > 0 && (
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="caption"
                  color={theme.palette.text.secondary}
                >
                  <b>Choices:</b> {params.item.Choices.join(", ")}
                </Typography>
              </Grid>
            )}
          </Grid>
        </Box>
      </Paper>
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
    <Box>
      <Typography
        variant="h6"
        fontWeight={600}
        color={theme.palette.primary.main}
        mb={1}
      >
        Form Questions
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Box>
        {body &&
          body?.length > 0 &&
          body?.map((item, i) => (
            <QItem key={i} id={item.Order} item={item} index={i} />
          ))}
      </Box>
      {error && (
        <Typography color="error" variant="body2" mt={1}>
          {error}
        </Typography>
      )}
      {/* Add/Edit Question Forms */}
      {qtype === "Q1" && (
        <Paper sx={{ p: 2, mt: 2, mb: 2 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{ color: theme.palette.primary.main }}
            >
              Short Answer Question
            </Typography>
            <IconButton
              onClick={() => {
                setQType(null);
                setEditing(null);
              }}
              color="error"
              size="small"
            >
              <FontAwesomeIcon icon={faTimes} />
            </IconButton>
          </Stack>
          <Grid container spacing={2} mt={1}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Question"
                inputRef={sq}
                defaultValue={
                  editing != null
                    ? body[body.map((e) => e.ID).indexOf(editing)]?.Question
                    : ""
                }
                fullWidth
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                label="Required"
                inputRef={rq}
                select
                defaultValue={
                  editing != null
                    ? body[body.map((e) => e.ID).indexOf(editing)]?.Required
                    : "No"
                }
                fullWidth
                size="small"
              >
                {["Yes", "No"].map((option, idx) => (
                  <MenuItem key={idx} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                label="Data Type"
                inputRef={sdt}
                select
                defaultValue={
                  editing != null
                    ? body[body.map((e) => e.ID).indexOf(editing)]?.DataType
                    : "TEXT"
                }
                fullWidth
                size="small"
              >
                {["TEXT", "INTEGER", "DECIMAL", "DATE"].map((option, idx) => (
                  <MenuItem key={idx} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Button
                onClick={addSimpleQuestion}
                variant="contained"
                color="secondary"
                sx={{ fontWeight: 600 }}
              >
                {editing == null ? "Add Question" : "Update Question"}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}
      {qtype === "Q2" && (
        <Paper sx={{ p: 2, mt: 2, mb: 2 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{ color: theme.palette.primary.main }}
            >
              Long Answer Question
            </Typography>
            <IconButton
              onClick={() => {
                setQType(null);
                setEditing(null);
              }}
              color="error"
              size="small"
            >
              <FontAwesomeIcon icon={faTimes} />
            </IconButton>
          </Stack>
          <Grid container spacing={2} mt={1}>
            <Grid size={{ xs: 12, sm: 8 }}>
              <TextField
                label="Question"
                inputRef={lq}
                defaultValue={
                  editing != null
                    ? body[body.map((e) => e.ID).indexOf(editing)]?.Question
                    : ""
                }
                fullWidth
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Required"
                inputRef={rq}
                select
                defaultValue={
                  editing != null
                    ? body[body.map((e) => e.ID).indexOf(editing)]?.Required
                    : "No"
                }
                fullWidth
                size="small"
              >
                {["Yes", "No"].map((option, idx) => (
                  <MenuItem key={idx} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Button
                onClick={addLongQuestion}
                variant="contained"
                color="secondary"
                sx={{ fontWeight: 600 }}
              >
                {editing == null ? "Add Question" : "Update Question"}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}
      {qtype === "Q3" && (
        <Paper sx={{ p: 2, mt: 2, mb: 2 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{ color: theme.palette.primary.main }}
            >
              Single Choice Question
            </Typography>
            <IconButton
              onClick={() => {
                setQType(null);
                setEditing(null);
              }}
              color="error"
              size="small"
            >
              <FontAwesomeIcon icon={faTimes} />
            </IconButton>
          </Stack>
          <Grid container spacing={2} mt={1}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Question"
                inputRef={mcq}
                defaultValue={
                  editing != null
                    ? body[body.map((e) => e.ID).indexOf(editing)]?.Question
                    : ""
                }
                fullWidth
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                label="Required"
                inputRef={rq}
                select
                defaultValue={
                  editing != null
                    ? body[body.map((e) => e.ID).indexOf(editing)]?.Required
                    : "No"
                }
                fullWidth
                size="small"
              >
                {["Yes", "No"].map((option, idx) => (
                  <MenuItem key={idx} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                label="Data Type"
                inputRef={mcdt}
                select
                defaultValue={
                  editing != null
                    ? body[body.map((e) => e.ID).indexOf(editing)]?.DataType
                    : "TEXT"
                }
                fullWidth
                size="small"
              >
                {["TEXT", "INTEGER", "DECIMAL", "DATE"].map((option, idx) => (
                  <MenuItem key={idx} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                flexWrap="wrap"
              >
                {choices.length > 0 &&
                  choices.map((item, i) => (
                    <Paper
                      key={i}
                      sx={{
                        px: 2,
                        py: 0.5,
                        mr: 1,
                        mb: 1,
                        display: "flex",
                        alignItems: "center",
                        background: theme.palette.grey[100],
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ mr: 1, color: theme.palette.primary.main }}
                      >
                        {item}
                      </Typography>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => {
                          const newArray = [...choices];
                          newArray.splice(i, 1);
                          setChoices(newArray);
                        }}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </IconButton>
                    </Paper>
                  ))}
                <TextField
                  inputRef={ch}
                  label="Add Option"
                  size="small"
                  sx={{ minWidth: 120 }}
                />
                <IconButton
                  color="secondary"
                  onClick={() => {
                    const q = ch.current.value;
                    if (q !== "") {
                      setChoices([...choices, q]);
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faPlusSquare} />
                </IconButton>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Button
                onClick={addSCQuestion}
                variant="contained"
                color="secondary"
                sx={{ fontWeight: 600 }}
              >
                {editing == null ? "Add Question" : "Update Question"}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}
      {qtype === "Q4" && (
        <Paper sx={{ p: 2, mt: 2, mb: 2 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{ color: theme.palette.primary.main }}
            >
              Multiple Choice Question
            </Typography>
            <IconButton
              onClick={() => {
                setQType(null);
                setEditing(null);
              }}
              color="error"
              size="small"
            >
              <FontAwesomeIcon icon={faTimes} />
            </IconButton>
          </Stack>
          <Grid container spacing={2} mt={1}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Question"
                inputRef={mcq}
                defaultValue={
                  editing != null
                    ? body[body.map((e) => e.ID).indexOf(editing)]?.Question
                    : ""
                }
                fullWidth
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                label="Required"
                inputRef={rq}
                select
                defaultValue={
                  editing != null
                    ? body[body.map((e) => e.ID).indexOf(editing)]?.Required
                    : "No"
                }
                fullWidth
                size="small"
              >
                {["Yes", "No"].map((option, idx) => (
                  <MenuItem key={idx} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                label="Data Type"
                inputRef={mcdt}
                select
                defaultValue={
                  editing != null
                    ? body[body.map((e) => e.ID).indexOf(editing)]?.DataType
                    : "TEXT"
                }
                fullWidth
                size="small"
              >
                {["TEXT", "INTEGER", "DECIMAL", "DATE"].map((option, idx) => (
                  <MenuItem key={idx} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                flexWrap="wrap"
              >
                {choices.length > 0 &&
                  choices.map((item, i) => (
                    <Paper
                      key={i}
                      sx={{
                        px: 2,
                        py: 0.5,
                        mr: 1,
                        mb: 1,
                        display: "flex",
                        alignItems: "center",
                        background: theme.palette.grey[100],
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ mr: 1, color: theme.palette.primary.main }}
                      >
                        {item}
                      </Typography>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => {
                          const newArray = [...choices];
                          newArray.splice(i, 1);
                          setChoices(newArray);
                        }}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </IconButton>
                    </Paper>
                  ))}
                <TextField
                  inputRef={ch}
                  label="Add Option"
                  size="small"
                  sx={{ minWidth: 120 }}
                />
                <IconButton
                  color="secondary"
                  onClick={() => {
                    const q = ch.current.value;
                    if (q !== "") {
                      setChoices([...choices, q]);
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faPlusSquare} />
                </IconButton>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Button
                onClick={addMCQuestion}
                variant="contained"
                color="secondary"
                sx={{ fontWeight: 600 }}
              >
                {editing == null ? "Add Question" : "Update Question"}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}
      {qtype === "Q5" && (
        <Paper sx={{ p: 2, mt: 2, mb: 2 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{ color: theme.palette.primary.main }}
            >
              Date Question
            </Typography>
            <IconButton
              onClick={() => {
                setQType(null);
                setEditing(null);
              }}
              color="error"
              size="small"
            >
              <FontAwesomeIcon icon={faTimes} />
            </IconButton>
          </Stack>
          <Grid container spacing={2} mt={1}>
            <Grid size={{ xs: 12, sm: 8 }}>
              <TextField
                label="Question"
                inputRef={dq}
                defaultValue={
                  editing != null
                    ? body[body.map((e) => e.ID).indexOf(editing)]?.Question
                    : ""
                }
                fullWidth
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Required"
                inputRef={rq}
                select
                defaultValue={
                  editing != null
                    ? body[body.map((e) => e.ID).indexOf(editing)]?.Required
                    : "No"
                }
                fullWidth
                size="small"
              >
                {["Yes", "No"].map((option, idx) => (
                  <MenuItem key={idx} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Button
                onClick={addDateQuestion}
                variant="contained"
                color="secondary"
                sx={{ fontWeight: 600 }}
              >
                {editing == null ? "Add Question" : "Update Question"}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}
      {qtype === "Q6" && (
        <Paper sx={{ p: 2, mt: 2, mb: 2 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{ color: theme.palette.primary.main }}
            >
              Location Question (Latitude,Longitude)
            </Typography>
            <IconButton
              onClick={() => {
                setQType(null);
                setEditing(null);
              }}
              color="error"
              size="small"
            >
              <FontAwesomeIcon icon={faTimes} />
            </IconButton>
          </Stack>
          <Grid container spacing={2} mt={1}>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Question"
                inputRef={mcq}
                defaultValue={
                  editing != null
                    ? body[body.map((e) => e.ID).indexOf(editing)]?.Question
                    : ""
                }
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                onClick={addLocationQuestion}
                variant="contained"
                color="secondary"
                sx={{ fontWeight: 600 }}
              >
                {editing == null ? "Add Question" : "Update Question"}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}
      <Divider sx={{ my: 3 }} />
      <Grid container spacing={2} justifyContent="center">
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            startIcon={<FontAwesomeIcon className="fas" icon={faPlusCircle} />}
            onClick={() => setQType("Q1")}
            sx={{ mb: 1, fontWeight: 600 }}
          >
            Short Answer Questions
          </Button>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            startIcon={<FontAwesomeIcon className="fas" icon={faPlusCircle} />}
            onClick={() => setQType("Q2")}
            sx={{ mb: 1, fontWeight: 600 }}
          >
            Long Answer Questions
          </Button>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            startIcon={<FontAwesomeIcon className="fas" icon={faPlusCircle} />}
            onClick={() => setQType("Q3")}
            sx={{ mb: 1, fontWeight: 600 }}
          >
            Single Choice Questions
          </Button>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            startIcon={<FontAwesomeIcon className="fas" icon={faPlusCircle} />}
            onClick={() => setQType("Q4")}
            sx={{ mb: 1, fontWeight: 600 }}
          >
            Multiple Choice Questions
          </Button>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            startIcon={<FontAwesomeIcon className="fas" icon={faPlusCircle} />}
            onClick={() => setQType("Q5")}
            sx={{ mb: 1, fontWeight: 600 }}
          >
            Date Question
          </Button>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            startIcon={<FontAwesomeIcon className="fas" icon={faPlusCircle} />}
            onClick={() => setQType("Q6")}
            sx={{ mb: 1, fontWeight: 600 }}
          >
            Location
          </Button>
        </Grid>
      </Grid>
      {loading && <Loading />}
    </Box>
  );
}
