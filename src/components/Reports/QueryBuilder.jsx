import { faAdd, faDownload, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import Input from "../Util/Input";
import Loading from "../Util/Loading";
import Select from "../Util/Select";
import Button from "../Util/Button";

export default function QueryBuilder(props) {
  const [loading, setLoading] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [original, setOriginal] = useState(null);
  const [data, setData] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [tables, setTables] = useState([]);
  const [cols, setCols] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filters, setFilters] = useState([]);
  const [offset, setOffset] = useState(0);
  const col = useRef();
  const op = useRef();
  const vl = useRef();

  function addFilter() {
    const cl = col.current.value;
    const o = op.current.value;
    const v = vl.current.value;
    if (cl !== "" && o !== "" && v !== "") {
      let d = {
        column: cl,
        operator: o,
        value: v,
      };
      setFilters([...filters, d]);
    }
  }

  useEffect(() => {
    setLoading(true);
    fetch(`/api/myreports/alltables`)
      .then((res) => {
        if (res.ok) return res.json();
        else throw Error("");
      })
      .then((data) => {
        setLoading(false);
        setTableData(data);
        const tts = data.map((obj) => obj.table_name);
        setTables(tts);
        setSelected(tts[0]);
      })
      .catch((e) => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selected !== null) {
      setLoading(true);
      const i = tableData
        .map((obj) => {
          return obj.table_name;
        })
        .indexOf(selected);

      fetch(
        `/api/myreports/tablecolumns/${selected}/${tableData[i].table_schema}`
      )
        .then((res) => {
          if (res.ok) return res.json();
          else throw Error("");
        })
        .then((data) => {
          setLoading(false);
          const tts = data.map((obj) => obj.column_name);
          setCols(tts);
        })
        .catch((e) => {
          setLoading(false);
        });
    }
  }, [selected]);

  function getData() {
    setData(null);
    if (selected !== null) {
      const i = tableData
        .map((obj) => {
          return obj.table_name;
        })
        .indexOf(selected);

      setLoading(true);
      fetch(
        `/api/myreports/getdata/${selected}/${tableData[i].table_schema}/${offset}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ filters: filters }),
        }
      )
        .then((res) => {
          if (res.ok) return res.json();
          else throw Error("");
        })
        .then((data) => {
          setLoading(false);
          if (data.length > 0) {
            setOriginal(data);
            let d = [];
            data.forEach((element) => {
              let x = element;
              delete x.geom;
              delete x.id;
              delete x.ID;
              d.push(element);
            });
            setData(d);
          }
        })
        .catch((e) => {
          setLoading(false);
        });
    }
  }

  function downloadCSV(filename, data) {
    if (!Array.isArray(data) || data.length === 0) {
      console.error("Data should be a non-empty array");
      return;
    }

    const columnNames = Object.keys(data[0]); // Extract column names from the first object

    // Construct CSV content with column names as the first row
    let csv = columnNames.join(",") + "\n";
    csv += data
      .map((row) =>
        columnNames
          .map((col) => {
            let value = row[col];
            // If value contains comma, enclose it within double quotes
            if (typeof value === "string" && value.includes(",")) {
              value = `"${value}"`;
            }
            return value;
          })
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="top">
        <h3>Query Builder</h3>
        <hr />

        <div className="div1auto">
          <Select
            setChanged={(v) => {
              setSelected(v);
            }}
            label="Select Data Table"
            data={tables}
            value={selected}
          />
          <div>
            <button
              onClick={() => {
                setReporting(true);
              }}
            >
              Add Filter
            </button>
          </div>
        </div>
        {reporting && (
          <div className="add">
            <Select ref={col} label="Column" data={cols} />
            <Select
              ref={op}
              label="Operator"
              data={["=", ">", ">=", "<", "<=", "ILIKE"]}
            />
            <Input ref={vl} label="Value" />
            <div>
              <FontAwesomeIcon
                onClick={() => {
                  addFilter();
                  setReporting(false);
                }}
                className="btn"
                icon={faAdd}
              />
            </div>
          </div>
        )}

        <div className="div3equal">
          {filters.map((item, i) => {
            return (
              <TItem
                key={i}
                index={i}
                item={item}
                setFilters={setFilters}
                filters={filters}
              />
            );
          })}
        </div>

        <Button
          handleClick={() => {
            getData();
          }}
          value="Retrieve Data"
        />
      </div>{" "}
      <div className="list">
        <div className="div1auto">
          <h4>Filtered Data {data ? "(" + data.length + " records)" : ""}</h4>
          <FontAwesomeIcon
            onClick={() => {
              if (data) {
                downloadCSV("data", original);
              }
            }}
            className="download"
            icon={faDownload}
          />
        </div>
        <div className="data">
          <div className="wrap">
            <table>
              <thead>
                {data &&
                  data.length > 0 &&
                  Object.keys(data[0]).map((item, i) => {
                    return (
                      <th title={item} key={i}>
                        {item}
                      </th>
                    );
                  })}
              </thead>
              <tbody>
                {data &&
                  data.length > 0 &&
                  data.map((item, i) => {
                    return <Item key={i} item={item} />;
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {loading && <Loading />}
    </div>
  );
}

const TItem = (props) => {
  function removeItem() {
    const newArray = [...props.filters];
    newArray.splice(props.index, 1);
    props.setFilters(newArray);
  }
  return (
    <div className="item">
      <p>{props.item.column}</p>
      <p>{props.item.operator}</p>
      <p>{props.item.value}</p>
      <FontAwesomeIcon
        onClick={() => {
          removeItem();
        }}
        icon={faTimes}
        className="fas"
      />
    </div>
  );
};

const Item = (props) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    if (props.item) {
      const d = Object.values(props.item);
      setData(d);
    }
  }, [props.item]);
  return (
    <tr>
      {data.length > 0 &&
        data.map((item, i) => {
          return <td>{item}</td>;
        })}
    </tr>
  );
};
