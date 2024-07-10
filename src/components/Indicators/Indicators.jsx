import {
  faArrowDown,
  faArrowRight,
  faArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import "../../Styles/indicators.scss";
import Input from "../Util/Input";
import Loading from "../Util/Loading";
import Select from "../Util/Select";

export default function Indicators() {
  const cross = useRef();
  const urban = useRef();
  const rural = useRef();
  const wrm = useRef();
  const fps = useRef();
  const pg = useRef();

  return (
    <div className="indicators">
      <div className="top">
        <div className="title">
          <h3>Quick Links</h3>
          <p className="sub-title">Indicatory Summary</p>
        </div>

        <div className="top-cards">
          <TopItem
            date="2nd Oct 2023"
            component="Urban Water Services"
            url="component1"
            item={urban}
          />
          <TopItem
            date="2nd Oct 2023"
            component="Rural Water Services"
            url="component2"
            item={rural}
          />
          <TopItem
            date="2nd Oct 2023"
            component="Water Resource Management"
            url="component3"
            item={wrm}
          />
          <TopItem
            date="2nd Oct 2023"
            component="Finance & Private Engagement"
            url="component4"
            item={fps}
          />
          <TopItem
            date="2nd Oct 2023"
            component="Policy & Governance"
            url="component5"
            item={pg}
          />
        </div>
      </div>
      <div ref={cross}>
        <IndicatorComponent
          title="Cross Cutting Indicators"
          url="Cross Cutting"
          link="crosscutting"
        />
      </div>
      <div ref={urban}>
        <IndicatorComponent
          title="Urban Water Services Indicators"
          url="Urban Water Services"
          link="urbancomponent"
        />
      </div>

      <div ref={rural}>
        <IndicatorComponent
          title="Rural Water Services Indicators"
          url="Rural Water Services"
          link="ruralcomponent"
        />
      </div>

      <div ref={wrm}>
        <IndicatorComponent
          title="Water Resources Management Indicators"
          url="Water Resources Management"
          link="wrmcomponent"
        />
      </div>

      <div ref={fps}>
        <IndicatorComponent
          title="Finance and Private Sector Engagement Indicators"
          url="Finance and Private Sector Engagement"
          link="financecomponent"
        />
      </div>

      <div ref={pg}>
        <IndicatorComponent
          title="Policy and Governance Indicators"
          url="Policy and Governance"
          link="policycomponent"
        />
      </div>
    </div>
  );
}

const TopItem = (props) => {
  return (
    <div
      onClick={() => {
        props?.item?.current.scrollIntoView({ behavior: "smooth" });
      }}
      className="tp_item"
    >
      <h6>
        Last Update: <br />
        {props.date}
      </h6>
      <h4>{props.component}</h4>
      <FontAwesomeIcon className="p" icon={faArrowRight} />
    </div>
  );
};

const IndicatorComponent = (props) => {
  const [indicators, setIndicators] = useState(null);
  const [year, setYear] = useState("2023");
  const [active, setActive] = useState(year);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  useEffect(() => {
    const today = new Date();
    setYear(today.getFullYear());
    setStart(`${today.getFullYear() - 1}-10-01`);
    setEnd(`${today.getFullYear()}-09-30`);
    if (start != "" && end != "") {
      getData();
    }
  }, []);

  useEffect(() => {
    const adjustedYear = year - 1;
    switch (active) {
      case "Q1":
        if (year == 2023) {
          setStart(`2022-10-01`);
          setEnd(`2022-12-31`);
        } else {
          setStart(`${adjustedYear}-10-01`);
          setEnd(`${adjustedYear}-12-31`);
        }
        break;
      case "Q2":
        setStart(`${year}-01-01`);
        setEnd(`${year}-03-31`);
        break;
      case "Q3":
        setStart(`${year}-04-01`);
        setEnd(`${year}-06-30`);
        break;
      case "Q4":
        setStart(`${year}-07-01`);
        setEnd(`${year}-09-30`);
        break;
      case year:
        setStart(`${adjustedYear}-10-01`);
        setEnd(`${year}-09-30`);
        break;
      case "All Time":
        const td = new Date();
        const lastDate = new Date(year, td.getMonth() + 1, 1);
        setStart(`2022-09-01`);
        setEnd(lastDate.toISOString().split("T")[0]);
        break;
      default:
        break;
    }
  }, [active, year]);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/indicators/component/${props.url}`)
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
  }, [year]);

  useEffect(() => {
    if (start != "" && end != "") {
      getData();
    }
  }, [start, end]);

  function getData() {
    setLoading(true);
    fetch(`/api/rmf/home/${props.link}/null/${start}/${end}`)
      .then((res) => {
        if (res.ok) return res.json();
        else throw Error("");
      })
      .then((data) => {
        setLoading(false);
        setData(data);
      })
      .catch((e) => {
        setLoading(false);
      });
  }

  return (
    <div className="indicator_section">
      <Select
        setChanged={(v) => {
          setYear(v);
          setActive(v);
        }}
        value={year}
        data={["2023", "2024", "2025", "2026", "2027"]}
      />

      <div className="div1auto">
        <div className="title">
          <h3>{props.title}</h3>
          <p className="sub-title">Indicator Summary</p>
          <hr />
        </div>
        <div className="filter">
          <button
            onClick={() => {
              setActive("Q1");
            }}
            className={active == "Q1" ? "active" : ""}
          >
            Q1
          </button>
          <button
            onClick={() => {
              setActive("Q2");
            }}
            className={active == "Q2" ? "active" : ""}
          >
            Q2
          </button>
          <button
            onClick={() => {
              setActive("Q3");
            }}
            className={active == "Q3" ? "active" : ""}
          >
            Q3
          </button>
          <button
            onClick={() => {
              setActive("Q4");
            }}
            className={active == "Q4" ? "active" : ""}
          >
            Q4
          </button>
          <button
            onClick={() => {
              setActive(year);
            }}
            className={active == year ? "active" : ""}
          >
            {year}
          </button>
          <button
            onClick={() => {
              setActive("All Time");
            }}
            className={active == "All Time" ? "active" : ""}
          >
            All Time
          </button>
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
        </div>
      </div>

      {isMobile ? (
        <div
          className="sbody"
          style={{ gridTemplateColumns: `1fr 0.5fr 0.5fr` }}
        >
          <h3>Code</h3>
          <h3>Target</h3>
          <h3>Perform</h3>
        </div>
      ) : (
        <div
          className="sbody"
          style={{ gridTemplateColumns: `0.15fr 1fr 0.2fr 0.2fr 0.2fr` }}
        >
          <h3>Code</h3>
          <h3>Indicator</h3>
          <h3>Target</h3>
          <h3>Performance</h3>
          <h3>Achievement</h3>
        </div>
      )}

      <div className="ind_list">
        {indicators &&
          indicators.data.length > 0 &&
          indicators.data.map((item, i) => {
            return <Item key={i} item={item} data={data} year={year} />;
          })}
      </div>
      {loading && <Loading />}
    </div>
  );
};

const Item = (props) => {
  const [performance, setPerformance] = useState(0);
  const [achievement, setAchievement] = useState(0);

  function withCommas(x) {
    if (x == null) return 0;
    const p = x?.toString();
    if (p?.indexOf("$") != -1 || p?.indexOf("%") != -1) {
      return p?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
      if (parseFloat(x) < 1) {
        let o = Math.round(parseFloat(x) * 10) / 10;
        return o?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      } else {
        let o = Math.round(parseFloat(x));
        return o?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
    }
  }

  useEffect(() => {
    if (props.data) {
      setPerformance(
        props.data[props.item.Code] ? props.data[props.item.Code] : 0
      );
      let p = props.data[props.item.Code];
      const target = parseInt(
        props.item[`Target${props.year}`].replace("%", "").replace("$", "")
      );
      if (target != 0) {
        let pc = (p / target) * 100;
        if (pc < 1) {
          setAchievement(pc.toFixed(1));
        } else {
          setAchievement(pc.toFixed(0));
        }
      }
    }
  }, [props.data, props.year]);

  return (
    <div
      onClick={() => {
        window.location.href = "/indicators/singleview/" + props.item.Code;
      }}
    >
      {isMobile ? (
        <div className="tbody" style={{ gridTemplateColumns: `1fr .5fr .5fr` }}>
          <p htmlFor="">{props.item.Code}</p>
          <p>{withCommas(props.item[`Target${props.year}`])}</p>
          {/* {props.year === 2023
            ? withCommas(props.item.Target2023)
            : props.year === 2024
            ? withCommas(props.item.Target2024)
            : props.year === 2025
            ? withCommas(props.item.Target2025)
            : props.year === 2026
            ? withCommas(props.item.Target2026)
            : props.year === 2027
            ? withCommas(props.item.Target2027)
            : null} */}
          <p className="achievement">
            {achievement < 50 && (
              <FontAwesomeIcon color="red" icon={faArrowDown} className="ic" />
            )}
            {achievement >= 50 && achievement < 75 && (
              <FontAwesomeIcon color="red" icon={faArrowRight} className="ic" />
            )}
            {achievement >= 75 && (
              <FontAwesomeIcon color="green" icon={faArrowUp} className="ic" />
            )}{" "}
            {withCommas(achievement)} %
          </p>
        </div>
      ) : (
        <div
          className="tbody"
          style={{ gridTemplateColumns: `0.15fr 1fr  0.2fr 0.2fr 0.2fr` }}
          onClick={() => {
            // window.location.href = `/indicator/` + `${props.ind_ID}`;
          }}
        >
          <label htmlFor="">{props.item.Code}</label>
          <p className="ind-desc">{props.item.Description}</p>

          <h4>
            {withCommas(props.item[`Target${props.year}`])}
            {/* {props.year === 2023
              ? withCommas(props.item.Target2023)
              : props.year === 2024
              ? withCommas(props.item.Target2024)
              : props.year === 2025
              ? withCommas(props.item.Target2025)
              : props.year === 2026
              ? withCommas(props.item.Target2026)
              : props.year === 2027
              ? withCommas(props.item.Target2027)
              : null} */}
          </h4>
          <h5 className="result">{withCommas(performance)}</h5>

          <p className="achievement">
            {achievement}%
            {achievement < 50 && (
              <FontAwesomeIcon color="red" icon={faArrowDown} className="ic" />
            )}
            {achievement >= 50 && achievement < 75 && (
              <FontAwesomeIcon
                color="amber"
                icon={faArrowRight}
                className="ic"
              />
            )}
            {achievement >= 75 && (
              <FontAwesomeIcon color="green" icon={faArrowUp} className="ic" />
            )}{" "}
          </p>
        </div>
      )}
    </div>
  );
};
