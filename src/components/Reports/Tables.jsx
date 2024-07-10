import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useEffect, useRef, useState } from "react";
import Input from "../Util/Input";
import Loading from "../Util/Loading";
import Select from "../Util/Select";

export default function Tables(props) {
  const [selectedDate, setSelectedDate] = useState(2023);

  return (
    <div>
      <IndicatorComponent
        title="Cross Cutting Indicators"
        url="Cross Cutting"
        link="crosscutting"
      />
      <NRWTable setSelectedDate={setSelectedDate} selectedDate={selectedDate} />
      <WSPOperationsTable
        setSelectedDate={setSelectedDate}
        selectedDate={selectedDate}
      />
      <DrinkingWaterTable
        setSelectedDate={setSelectedDate}
        selectedDate={selectedDate}
      />
      <BODCompositionTable
        setSelectedDate={setSelectedDate}
        selectedDate={selectedDate}
      />
      <TrainingSummaryTable
        setSelectedDate={setSelectedDate}
        selectedDate={selectedDate}
      />
      <LeadershipPositionsTable
        setSelectedDate={setSelectedDate}
        selectedDate={selectedDate}
      />
      <BudgetAllocationTable
        setSelectedDate={setSelectedDate}
        selectedDate={selectedDate}
      />
    </div>
  );
}

const IndicatorComponent = (props) => {
  const [indicators, setIndicators] = useState(null);
  const [data, setData] = useState([]);
  const [Q1, setQ1] = useState(null);
  const [Q2, setQ2] = useState(null);
  const [Q3, setQ3] = useState(null);
  const [Q4, setQ4] = useState(null);
  const [loading, setLoading] = useState(false);
  const tb = useRef();
  const [year, setYear] = useState("2023");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  useEffect(() => {
    const today = new Date();
    setYear(today.getFullYear());
    setStart(`${today.getFullYear() - 1}-10-01`);
    setEnd(`${today.getFullYear()}-09-30`);
    setLoading(true);
    fetch(`/api/indicators`)
      .then((res) => {
        if (res.ok) return res.json();
        else throw Error("");
      })
      .then((data) => {
        setLoading(false);
        setIndicators(data);
      })
      .catch((e) => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (start !== "" && end !== "") {
      setQ1(null);
      setQ2(null);
      setQ3(null);
      setQ4(null);
      executeForQuarters(start, end);
    }
  }, [start, end]);

  useEffect(() => {
    setStart(`${year - 1}-10-01`);
    setEnd(`${year}-09-30`);
  }, [year]);

  function executeForQuarters(startDateStr, endDateStr) {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    const quarters = [
      {
        name: "Q1",
        quarterStart: new Date(`${year - 1}-10-01`),
        quarterEnd: new Date(`${year - 1}-12-31`),
      }, // Oct, Nov, Dec (Previous year)
      {
        name: "Q2",
        quarterStart: new Date(`${year}-01-01`),
        quarterEnd: new Date(`${year}-03-31`),
      }, // Jan, Feb, Mar
      {
        name: "Q3",
        quarterStart: new Date(`${year}-04-01`),
        quarterEnd: new Date(`${year}-06-30`),
      }, // Apr, May, Jun
      {
        name: "Q4",
        quarterStart: new Date(`${year}-07-01`),
        quarterEnd: new Date(`${year}-09-30`),
      }, // Jul, Aug
    ];

    for (var i = 0; i < quarters.length; i++) {
      if (
        (startDate >= quarters[i].quarterStart &&
          startDate <= quarters[i].quarterEnd) ||
        (startDate <= quarters[i].quarterStart &&
          endDate >= quarters[i].quarterEnd)
      ) {
        if (i === 0) {
          getCrossCutting(`${year - 1}-10-01`, `${year - 1}-12-31`, setQ1);
        } else if (i === 1) {
          getCrossCutting(`${year}-01-01`, `${year}-03-31`, setQ2);
        } else if (i === 2) {
          getCrossCutting(`${year}-04-01`, `${year}-06-30`, setQ3);
        } else if (i === 3) {
          getCrossCutting(`${year}-07-01`, `${year}-09-30`, setQ4);
        }
      }
    }
  }

  async function getCrossCutting(start, end, setData) {
    fetch(`/api/rmf/home/crosscutting/null/${start}/${end}`)
      .then((res) => {
        if (res.ok) return res.json();
        else throw Error("");
      })
      .then((dt) => {
        const combinedData = { ...data, ...dt };
        setData(combinedData);
        getUrban(start, end, combinedData, setData);
      })
      .catch((e) => {});
  }
  async function getUrban(start, end, dt1, setData) {
    fetch(`/api/rmf/home/urbancomponent/null/${start}/${end}`)
      .then((res) => {
        if (res.ok) return res.json();
        else throw Error("");
      })
      .then((dt) => {
        const combinedData = { ...dt1, ...dt };
        setData(combinedData);
        getRural(start, end, combinedData, setData);
      })
      .catch((e) => {});
  }

  async function getRural(start, end, dt1, setData) {
    fetch(`/api/rmf/home/ruralcomponent/null/${start}/${end}`)
      .then((res) => {
        if (res.ok) return res.json();
        else throw Error("");
      })
      .then((dt) => {
        const combinedData = { ...dt1, ...dt };
        setData(combinedData);
        getWRM(start, end, combinedData, setData);
      })
      .catch((e) => {});
  }
  async function getWRM(start, end, dt1, setData) {
    fetch(`/api/rmf/home/wrmcomponent/null/${start}/${end}`)
      .then((res) => {
        if (res.ok) return res.json();
        else throw Error("");
      })
      .then((dt) => {
        const combinedData = { ...dt1, ...dt };
        setData(combinedData);
        getFinance(start, end, combinedData, setData);
      })
      .catch((e) => {});
  }

  async function getFinance(start, end, dt1, setData) {
    fetch(`/api/rmf/home/financecomponent/null/${start}/${end}`)
      .then((res) => {
        if (res.ok) return res.json();
        else throw Error("");
      })
      .then((dt) => {
        const combinedData = { ...dt1, ...dt };
        setData(combinedData);
        getPolicy(start, end, combinedData, setData);
      })
      .catch((e) => {});
  }

  async function getPolicy(start, end, dt1, setData) {
    fetch(`/api/rmf/home/policycomponent/null/${start}/${end}`)
      .then((res) => {
        if (res.ok) return res.json();
        else throw Error("");
      })
      .then((dt) => {
        const combinedData = { ...dt1, ...dt };
        setData(combinedData);
      })
      .catch((e) => {});
  }

  return (
    <div className="table">
      <div className="div1auto">
        <h1>{props.title}</h1>
        <div className="filter">
          <Select
            data={["2023", "2024", "2025", "2026", "2027"]}
            value={year}
            setChanged={(v) => {
              setYear(v);
            }}
          />
          <Input
            handleChange={(e) => {
              setStart(e);
            }}
            type="date"
            value={start}
            label="Start Date"
          />
          <Input
            handleChange={(e) => {
              setEnd(e);
            }}
            type="date"
            value={end}
            label="End Date"
          />
          <FontAwesomeIcon
            onClick={() => {
              exportToPDF(props.title, tb.current);
              exportToExcel(props.title, data);
            }}
            className="download"
            icon={faDownload}
          />
        </div>
      </div>
      <table ref={tb}>
        <thead>
          <tr>
            <th>Code</th>
            <th>Indicator</th>
            <th>Target</th>
            <th>Q1</th>
            <th>Q2</th>
            <th>Q3</th>
            <th>Q4</th>
            <th>Total</th>
            <th>Achievement</th>
          </tr>
        </thead>
        <tbody>
          {indicators &&
            indicators?.data &&
            indicators?.data?.length > 0 &&
            indicators?.data?.map((item, i) => {
              return (
                <Item
                  key={i}
                  item={item}
                  Q1={Q1}
                  Q2={Q2}
                  Q3={Q3}
                  Q4={Q4}
                  data={data}
                  setData={setData}
                />
              );
            })}
        </tbody>
      </table>

      {loading && <Loading />}
    </div>
  );
};

function withCommas(x) {
  if (x === null) return 0;

  const p = x?.toString();
  if (p?.indexOf("$") !== -1 || p?.indexOf("%") !== -1) {
    return p?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else {
    if (parseFloat(x) < 1) {
      let o = Math.round(parseFloat(x) * 10) / 10;
      return o?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    let o = Math.round(parseFloat(x));
    return o?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}

const Item = (props) => {
  const [performance, setPerformance] = useState(0);
  const [achievement, setAchievement] = useState(0);

  const updateObject = (newObject) => {
    const index = props.data.findIndex((item) => item.Code === newObject.Code);
    if (index !== -1) {
      const updatedData = [...props.data];
      updatedData[index] = newObject;
      props.setData(updatedData);
    } else {
      props.setData((prevData) => [...prevData, newObject]);
    }
  };

  useEffect(() => {
    const index = props.data.findIndex(
      (item) => item.Code === props?.item?.Code
    );
    let dataItem;
    if (index !== -1) {
      dataItem = props.data[index];
    } else {
      dataItem = {
        Code: props?.item?.Code,
        Indicator: props?.item?.Description,
        Target: props?.item?.Target,
        Q1: 0,
        Q2: 0,
        Q3: 0,
        Q4: 0,
        Total: 0,
        Achievement: 0,
      };
    }
    setPerformance(0);
    setAchievement(0);
    let tt = 0;
    if (props?.Q1 && props?.Q1[props?.item?.Code]) {
      tt += parseFloat(props?.Q1[props?.item?.Code]);
      dataItem.Q1 = parseFloat(props?.Q1[props?.item?.Code]);
      updateObject(dataItem);
    }
    if (props?.Q2 && props?.Q2[props?.item?.Code]) {
      tt += parseFloat(props?.Q2[props?.item?.Code]);
      dataItem.Q2 = parseFloat(props?.Q2[props?.item?.Code]);
      updateObject(dataItem);
    }
    if (props?.Q3 && props?.Q3[props?.item?.Code]) {
      tt += parseFloat(props?.Q3[props?.item?.Code]);
      dataItem.Q3 = parseFloat(props?.Q3[props?.item?.Code]);
      updateObject(dataItem);
    }
    if (props?.Q4 && props?.Q4[props?.item?.Code]) {
      tt += parseFloat(props?.Q4[props?.item?.Code]);
      dataItem.Q4 = parseFloat(props?.Q4[props?.item?.Code]);
      updateObject(dataItem);
    }
    if (props?.item?.Target.indexOf("%") !== -1) {
      tt = tt / 4;
    }

    dataItem.Total = tt;
    updateObject(dataItem);
    setPerformance(tt);
    const target = parseFloat(
      props?.item?.Target.replace("%", "").replace("$", "")
    );
    if (tt !== 0 && target !== 0) {
      let pc = tt / target;
      dataItem.Achievement = pc * 100;
      updateObject(dataItem);
      setAchievement(pc * 100);
    }
  }, [props.item, props.Q1, props.Q2, props.Q3, props.Q4]);

  return (
    <tr>
      <td>{props?.item?.Code}</td>
      <td>{props?.item?.Description}</td>
      <td className="cc">{withCommas(props?.item?.Target, 1)}</td>
      <td className="cc">
        {props?.item?.Target &&
        props?.item?.Target?.toString().indexOf("$") !== -1
          ? "$"
          : ""}
        {props?.Q1 ? withCommas(props?.Q1[props?.item?.Code], 10) : 0}
        {props?.item?.Target &&
        props?.item?.Target?.toString().indexOf("%") !== -1
          ? "%"
          : ""}
      </td>
      <td className="cc">
        {props?.item?.Target &&
        props?.item?.Target?.toString().indexOf("$") !== -1
          ? "$"
          : ""}
        {props?.Q2 ? withCommas(props?.Q2[props?.item?.Code], 10) : 0}
        {props?.item?.Target &&
        props?.item?.Target?.toString().indexOf("%") !== -1
          ? "%"
          : ""}
      </td>
      <td className="cc">
        {props?.item?.Target &&
        props?.item?.Target?.toString().indexOf("$") !== -1
          ? "$"
          : ""}
        {props?.Q3 ? withCommas(props?.Q3[props?.item?.Code], 10) : 0}
        {props?.item?.Target &&
        props?.item?.Target?.toString().indexOf("%") !== -1
          ? "%"
          : ""}
      </td>
      <td className="cc">
        {props?.item?.Target &&
        props?.item?.Target?.toString().indexOf("$") !== -1
          ? "$"
          : ""}
        {props?.Q4 ? withCommas(props?.Q4[props?.item?.Code], 10) : 0}
        {props?.item?.Target &&
        props?.item?.Target?.toString().indexOf("%") !== -1
          ? "%"
          : ""}
      </td>
      <td className="cc">
        {props?.item?.Target &&
        props?.item?.Target?.toString().indexOf("$") !== -1
          ? "$"
          : ""}
        {withCommas(performance, 10)}
        {props?.item?.Target &&
        props?.item?.Target?.toString().indexOf("%") !== -1
          ? "%"
          : ""}
      </td>
      <td className="cc">{withCommas(achievement, 10)}%</td>
    </tr>
  );
};

const NRWTable = (props) => {
  const [data, setData] = useState(null);
  const tb = useRef();
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  useEffect(() => {
    const today = new Date();
    setStart(`${today.getFullYear() - 1}-10-01`);
    setEnd(`${today.getFullYear()}-09-30`);
  }, []);

  useEffect(() => {
    if (start !== "" && end !== "end") {
      fetch(`/api/reports/nrw/performance/${start}/${end}`)
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw Error("");
          }
        })
        .then((data) => {
          console.log(data);
          setData(data);
        })
        .catch((e) => {});
    }
  }, [start, end]);

  const RowItem = (params) => {
    return (
      <tr>
        <td>{params.item?.Name}</td>
        <td>{params.item?.County}</td>
        <td className="cc">{params.item?.Baseline}</td>
        <td className="cc">{params.item?.NRW_Q1 ? params.item?.NRW_Q1 : 0}</td>
        <td className="cc">{params.item?.NRW_Q2 ? params.item?.NRW_Q2 : 0}</td>
        <td className="cc">{params.item?.NRW_Q3 ? params.item?.NRW_Q3 : 0}</td>
        <td className="cc">{params.item?.NRW_Q4 ? params.item?.NRW_Q4 : 0}</td>
        <td className="cc">
          {params.item?.Average ? params.item?.Average : 0}
        </td>
        <td className="cc">
          {withCommas(
            parseFloat(params.item?.Average) - parseFloat(params.item?.Baseline)
          )}
        </td>
      </tr>
    );
  };

  return (
    <div className="table">
      <div className="div1auto">
        <h1>NRW Performance</h1>
        <div className="filter">
          <Input
            handleChange={(e) => {
              setStart(e);
            }}
            type="date"
            value={start}
            label="Start Date"
          />
          <Input
            handleChange={(e) => {
              setEnd(e);
            }}
            type="date"
            value={end}
            label="End Date"
          />
          <FontAwesomeIcon
            onClick={() => {
              exportToPDF("NRW Performance", tb.current);
              if (data) exportToExcel("NRW Performance", data.data);
            }}
            className="download"
            icon={faDownload}
          />
        </div>
      </div>
      <table ref={tb}>
        <thead>
          <tr>
            <th>Name</th>
            <th>County</th>
            <th>% NRW (Impact 15)</th>
            <th>% NRW Q1</th>
            <th>% NRW Q2</th>
            <th>% NRW Q3</th>
            <th>% NRW Q4</th>
            <th>Average</th>
            <th>Change from baseline</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data?.data?.map((item, i) => {
              return <RowItem key={i} item={item} />;
            })}
        </tbody>
      </table>
    </div>
  );
};

const WSPOperationsTable = (props) => {
  const [data, setData] = useState(null);
  const tb = useRef();
  const [selectedDate, setSelectedDate] = useState(2023);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  useEffect(() => {
    const today = new Date();
    setStart(`${today.getFullYear() - 1}-10-01`);
    setEnd(`${today.getFullYear()}-09-30`);
  }, []);

  useEffect(() => {
    if (start !== "" && end !== "end") {
      fetch(`/api/reports/wspoperations/performance/${start}/${end}`)
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw Error("");
          }
        })
        .then((data) => {
          setData(data);
        })
        .catch((e) => {});
    }
  }, [start, end]);

  const RowItem = (params) => {
    return (
      <tr>
        <td>{params.item?.County}</td>
        <td className="cc">{params.item?.Name}</td>
        <td className="cc">{params.item?.NRW_Q1 ? params.item?.NRW_Q1 : 0}</td>
        <td className="cc">{params.item?.NRW_Q2 ? params.item?.NRW_Q2 : 0}</td>
        <td className="cc">{params.item?.NRW_Q3 ? params.item?.NRW_Q3 : 0}</td>
        <td className="cc">{params.item?.NRW_Q4 ? params.item?.NRW_Q4 : 0}</td>
        <td className="cc">
          {(
            (parseFloat(params.item?.NRW_Q1) +
              parseFloat(params.item?.NRW_Q2) +
              parseFloat(params.item?.NRW_Q3) +
              parseFloat(params.item?.NRW_Q4)) /
            4
          ).toFixed(0)}
        </td>
        <td className="cc">
          {params.item?.Q1_Revenue ? withCommas(params.item?.Q1_Revenue) : 0}
        </td>
        <td className="cc">
          {params.item?.Q2_Revenue ? withCommas(params.item?.Q2_Revenue) : 0}
        </td>
        <td className="cc">
          {params.item?.Q3_Revenue ? withCommas(params.item?.Q3_Revenue) : 0}
        </td>
        <td className="cc">
          {params.item?.Q4_Revenue ? withCommas(params.item?.Q4_Revenue) : 0}
        </td>
        <td className="cc">
          {withCommas(
            (parseFloat(params.item?.Q1_Revenue) +
              parseFloat(params.item?.Q2_Revenue) +
              parseFloat(params.item?.Q3_Revenue) +
              parseFloat(params.item?.Q4_Revenue)) /
              4
          )}
        </td>
        <td className="cc">
          {params.item?.male ? withCommas(params.item?.male) : 0}
        </td>
        <td className="cc">
          {params.item?.female ? withCommas(params.item?.female) : 0}
        </td>
        <td className="cc">
          {withCommas(
            parseInt(params.item?.male || 0) +
              parseInt(params.item?.female || 0)
          )}
        </td>
      </tr>
    );
  };

  return (
    <div className="table">
      <div className="div1auto">
        <h1>WSP Operations and Efficiency Performance</h1>
        <div className="filter">
          <Input
            handleChange={(e) => {
              setStart(e);
            }}
            type="date"
            value={start}
            label="Start Date"
          />
          <Input
            handleChange={(e) => {
              setEnd(e);
            }}
            type="date"
            value={end}
            label="End Date"
          />
          <FontAwesomeIcon
            onClick={() => {
              exportToPDF("NRW Performance", tb.current);
              if (data) exportToExcel("NRW Performance", data.data);
            }}
            className="download"
            icon={faDownload}
          />
        </div>
      </div>
      <table ref={tb}>
        <thead>
          <tr>
            <th>County</th>
            <th>WSP</th>
            <th>% NRW Q1</th>
            <th>% NRW Q2</th>
            <th>% NRW Q3</th>
            <th>% NRW Q4</th>
            <th>Annual Average</th>
            <th>Revenue Q1</th>
            <th>Revenue Q2</th>
            <th>Revenue Q3</th>
            <th>Revenue Q4</th>
            <th>Annual Average</th>
            <th>Water Access - Male</th>
            <th>Water Access - Female</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data?.data?.map((item, i) => {
              return <RowItem key={i} item={item} />;
            })}
        </tbody>
      </table>
    </div>
  );
};

const DrinkingWaterTable = (props) => {
  const [data, setData] = useState(null);
  const tb = useRef();
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  useEffect(() => {
    const today = new Date();
    setStart(`${today.getFullYear() - 1}-10-01`);
    setEnd(`${today.getFullYear()}-09-30`);
  }, []);

  useEffect(() => {
    if (start !== "" && end !== "end") {
      fetch(`/api/reports/dwq/performance/${start}/${end}`)
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw Error("");
          }
        })
        .then((data) => {
          setData(data);
        })
        .catch((e) => {});
    }
  }, [start, end]);

  const RowItem = (params) => {
    return (
      <tr>
        <td>{params.item?.Name}</td>
        <td className="cc">
          {params.item?.DWQ_Percentage ? params.item?.DWQ_Percentage : 0}
        </td>
        <td className="cc">
          {params.item?.Comment ? params.item?.Comment : 0}
        </td>
      </tr>
    );
  };

  return (
    <div className="table">
      <div className="div1auto">
        <h1>Drinking Water Quality Status</h1>
        <div className="filter">
          <Input
            handleChange={(e) => {
              setStart(e);
            }}
            type="date"
            value={start}
            label="Start Date"
          />
          <Input
            handleChange={(e) => {
              setEnd(e);
            }}
            type="date"
            value={end}
            label="End Date"
          />
          <FontAwesomeIcon
            onClick={() => {
              exportToPDF("NRW Performance", tb.current);
              if (data) exportToExcel("NRW Performance", data.data);
            }}
            className="download"
            icon={faDownload}
          />
        </div>
      </div>
      <table ref={tb}>
        <thead>
          <tr>
            <th>Utility</th>
            <th>Drinking Water Quality %</th>
            <th> Above 95-Good Above 90-Acceptable Below 90 Not Acceptable</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data?.data?.map((item, i) => {
              return <RowItem key={i} item={item} />;
            })}
        </tbody>
      </table>
    </div>
  );
};

const BODCompositionTable = (props) => {
  const [data, setData] = useState(null);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [selectedDate, setSelectedDate] = useState(2023);

  const tb = useRef();

  useEffect(() => {
    const today = new Date();
    setStart(`${today.getFullYear() - 1}-10-01`);
    setEnd(`${today.getFullYear()}-09-30`);
  }, []);

  useEffect(() => {
    if (start !== "" && end !== "end") {
      fetch(`/api/reports/bod/performance/${start}/${end}`)
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw Error("");
          }
        })
        .then((data) => {
          setData(data);
        })
        .catch((e) => {});
    }
  }, [start, end]);

  const RowItem = (params) => {
    return (
      <tr>
        <td>{params.item?.Name}</td>
        <td className="cc">
          {params.item?.BoardMembers_Male ? params.item?.BoardMembers_Male : 0}
        </td>
        <td className="cc">
          {params.item?.BoardMembers_Female
            ? params.item?.BoardMembers_Female
            : 0}
        </td>
        <td className="cc">
          {params.item?.Training_BoardMembers_Male
            ? params.item?.Training_BoardMembers_Male
            : 0}
        </td>
        <td className="cc">
          {params.item?.Training_BoardMembers_Female
            ? params.item?.Training_BoardMembers_Female
            : 0}
        </td>
        <td className="cc">
          {params.item?.Total_BoardMembers
            ? params.item?.Total_BoardMembers
            : 0}
        </td>
      </tr>
    );
  };

  return (
    <div className="table">
      <div className="div1auto">
        <h1>BOD Composition</h1>
        <div className="filter">
          <Input
            handleChange={(e) => {
              setStart(e);
            }}
            type="date"
            value={start}
            label="Start Date"
          />
          <Input
            handleChange={(e) => {
              setEnd(e);
            }}
            type="date"
            value={end}
            label="End Date"
          />
          <FontAwesomeIcon
            onClick={() => {
              exportToPDF("NRW Performance", tb.current);
              if (data) exportToExcel("NRW Performance", data.data);
            }}
            className="download"
            icon={faDownload}
          />
        </div>
      </div>
      <table ref={tb}>
        <thead>
          <tr>
            <th>WSP</th>
            <th>Gender (Male)</th>
            <th>Gender (Female)</th>
            <th>Training (Male)</th>
            <th>Training (Female)</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data?.data?.map((item, i) => {
              return <RowItem key={i} item={item} />;
            })}
        </tbody>
      </table>
    </div>
  );
};

const LeadershipPositionsTable = (props) => {
  const [data, setData] = useState(null);
  const tb = useRef();
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [selectedDate, setSelectedDate] = useState(2023);

  useEffect(() => {
    const today = new Date();
    setStart(`${today.getFullYear() - 1}-10-01`);
    setEnd(`${today.getFullYear()}-09-30`);
  }, []);

  useEffect(() => {
    if (start !== "" && end !== "end") {
      fetch(`/api/reports/womenleadership/performance/${start}/${end}`)
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw Error("");
          }
        })
        .then((data) => {
          setData(data);
        })
        .catch((e) => {});
    }
  }, [start, end]);

  const RowItem = (params) => {
    return (
      <tr>
        <td>{params.item?.County}</td>
        <td>{params.item?.Name}</td>
        <td className="cc">{params.item?.Total ? params.item?.Total : 0}</td>
        <td className="cc">
          {params.item?.BoardMembers_Female
            ? params.item?.BoardMembers_Female
            : 0}
        </td>
        <td className="cc">
          {params.item?.Total
            ? (
                (params.item?.BoardMembers_Female / params.item?.Total) *
                100
              ).toFixed(0)
            : 0}
          %
        </td>
      </tr>
    );
  };

  return (
    <div className="table">
      <div className="div1auto">
        <h1>Status of Vulnerable Groups in Leadership Positions</h1>
        <div className="filter">
          <Input
            handleChange={(e) => {
              setStart(e);
            }}
            type="date"
            value={start}
            label="Start Date"
          />
          <Input
            handleChange={(e) => {
              setEnd(e);
            }}
            type="date"
            value={end}
            label="End Date"
          />
          <FontAwesomeIcon
            onClick={() => {
              exportToPDF("NRW Performance", tb.current);
              if (data) exportToExcel("NRW Performance", data.data);
            }}
            className="download"
            icon={faDownload}
          />
        </div>
      </div>
      <table ref={tb}>
        <thead>
          <tr>
            <th>County</th>
            <th>Name of Entity</th>
            <th>Number of Leadership Positions</th>
            <th>Number of Women in Leadership Positions</th>
            <th>Percentage of Women in Leadership Positions</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data?.data?.map((item, i) => {
              return <RowItem key={i} item={item} />;
            })}
        </tbody>
      </table>
    </div>
  );
};

const TrainingSummaryTable = (props) => {
  const [data, setData] = useState(null);
  const tb = useRef();
  const [selectedDate, setSelectedDate] = useState(2023);
  const [refresh, setRefresh] = useState(false);
  const [year, setYear] = useState("2023");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  useEffect(() => {
    const today = new Date();
    setYear(today.getFullYear());
    setStart(`${today.getFullYear() - 1}-10-01`);
    setEnd(`${today.getFullYear()}-09-30`);
    if (start !== "" && end !== "") {
      fetch(`/api/reports/training/performance/${start}/${end}`)
        .then((res) => {
          if (res.ok) return res.json();
          else throw Error("");
        })
        .then((data) => {
          setData(data);
        })
        .catch((e) => {});
    }
  }, [start, end]);

  const RowItem = (params) => {
    return (
      <tr>
        <td className="cc">{params.item?.County}</td>
        <td className="cc">{params.item?.ActivityName}</td>
        <td className="cc">{params.item?.PWD ? params.item?.PWD : 0}</td>
        <td className="cc">{params.item?.Male ? params.item?.Male : 0}</td>
        <td className="cc">{params.item?.Female ? params.item?.Female : 0}</td>
        <td className="cc">{params.item?.Total ? params.item?.Total : 0}</td>
        <td className="cc">{params.item?.Youth ? params.item?.Youth : 0}</td>
        <td className="cc">{params.item?.Adult ? params.item?.Adult : 0}</td>
      </tr>
    );
  };

  return (
    <div className="table">
      <div className="div1auto">
        <h1>Training Participation Summary</h1>
        <div className="filters">
          <Input
            handleChange={(e) => {
              setStart(e);
            }}
            type="date"
            value={start}
            label="Start Date"
          />
          <Input
            handleChange={(e) => {
              setEnd(e);
            }}
            type="date"
            value={end}
            label="End Date"
          />
          <FontAwesomeIcon
            onClick={() => {
              exportToPDF("Training Participation Summary", tb.current);
              if (data)
                exportToExcel("Training Participation Summary", data.data);
            }}
            className="download"
            icon={faDownload}
          />
        </div>
      </div>
      <table ref={tb}>
        <thead>
          <tr>
            <th>County</th>
            <th>Name of Training</th>
            <th>PWD</th>
            <th>Male</th>
            <th>Female</th>
            <th>Total</th>
            <th>15-29 Years</th>
            <th>30+ years</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data?.data?.map((item, i) => {
              return <RowItem key={i} item={item} />;
            })}
        </tbody>
      </table>
    </div>
  );
};

const BudgetAllocationTable = (props) => {
  const [data, setData] = useState(null);
  const tb = useRef();
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [selectedDate, setSelectedDate] = useState(2023);

  useEffect(() => {
    const today = new Date();
    setStart(`${today.getFullYear() - 1}-10-01`);
    setEnd(`${today.getFullYear()}-09-30`);
  }, []);

  useEffect(() => {
    if (start !== "" && end !== "end") {
      fetch(`/api/reports/budget/performance`)
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw Error("");
          }
        })
        .then((data) => {
          setData(data);
        })
        .catch((e) => {});
    }
  }, [start, end]);

  const RowItem = (params) => {
    return (
      <tr>
        <td className="cc">{params.item?.County}</td>
        <td className="cc">{(params.item?.Year1 / 1000000).toFixed(2)}</td>
        <td className="cc">{(params.item?.Year2 / 1000000).toFixed(2)}</td>
        <td className="cc">{(params.item?.Variance / 1000000).toFixed(2)}</td>
      </tr>
    );
  };

  return (
    <div className="table">
      <div className="div1auto">
        <h1>County Budget Allocation</h1>
        <div className="filter">
          <Input
            handleChange={(e) => {
              setStart(e);
            }}
            type="date"
            value={start}
            label="Start Date"
          />
          <Input
            handleChange={(e) => {
              setEnd(e);
            }}
            type="date"
            value={end}
            label="End Date"
          />
          <FontAwesomeIcon
            onClick={() => {
              exportToPDF("NRW Performance", tb.current);
              if (data) exportToExcel("NRW Performance", data.data);
            }}
            className="download"
            icon={faDownload}
          />
        </div>
      </div>
      <table ref={tb}>
        <thead>
          <tr>
            <th>County</th>
            <th>2022/2023 Final Approved Budget (Million USD)</th>
            <th>2023/2024 Budget Estimates (Million USD)</th>
            <th>Variance/Growth (Million USD)</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data?.data?.map((item, i) => {
              return <RowItem key={i} item={item} />;
            })}
        </tbody>
      </table>
    </div>
  );
};

const LegalInsturumentsTable = (props) => {
  const [data, setData] = useState(null);
  const tb = useRef();

  useEffect(() => {
    fetch(`/api/reports/legal/performance`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw Error("");
        }
      })
      .then((data) => {
        setData(data);
      })
      .catch((e) => {});
  }, []);

  const RowItem = (params) => {
    return (
      <tr>
        <td className="cc">{params.item?.County}</td>
        <td className="cc">{params.item?.Policy}</td>
        <td className="cc">{params.item?.Status}</td>
      </tr>
    );
  };

  return (
    <div className="table">
      <div className="div1auto">
        <h1>Status of Legal Instruments in Counties</h1>
        <div className="filter">
          <Select data={["2023", "2024", "2025", "2026", "2027"]} />
          <FontAwesomeIcon
            onClick={() => {
              exportToPDF(
                "Status of Legal Instruments in Counties",
                tb.current
              );
              if (data)
                exportToExcel(
                  "Status of Legal Instruments in Counties",
                  data.data
                );
            }}
            className="download"
            icon={faDownload}
          />
        </div>
      </div>
      <table ref={tb}>
        <thead>
          <tr>
            <th>County</th>
            <th>Policy/Law/Regulation</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data?.data?.map((item, i) => {
              return <RowItem key={i} item={item} />;
            })}
        </tbody>
      </table>
    </div>
  );
};

const exportToPDF = (title, ref) => {
  const doc = new jsPDF(); // Create a new A4-sized PDF

  // Get the actual content from the ref
  const content = ref;
  // Add HTML content to PDF

  html2canvas(content, {
    width: content.offsetWidth,
    height: content.offsetHeight,
    scale: 2,
  })
    .then((canvas) => {
      // Calculate padding
      const paddingX = 10; // Example padding in X direction
      const paddingY = 10; // Example padding in Y direction

      // Calculate position with padding
      const x = paddingX;
      const y = paddingY;

      const scaleFactorWidth =
        (doc.internal.pageSize.width - 2 * paddingX) / canvas.width;
      const scaleFactorHeight =
        (doc.internal.pageSize.height - 2 * paddingY) / canvas.height;
      const scaleFactor = Math.min(scaleFactorWidth, scaleFactorHeight);
      const scaledWidth = canvas.width * scaleFactor;
      const scaledHeight = canvas.height * scaleFactor;

      // Convert the canvas to a data URL
      const dataUrl = canvas.toDataURL();

      // Add the image to the PDF with padding
      doc.addImage(dataUrl, "JPEG", x, y, scaledWidth, scaledHeight);
      // Save the PDF
      doc.save(`${title}.pdf`);
    })
    .catch((error) => {
      console.error("Error exporting to PDF:", error);
    });
};

const exportToExcel = (filename, data) => {
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
};
