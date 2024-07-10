import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import GaugeChart from "react-gauge-chart";
import { CiCalendarDate } from "react-icons/ci";
import "../../Styles/stats.scss";
import CustomBarChart from "../Stats/CustomBarChart";
import QuarterlyBarChart from "../Stats/QuarterlyBarChart";

export default function SingleView(props) {
  const [data, setData] = useState(null);
  const [component, setComponent] = useState();
  const [indicator, setIndicator] = useState();

  const code = window.location.pathname.split("/").pop();

  useEffect(() => {
    fetch(`/api/indicators/code/${code}`)
      .then((res) => {
        if (res.ok) return res.json();
        else throw Error("");
      })
      .then((data) => {
        setIndicator(data?.data[0]);
        if (data?.data[0]?.Component === "Cross Cutting") {
          setComponent("crosscutting");
        } else if (data?.data[0]?.Component === "Rural Water Services") {
          setComponent("ruralcomponent");
        } else if (data?.data[0]?.Component === "Urban Water Services") {
          setComponent("urbancomponent");
        } else if (data?.data[0]?.Component === "Water Resources Management") {
          setComponent("wrmcomponent");
        } else if (
          data?.data[0]?.Component === "Finance and Private Sector Engagement"
        ) {
          setComponent("financecomponent");
        } else if (data?.data[0]?.Component === "Policy and Governance") {
          setComponent("policycomponent");
        }
      })
      .catch((e) => {});
  }, [code]);

  return (
    <div className="stats">
      <h2>Indicator Code: {indicator?.Code}</h2>
      <Top code={code} indicator={indicator} component={component} />
    </div>
  );
}

const Top = (props) => {
  const [active, setActive] = useState(2023);
  const [isActive, setIsActive] = useState([true, false, false, false, false]);
  const [year, setYear] = useState("2023");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [data, setData] = useState(null);
  const [data2023, setData2023] = useState(null);
  const [data2024, setData2024] = useState(null);
  const [data2025, setData2025] = useState(null);
  const [data2026, setData2026] = useState(null);
  const [data2027, setData2027] = useState(null);

  const [q1, seQ1] = useState(0);
  const [q2, seQ2] = useState(0);
  const [q3, seQ3] = useState(0);
  const [q4, seQ4] = useState(0);

  const setDivActive = (year) => {
    setActive(year);
    const updatedActiveDivs = isActive.map(
      (val, index) => index === year - 2023
    );
    setIsActive(updatedActiveDivs);
  };

  function withCommas(x) {
    return x?.toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ",");
  }

  useEffect(() => {
    if (active == 2023) {
      setStart(`2022-10-01`);
      setEnd(`2023-09-30`);
    } else if (active == 2024) {
      setStart(`2023-10-01`);
      setEnd(`2024-09-30`);
    } else if (active == 2025) {
      setStart(`2024-10-01`);
      setEnd(`2025-09-30`);
    } else if (active == 2026) {
      setStart(`2025-10-01`);
      setEnd(`2026-09-30`);
    } else if (active == 2027) {
      setStart(`2026-10-01`);
      setEnd(`2027-09-30`);
    } else if (active == "All Time") {
      const td = new Date();
      const lastDate = new Date(year, td.getMonth() + 1, 1);
      setStart(`2022-09-01`);
      setEnd(lastDate.toISOString().split("T")[0]);
    }
  }, [active]);

  useEffect(() => {
    fetch(`/api/rmf/home/${props.component}/null/${start}/${end}`)
      .then((res) => {
        if (res.ok) return res.json();
        else throw Error("");
      })
      .then((data) => {
        setData(data);
      })
      .catch((e) => {});
  }, [props.component, start, end]);

  useEffect(() => {
    if (props.component) {
      getData("2022-10-01", "2023-09-30", setData2023);
      getData("2023-10-01", "2024-09-30", setData2024);
      getData("2024-10-01", "2025-09-30", setData2025);
      getData("2025-10-01", "2026-09-30", setData2026);
      getData("2026-10-01", "2027-09-30", setData2027);
    }
  }, [props.component]);

  useEffect(() => {
    getData(`${active - 1}-10-01`, `${active - 1}-12-31`, seQ1);
    getData(`${active}-01-01`, `${active}-03-31`, seQ2);
    getData(`${active}-04-01`, `${active}-06-30`, seQ3);
    getData(`${active}-07-01`, `${active}-09-30`, seQ4);
  }, [active, data2023]);

  function getData(st, en, setMyData) {
    fetch(`/api/rmf/home/${props.component}/null/${st}/${en}`)
      .then((res) => {
        if (res.ok) return res.json();
        else throw Error("");
      })
      .then((data) => {
        setMyData(data);
      })
      .catch((e) => {});
  }

  return (
    <>
      <div className="taskstats">
        <div className="left">
          <div className="bar">
            <div></div>
            <h2> {props.indicator?.Description} </h2>
          </div>
          <div className="outer">
            <div className="ll">
              <div className={`section ${isActive[0] ? "active" : ""}`}>
                <div className="single" onClick={() => setDivActive(2023)}>
                  <CiCalendarDate className="ts" />
                  <div>
                    <h4>
                      {data2023 && data2023[props.code]
                        ? withCommas(data2023[props.code])
                        : 0}
                    </h4>
                    <p>2023</p>
                  </div>
                </div>
              </div>

              <div className={`section ${isActive[1] ? "active" : ""}`}>
                <div className="single" onClick={() => setDivActive(2024)}>
                  <CiCalendarDate className="ts" />
                  <div>
                    <h4
                      onClick={() => {
                        setActive(2024);
                      }}
                    >
                      {data2024 && data2024[props.code]
                        ? withCommas(data2024[props.code])
                        : 0}
                    </h4>
                    <p>2024</p>
                  </div>
                </div>
              </div>

              <div className={`section ${isActive[2] ? "active" : ""}`}>
                <div className="single" onClick={() => setDivActive(2025)}>
                  <CiCalendarDate className="ts" />
                  <div>
                    <h4
                      onClick={() => {
                        setActive(2025);
                      }}
                    >
                      {data2025 && data2025[props.code]
                        ? withCommas(data2025[props.code])
                        : 0}
                    </h4>
                    <p>2025</p>
                  </div>
                </div>
              </div>
              <div className={`section ${isActive[3] ? "active" : ""}`}>
                <div className="single" onClick={() => setDivActive(2026)}>
                  <CiCalendarDate className="ts" />
                  <div>
                    <h4
                      onClick={() => {
                        setActive(2026);
                      }}
                    >
                      {data2026 && data2026[props.code]
                        ? withCommas(data2026[props.code])
                        : 0}
                    </h4>
                    <p>2026</p>
                  </div>
                </div>
              </div>
              <div className={`section ${isActive[4] ? "active" : ""}`}>
                <div className="single" onClick={() => setDivActive(2027)}>
                  <CiCalendarDate className="ts" />
                  <div>
                    <h4
                      onClick={() => {
                        setActive(2027);
                        console.log(active);
                      }}
                    >
                      {data2027 && data2027[props.code]
                        ? withCommas(data2027[props.code])
                        : 0}
                    </h4>
                    <p>2027</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="section">
              <h3>Yearly Distribution</h3>
              <QuarterlyBarChart
                data={[
                  { name: "Q1", value: q1[props.code] },
                  { name: "Q2", value: q2[props.code] },
                  { name: "Q3", value: q3[props.code] },
                  { name: "Q4", value: q4[props.code] },
                ]}
                aspect={isMobile ? 1 : 1.2}
                color="#BA0C2F"
              />
            </div>
          </div>
        </div>
        <div className="right">
          <div className="bar">
            <div></div>
            <h2>Performance Vs Target</h2>
          </div>
          <div className="outer">
            <div className="section">
              <h3>
                {active} Performance Vs {active} Target
              </h3>
              <GaugeChart
                className="gg"
                id="gauge-chart2"
                nrOfLevels={3}
                colors={["red", "orange", "green"]}
                arcWidth={0.3}
                percent={
                  data
                    ? data[props.code]
                      ? data[props.code] /
                          props.indicator?.[`Target${active}`] >
                        1
                        ? 1
                        : data[props.code] /
                          props.indicator?.[`Target${active}`]
                      : 0
                    : 0
                }
                textColor="gray"
              />

              <div className="">
                <p className="bold">
                  Performance: {withCommas(data && data[props.code])}
                </p>
                <p className="bold">
                  Target: {withCommas(props.indicator?.[`Target${active}`])}
                </p>

                {data &&
                  (data[props.code] / props.indicator?.[`Target${active}`] >
                  1 ? (
                    <p className="bolds">
                      Actual Performance:
                      {(
                        (data[props.code] /
                          props.indicator?.[`Target${active}`]) *
                        100
                      ).toFixed(2)}
                      %
                    </p>
                  ) : (
                    <></>
                  ))}
              </div>
            </div>
            <div className="section">
              <h3>{active} Performance Vs Project Target</h3>
              <GaugeChart
                className="gg"
                id="gauge-chart2"
                nrOfLevels={3}
                colors={["red", "orange", "green"]}
                arcWidth={0.3}
                percent={
                  data
                    ? data[props.code]
                      ? data[props.code] / props.indicator?.Target > 1
                        ? 1
                        : data[props.code] / props.indicator?.Target
                      : 0
                    : 0
                }
                textColor="gray"
              />

              <div className="">
                <p className="bold">
                  Performance: {withCommas(data && data[props.code])}
                </p>
                <p className="bold">
                  Target: {withCommas(props.indicator?.Target)}
                </p>

                {data &&
                  (data[props.code] / props.indicator?.Target > 1 ? (
                    <p className="bolds">
                      Actual Performance:{" "}
                      {(
                        (data[props.code] / props.indicator?.Target) *
                        100
                      ).toFixed(2)}{" "}
                      %
                    </p>
                  ) : (
                    <></>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
