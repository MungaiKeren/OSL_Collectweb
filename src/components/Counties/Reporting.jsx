import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import RippleLoading from "../Util/RippleLoading.jsx";
import Select from "../Util/Select.jsx";

export default function Reporting(props) {
  const { getMonths } = require("../../assets/data/data.js");
  const [data, setData] = useState([]);
  const [year, setYear] = useState(null);
  const [today, setToday] = useState("");
  const [month, setMonth] = useState(null);
  const [mm, setMM] = useState([]);
  const [dd, setDD] = useState([]);

  useEffect(() => {
    const date = new Date().toISOString().split("T")[0].split("-");
    setYear(date[0]);
    const d = new Date().toISOString().split("T")[0];
    setToday(d);
    const mi = getMonths
      .map((item) => {
        return item.code;
      })
      .indexOf(date[1]);
    if (mi !== -1) {
      setMonth(getMonths[mi].month);
    }
  }, []);

  useEffect(() => {
    if (dd.length == 0 && year != null && month != null) {
      let d = [];
      getMonths.map((item) => {
        d.push(item["month"]);
      });
      setMM(d);
      const mi = getMonths
        .map((item) => {
          return item.month;
        })
        .indexOf(month);

      if (mi !== -1) {
        let x = [];
        for (let index = 1; index < getMonths[mi].days + 1; index++) {
          if (index === 1) {
            const d = new Date(`${year}-${getMonths[mi].code}-01`);

            for (let index = 0; index < d.getDay(); index++) {
              x.push(null);
            }
            const dd = index < 10 ? "0" + index : index.toString();
            const date =
              year.toString() + "-" + getMonths[mi].code.toString() + "-" + dd;
            x.push({
              date: date,
            });
          } else {
            const dd = index < 10 ? "0" + index : index.toString();
            const date =
              year.toString() + "-" + getMonths[mi].code.toString() + "-" + dd;
            x.push({
              date: date,
            });
          }
        }
        if (x.length < 35) {
          const size = 35 - x.length;
          for (let index = 0; index < size; index++) {
            x.push(null);
          }
        }
        setDD(x);
      }
    }
  }, [month, year, props.refresh, dd.length, getMonths]);

  useEffect(() => {
    if (props.download && data) {
      downloadCSV(data, "monthly work plan summary.csv");
      props.setDownload(false);
    }
  }, [props.download]);

  function downloadCSV(jsonArray, filename) {
    const headerRow = Object.keys(jsonArray[0]).join(",") + "\n";
    const csvContent = jsonArray
      .map((row) => {
        return Object.values(row).join(",");
      })
      .join("\n");
    const fullCSV = headerRow + csvContent;
    const blob = new Blob([fullCSV], { type: "text/csv" });
    const downloadLink = document.createElement("a");
    downloadLink.href = window.URL.createObjectURL(blob);
    downloadLink.download = filename;
    downloadLink.click();
  }

  return (
    <div className="reporting">
      <div className="rmonth">
        <h4>Calendar View</h4>
        <Select
          setChanged={(v) => {
            setDD([]);
            setMonth(v);
          }}
          data={mm}
          value={month}
        />
        <Select
          setChanged={(v) => {
            setDD([]);
            setYear(v);
          }}
          value={year}
          data={["2023", "2024", "2025", "2026"]}
        />
      </div>
      <div className="mlist">
        <div className="dow">
          <h4>Sun</h4>
          <h4>Mon</h4>
          <h4>Tue</h4>
          <h4>Wed</h4>
          <h4>Thu</h4>
          <h4>Fri</h4>
          <h4>Sat</h4>
        </div>
        <div className="calendar">
          {dd.map((item, i) => {
            return (
              <Day
                key={"day" + i}
                item={item}
                today={today}
                data={data}
                setData={setData}
              />
            );
          })}
        </div>
      </div>
      <div className="rmonth">
        <h4>Staff Reporting</h4>
      </div>
      {month != null && year != null && (
        <StaffReporting month={month} year={year} />
      )}
    </div>
  );
}

const Day = (props) => {
  const [data, setData] = useState(null);
  const [total, setTotal] = useState(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowingDetails] = useState(false);

  useEffect(() => {
    if (props.item !== null) {
      setLoading(true);
      fetch(`/api/rmf/searchsingledate/${props.item.date}`)
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else throw Error();
        })
        .then((data) => {
          setLoading(false);
          setData(data);
          if (data && data.length > 0) {
            let d = 0;
            let c = [];
            data.map((item) => {
              d += item.count;
              c.push(item.County);
            });
            setTotal(d);
            let uniqueArray = [...new Set(c)];
            setCount(uniqueArray.length);
            let x = props.data;
            x.push(data);
            props.setData(x);
          } else {
            setData(null);
            setTotal(0);
            setCount(0);
          }
        })
        .catch((e) => {
          setData(null);
          setTotal(0);
          setCount(0);
          setLoading(false);
        });
    }
  }, [props, props.item]);

  useEffect(() => {
    if (props?.item?.date.split("-")[2] == 2) {
      console.log(data);
    }
  }, [data]);

  return (
    <>
      {props.item == null ? (
        <div
          style={{
            backgroundColor: "#60606010",
          }}
          className="day mob"
        ></div>
      ) : (
        <div
          onClick={() => {
            setShowingDetails(true);
          }}
          className="day"
          style={{
            backgroundColor:
              total > 0
                ? props.item.date.split("-")[2] < 14
                  ? "#A8CD9F"
                  : "#FFB38E"
                : "#FEECE2",
          }}
        >
          <h6>{props.item.date.split("-")[2]}</h6>

          {data && data?.length > 0 && (
            <>
              <h4>Counties: {count}</h4>
              <h4>Results: {total}</h4>
            </>
          )}
          {loading && <RippleLoading />}
        </div>
      )}
      {showDetails && total > 0 && (
        <DetailsPopup
          setShowing={setShowingDetails}
          item={props.item}
          data={data}
        />
      )}
    </>
  );
};

const DetailsPopup = (props) => {
  return (
    <div className="detspopup">
      <div className="dcard">
        <FontAwesomeIcon
          onClick={() => {
            props.setShowing(false);
          }}
          className="fa-times"
          icon={faXmark}
        />
        <h3>{props.item.date} Results</h3>
        <hr />
        <div className="content">
          {props.data &&
            props.data.length > 0 &&
            props.data.map((item, i) => {
              return <Row key={i} index={i} item={item} />;
            })}
        </div>
      </div>
    </div>
  );
};

const Row = (props) => {
  return (
    <div className="row">
      <h6>{props.index + 1}</h6>
      <p>
        <b>{props.item.County}</b>
      </p>
      <p>{props.item.WKWPRepName}</p>
      <p>{props.item.count}</p>
    </div>
  );
};

const StaffReporting = (props) => {
  const [data, setData] = useState(null);

  function getMonthNumber(monthName) {
    const months = {
      January: 1,
      February: 2,
      March: 3,
      April: 4,
      May: 5,
      June: 6,
      July: 7,
      August: 8,
      September: 9,
      October: 10,
      November: 11,
      December: 12,
    };

    // Convert month name to title case to match the keys in the months object
    const titleCaseMonthName =
      monthName.charAt(0).toUpperCase() + monthName.slice(1).toLowerCase();

    return months[titleCaseMonthName];
  }

  useEffect(() => {
    fetch(`/api/rmf/userreporting/${getMonthNumber(props.month)}/${props.year}`)
      .then((res) => {
        if (res.ok) return res.json();
        else throw Error();
      })
      .then((data) => {
        setData(data);
      })
      .catch((e) => {});
  }, [props.year, props.month]);

  return (
    <div className="slist">
      <div className="head">
        <h4>No.</h4>
        <h4>Name</h4>
        <h4>Designation</h4>
        <h4>County</h4>
        <h4>Target</h4>
        <h4>On Time</h4>
        <h4>Late</h4>
        <h4>Pending</h4>
      </div>
      {}
      <div className="body">
        {data &&
          data.length > 0 &&
          data.map((item, i) => {
            return (
              <div key={i} className="row">
                <h6>{i + 1}</h6>
                <p>{item.Name}</p>
                <p>{item.Position}</p>
                <p>{item.County}</p>
                <p>{item.Position == "Rural Water Specialist" ? 25 : 1}</p>
                <p>{item.OnTime}</p>
                <p>{item.Late}</p>
                <p>
                  {item.Position == "Rural Water Specialist"
                    ? Math.round(((item.OnTime + item.Late) / 25) * 100)
                    : Math.round(((item.OnTime + item.Late) / 1) * 100)}
                  %
                </p>
              </div>
            );
          })}
      </div>
    </div>
  );
};
