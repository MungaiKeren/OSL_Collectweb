import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../../Styles/tbquestionnaire.scss";

export default function TBData(props) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const pathname = location.pathname.split("/");

  useEffect(() => {
    if (data == null) {
      setLoading(true);
      fetch(`/api/questions/databytablename/${pathname[3]}`)
        .then((res) => {
          if (res.ok) return res.json();
          else throw Error("");
        })
        .then((data) => {
          setLoading(false);
          setData(data);

          console.log(data);
        })
        .catch((e) => {
          setLoading(false);
        });
    }
  }, []);

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
      <div className="toolbuilder ">
        <div className="new">
          <div className="topbar">
            <h4>{pathname[3]} Table Data</h4>
            <p
              onClick={() => {
                if (data && data.length > 0) {
                  downloadCSV(`${pathname[3]}.csv`, data);
                }
              }}
            >
              <FontAwesomeIcon icon={faDownload} /> Download
            </p>
          </div>
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
    </div>
  );
}

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
