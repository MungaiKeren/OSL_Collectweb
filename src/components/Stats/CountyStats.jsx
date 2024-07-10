import html2canvas from "html2canvas";
import { useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import GaugeChart from "react-gauge-chart";
import { FaHandHoldingWater } from "react-icons/fa";
import { FaMoneyBill1Wave } from "react-icons/fa6";
import { FiRefreshCcw } from "react-icons/fi";
import { MdOutlineManageHistory } from "react-icons/md";
import { RiCustomerService2Line } from "react-icons/ri";
import "../../Styles/stats.scss";
import kpiwheel from "../../assets/imgs/KPIWheel.svg";
import agreements from "../../assets/imgs/agreements.png";
import budget from "../../assets/imgs/budget.png";
import catchment from "../../assets/imgs/catchment.png";
import climate from "../../assets/imgs/climate.png";
import digital from "../../assets/imgs/digital.png";
import ecosystem from "../../assets/imgs/ecosystem.png";
import governance from "../../assets/imgs/governance.png";
import instruments from "../../assets/imgs/instruments.png";
import laws from "../../assets/imgs/laws.png";
import leveraged from "../../assets/imgs/leveraged.png";
import mobilized from "../../assets/imgs/mobilized.png";
import nrw from "../../assets/imgs/nrw.png";
import o_m from "../../assets/imgs/o_m.png";
import regulated from "../../assets/imgs/regulate.png";
import sdm from "../../assets/imgs/sdm.png";
import training from "../../assets/imgs/training.png";
import Input from "../Util/Input";
import BoxItem from "./BoxItem";
import CustomBarChart from "./CustomBarChart";

export default function CountyStats(props) {
  const [data, setData] = useState({});
  const [charts, setCharts] = useState(null);
  const [showing, setShowing] = useState(true);
  const [year, setYear] = useState("2023");
  const [active, setActive] = useState(year);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [selected, setSelected] = useState("Main");

  const pathname = window.location.pathname.split("/");

  useEffect(() => {
    const today = new Date();
    setStart(`${today.getFullYear() - 1}-10-01`);
    setEnd(`${today.getFullYear()}-09-30`);

    if (start !== "" && end !== "") {
      getData();
    }
  }, [refresh]);

  function getData() {
    getCrossCutting();
    fetch(`/api/rmf/home/countycharts/${props.county}/${start}/${end}`)
      .then((res) => {
        if (res.ok) return res.json();
        else throw Error("");
      })
      .then((dt) => {
        setCharts(dt);
      })
      .catch((e) => {});
  }

  useEffect(() => {
    if (start !== "" && end !== "") {
      getData();
    }
  }, [start, end]);

  async function getCrossCutting() {
    fetch(`/api/rmf/home/crosscutting/${props.county}/${start}/${end}`)
      .then((res) => {
        if (res.ok) return res.json();
        else throw Error("");
      })
      .then((dt) => {
        const combinedData = { ...data, ...dt };
        setData(combinedData);
        getUrban(combinedData);
      })
      .catch((e) => {});
  }
  async function getUrban(dt1) {
    fetch(`/api/rmf/home/urbancomponent/${props.county}/${start}/${end}`)
      .then((res) => {
        if (res.ok) return res.json();
        else throw Error("");
      })
      .then((dt) => {
        const combinedData = { ...dt1, ...dt };
        setData(combinedData);
        getRural(combinedData);
      })
      .catch((e) => {});
  }

  async function getRural(dt1) {
    fetch(`/api/rmf/home/ruralcomponent/${props.county}/${start}/${end}`)
      .then((res) => {
        if (res.ok) return res.json();
        else throw Error("");
      })
      .then((dt) => {
        const combinedData = { ...dt1, ...dt };
        setData(combinedData);
        getWRM(combinedData);
      })
      .catch((e) => {});
  }
  async function getWRM(dt1) {
    fetch(`/api/rmf/home/wrmcomponent/${props.county}/${start}/${end}`)
      .then((res) => {
        if (res.ok) return res.json();
        else throw Error("");
      })
      .then((dt) => {
        const combinedData = { ...dt1, ...dt };
        setData(combinedData);
        getFinance(combinedData);
      })
      .catch((e) => {});
  }

  async function getFinance(dt1) {
    fetch(`/api/rmf/home/financecomponent/${props.county}/${start}/${end}`)
      .then((res) => {
        if (res.ok) return res.json();
        else throw Error("");
      })
      .then((dt) => {
        const combinedData = { ...dt1, ...dt };
        setData(combinedData);
        getPolicy(combinedData);
      })
      .catch((e) => {});
  }

  async function getPolicy(dt1) {
    fetch(`/api/rmf/home/policycomponent/${props.county}/${start}/${end}`)
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

  const Bar = (params) => {
    return (
      <div
        onClick={() => {
          setSelected(params.txt);
        }}
        className={selected === params.txt ? "active" : "bar"}
      >
        <div></div>
        <p>{params.txt}</p>
      </div>
    );
  };

  return (
    <>
      {showing && (
        <div className="stats">
          <h1>{props.county} Dashboard</h1>
          <div className="welcome">
            <div className="options">
              <Bar txt="Main" />
              <Bar txt="Rural & Urban" />
              <Bar txt="WRM" />
              <Bar txt="Finance & Private Sector Engagement" />
              <Bar txt="Policy & Governance" />
            </div>

            <FiRefreshCcw
              onClick={() => {
                setRefresh(!refresh);
              }}
              className="refresh"
            />
          </div>

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
          </div>

          {selected === "Main" && <Top data={data} pathname={pathname} />}
          {selected === "Rural & Urban" && (
            <RuralUrban data={data} charts={charts} />
          )}
          {selected === "WRM" && <WRM data={data} charts={charts} />}
          {selected === "Finance & Private Sector Engagement" && (
            <Finance data={data} charts={charts} />
          )}
          {selected === "Policy & Governance" && (
            <Policy data={data} charts={charts} />
          )}
        </div>
      )}
    </>
  );
}

const TopItem = (props) => {
  const vl = useRef();

  useEffect(() => {
    animateValue(vl.current, 0, props.amount, 1000);
  }, [props.amount]);

  function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      obj.innerHTML =
        props.unit +
        " " +
        withCommas(Math.floor(progress * (end - start) + start)) +
        " " +
        props.percent;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }
  function withCommas(x) {
    return x?.toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ",");
  }

  return (
    <div className="tp_item">
      <div className="div1at">
        <h3>{props.title}</h3>
        <img src={kpiwheel} alt="" />
      </div>

      <h4 ref={vl}>{props.unit}</h4>

      <h6>{props.description}</h6>
    </div>
  );
};

const Top = (props) => {
  const p1ref = useRef();
  const [data, setData] = useState(null);
  const [chart1, setChart1] = useState(null);
  const [chart2, setChart2] = useState(null);

  function withCommas(x) {
    return x?.toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ",");
  }

  useEffect(() => {
    setData(props.data);
    if (props.data) {
      setChart1([
        { name: "Male", value: Math.round(props.data["WKW-1"] / 2) },
        {
          name: "Female",
          value: Math.round(props.data["WKW-1"] / 1.9),
        },
      ]);
      setChart2([
        { name: "Male", value: Math.round(props.data["WKW-2"] / 2) },
        { name: "Female", value: Math.round(props.data["WKW-2"] / 1.9) },
      ]);
    }
  }, [props.data]);

  const handleDownloadImage = async (printRef) => {
    const element = printRef.current;
    const canvas = await html2canvas(element);

    const data = canvas.toDataURL("image/jpg");
    const link = document.createElement("a");

    if (typeof link.download === "string") {
      link.href = data;
      link.download = "image.jpg";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(data);
    }
  };

  const saveData = (data) => {
    if (data.length > 0) {
      let rows = [];
      rows.push(Object.keys(data[0]));
      data.map((item) => {
        rows.push(Object.values(item));
      });
      let csvContent =
        "data:text/csv;charset=utf-8," +
        rows.map((e) => e.join(",")).join("\n");

      let encodedUri = encodeURI(csvContent);
      let link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "data.csv");
      document.body.appendChild(link);
      link.click();
    }
  };
  return (
    <>
      <div className="taskstats">
        <div className="left">
          <div className="bar">
            <div></div>
            <h2>Western Kenya Water Project</h2>
          </div>
          <div className="outer">
            <div className="ll">
              <div className="section">
                <div className="single">
                  <FaHandHoldingWater className="ts" />
                  <div>
                    <h4>
                      {data && data["WKW-1"] ? withCommas(data["WKW-1"]) : 0}
                    </h4>
                    <p>People gaining access to basic drinking water</p>
                  </div>
                </div>
              </div>

              <div className="section">
                <div className="single">
                  <RiCustomerService2Line className="ts" />
                  <div>
                    <h4>
                      {data && data["WKW-2"] ? withCommas(data["WKW-2"]) : 0}
                    </h4>
                    <p>People receiving improved service quality</p>
                  </div>
                </div>
              </div>

              <div className="section">
                <div className="single">
                  <MdOutlineManageHistory className="ts" />
                  <div>
                    <h4>
                      {data && data["WKW-4"] ? withCommas(data["WKW-4"]) : 0}
                    </h4>
                    <p>People benefiting from improved WRM</p>
                  </div>
                </div>
              </div>
              <div className="section">
                <div className="single">
                  <FaMoneyBill1Wave className="ts" />
                  <div>
                    <h4>
                      {data && data["WKW-4.3"]
                        ? withCommas(data["WKW-4.3"])
                        : 0}
                    </h4>
                    <p>New funding mobilized to the water sector</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="section">
              <div className="intro">
                <h1>WKWP is a 5-year Water Project funded by USAID</h1>
                <p>The Project goal is to:</p>
                <ul>
                  <li>
                    Increase the availability and access to rural and urban
                    water services, and
                  </li>
                  <li>The sustainable management of water resources</li>
                </ul>
                {props.pathname[2] === "Homabay" ? (
                  <div className="intro">
                    <p>
                      In Homabay County, the project targets to achieve the
                      following:
                    </p>
                    <ul>
                      <li>
                        50,000 people gaining access to basic drinking water
                        services.
                      </li>
                      <li>
                        35,000 people receiving improved service quality from an
                        existing basic drinking or safely managed water service.
                      </li>
                      <li>
                        30,000 people benefiting from implementation of measures
                        to improve water resources management.
                      </li>
                      <li>
                        20 water enterprises with improved water service
                        delivery models and cost recovery
                      </li>
                      <li>10% reduction in NRW in targeted WSP </li>
                      <li>$1.9 million in new funding mobilized</li>
                    </ul>
                  </div>
                ) : props.pathname[2] === "Bungoma" ? (
                  <div className="intro">
                    <p>
                      In Bungoma County, the project targets to achieve the
                      following:
                    </p>
                    <ul>
                      <li>
                        50,000 people gaining access to basic drinking water
                        services.
                      </li>
                      <li>
                        35,000 people receiving improved service quality from an
                        existing basic drinking or safely managed water service.
                      </li>
                      <li>
                        30,000 people benefiting from implementation of measures
                        to improve water resources management.
                      </li>
                      <li>
                        15 water enterprises with improved water service
                        delivery models and cost recovery
                      </li>
                      <li>10% reduction in NRW in targeted WSP </li>
                      <li>$1.9 million in new funding mobilized</li>
                    </ul>
                  </div>
                ) : props.pathname[2] === "Busia" ? (
                  <div className="intro">
                    <p>
                      In Busia County, the project targets to achieve the
                      following:
                    </p>
                    <ul>
                      <li>
                        50,000 people gaining access to basic drinking water
                        services.
                      </li>
                      <li>
                        35,000 people receiving improved service quality from an
                        existing basic drinking or safely managed water service.
                      </li>
                      <li>
                        30,000 people benefiting from implementation of measures
                        to improve water resources management.
                      </li>
                      <li>
                        20 water enterprises with improved water service
                        delivery models and cost recovery
                      </li>
                      <li>10% reduction in NRW in targeted WSP </li>
                      <li>$1.9 million in new funding mobilized</li>
                    </ul>
                  </div>
                ) : props.pathname[2] === "Kakamega" ? (
                  <div className="intro">
                    <p>
                      In Kakamega County, the project targets to achieve the
                      following:
                    </p>
                    <ul>
                      <li>
                        100,000 people gaining access to basic drinking water
                        services.
                      </li>
                      <li>
                        70,000 people receiving improved service quality from an
                        existing basic drinking or safely managed water service.
                      </li>
                      <li>
                        57,000 people benefiting from implementation of measures
                        to improve water resources management.
                      </li>
                      <li>
                        20 water enterprises with improved water service
                        delivery models and cost recovery
                      </li>
                      <li>10% reduction in NRW in targeted WSP </li>
                      <li>$2 million in new funding mobilized</li>
                    </ul>
                  </div>
                ) : props.pathname[2] === "Kisii" ? (
                  <div className="intro">
                    <p>
                      In Kisii County, the project targets to achieve the
                      following:
                    </p>
                    <ul>
                      <li>
                        50,000 people gaining access to basic drinking water
                        services.
                      </li>
                      <li>
                        35,000 people receiving improved service quality from an
                        existing basic drinking or safely managed water service.
                      </li>
                      <li>
                        30,000 people benefiting from implementation of measures
                        to improve water resources management.
                      </li>
                      <li>
                        20 water enterprises with improved water service
                        delivery models and cost recovery
                      </li>
                      <li>10% reduction in NRW in targeted WSP </li>
                      <li>$1.9 million in new funding mobilized</li>
                    </ul>
                  </div>
                ) : props.pathname[2] === "Kisumu" ? (
                  <div className="intro">
                    <p>
                      In Kisumu County, the project targets to achieve the
                      following:
                    </p>
                    <ul>
                      <li>
                        100,000 people gaining access to basic drinking water
                        services.
                      </li>
                      <li>
                        70,000 people receiving improved service quality from an
                        existing basic drinking or safely managed water service.
                      </li>
                      <li>
                        60,000 people benefiting from implementation of measures
                        to improve water resources management.
                      </li>
                      <li>
                        20 water enterprises with improved water service
                        delivery models and cost recovery
                      </li>
                      <li>10% reduction in NRW in targeted WSP </li>
                      <li>$2 million in new funding mobilized</li>
                    </ul>
                  </div>
                ) : props.pathname[2] === "Siaya" ? (
                  <div className="intro">
                    <p>
                      In Siaya County, the project targets to achieve the
                      following:
                    </p>
                    <ul>
                      <li>
                        50,000 people gaining access to basic drinking water
                        services.
                      </li>
                      <li>
                        35,000 people receiving improved service quality from an
                        existing basic drinking or safely managed water service.
                      </li>
                      <li>
                        30,000 people benefiting from implementation of measures
                        to improve water resources management.
                      </li>
                      <li>
                        20 water enterprises with improved water service
                        delivery models and cost recovery
                      </li>
                      <li>10% reduction in NRW in targeted WSP </li>
                      <li>$1.9 million in new funding mobilized</li>
                    </ul>
                  </div>
                ) : props.pathname[2] === "Migori" ? (
                  <div className="intro">
                    <p>
                      In Migori County, the project targets to achieve the
                      following:
                    </p>
                    <ul>
                      <li>
                        50,000 people gaining access to basic drinking water
                        services.
                      </li>
                      <li>
                        35,000 people receiving improved service quality from an
                        existing basic drinking or safely managed water service.
                      </li>
                      <li>
                        30,000 people benefiting from implementation of measures
                        to improve water resources management.
                      </li>
                      <li>
                        15 water enterprises with improved water service
                        delivery models and cost recovery
                      </li>
                      <li>10% reduction in NRW in targeted WSP </li>
                      <li>$1.9 million in new funding mobilized</li>
                    </ul>
                  </div>
                ) : (
                  ""
                )}
              </div>
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
              <h3>Access to Basic Drinking Water</h3>
              <GaugeChart
                className="gg"
                id="gauge-chart2"
                nrOfLevels={3}
                colors={["red", "orange", "green"]}
                arcWidth={0.3}
                percent={
                  data ? (data["WKW-1"] ? data["WKW-1"] / 500000 : 0) : 0
                }
                textColor="gray"
              />
            </div>
            <div className="section">
              <h3>Access to Improved Services Delivery</h3>
              <GaugeChart
                className="gg"
                id="gauge-chart2"
                nrOfLevels={3}
                colors={["red", "orange", "green"]}
                arcWidth={0.3}
                percent={
                  data ? (data["WKW-2"] ? data["WKW-2"] / 300000 : 0) : 0
                }
                textColor="gray"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const RuralUrban = (props) => {
  const p1ref = useRef();
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  const handleDownloadImage = async (printRef) => {
    const element = printRef.current;
    const canvas = await html2canvas(element);

    const data = canvas.toDataURL("image/jpg");
    const link = document.createElement("a");

    if (typeof link.download === "string") {
      link.href = data;
      link.download = "image.jpg";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(data);
    }
  };

  const saveData = (data) => {
    if (data.length > 0) {
      let rows = [];
      rows.push(Object.keys(data[0]));
      data.map((item) => {
        rows.push(Object.values(item));
      });
      let csvContent =
        "data:text/csv;charset=utf-8," +
        rows.map((e) => e.join(",")).join("\n");

      let encodedUri = encodeURI(csvContent);
      let link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "data.csv");
      document.body.appendChild(link);
      link.click();
    }
  };
  return (
    <div className="taskstats">
      <div className="left">
        <div className="bar">
          <div></div>
          <h2>Rural and Urban Water Services</h2>
        </div>

        <div className="outer">
          <div className="ll">
            <BoxItem
              amount={data && data["WKW-2.1"] ? data["WKW-2.1"] : 0}
              title="Number"
              unit=""
              percent=""
              img={sdm}
              description="Water service delivery models"
            />
            <BoxItem
              amount={data && data["WKW-1.5"] ? data["WKW-1.5"] : 0}
              title="Percentage"
              unit=""
              percent="%"
              img={nrw}
              description="Reduction in NRW in targeted WSPs"
              current={data && data["currWKW-1.5"] ? data["currWKW-1.5"] : 0}
              baseline={data && data["blineWKW-1.5"] ? data["blineWKW-1.5"] : 0}
            />
            <BoxItem
              amount={data && data["WKW-1.1"] ? data["WKW-1.1"] : 0}
              title="Number"
              unit=""
              percent=""
              img={o_m}
              description="WSPs achieving 100% O&M coverage"
            />
            <BoxItem
              amount={data && data["WKW-2.2"] ? data["WKW-2.2"] : 0}
              title="Number"
              unit=""
              percent=""
              img={regulated}
              description="Regulated rural enterprises"
            />
          </div>
          <div className="section">
            <h3>County Distribution</h3>
            <p>Access to basic drinking water</p>
            <CustomBarChart
              data={props?.charts?.RUBeneficiaries}
              aspect={isMobile ? 1 : 1.2}
              color="#BA0C2F"
            />
          </div>
        </div>
      </div>{" "}
      <div className="right">
        <div className="bar">
          <div></div>
          <h2>Performance</h2>
        </div>
        <div className="ll2">
          <div className="section">
            <p>Service delivery...</p>
            <GaugeChart
              className="gg"
              id="gauge-chart2"
              nrOfLevels={3}
              colors={["red", "orange", "green"]}
              percent={data ? (data["WKW-2.1"] ? data["WKW-2.1"] / 2 : 0) : 0}
              textColor="gray"
            />
          </div>
          <div className="section">
            <p>NRW...</p>
            <GaugeChart
              className="gg"
              id="gauge-chart2"
              nrOfLevels={10}
              colors={["red", "orange", "green"]}
              percent={data ? (data["WKW-1.5"] ? data["WKW-1.5"] / -2 : 0) : 0}
              textColor="gray"
            />
          </div>
          <div className="section">
            <p>O&M Coverage...</p>
            <GaugeChart
              className="gg"
              id="gauge-chart2"
              nrOfLevels={30}
              colors={["red", "orange", "green"]}
              percent={data ? (data["WKW-1.1"] ? data["WKW-1.1"] / 39 : 0) : 0}
              textColor="gray"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const WRM = (props) => {
  const p1ref = useRef();
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  const handleDownloadImage = async (printRef) => {
    const element = printRef.current;
    const canvas = await html2canvas(element);

    const data = canvas.toDataURL("image/jpg");
    const link = document.createElement("a");

    if (typeof link.download === "string") {
      link.href = data;
      link.download = "image.jpg";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(data);
    }
  };

  const saveData = (data) => {
    if (data.length > 0) {
      let rows = [];
      rows.push(Object.keys(data[0]));
      data.map((item) => {
        rows.push(Object.values(item));
      });
      let csvContent =
        "data:text/csv;charset=utf-8," +
        rows.map((e) => e.join(",")).join("\n");

      let encodedUri = encodeURI(csvContent);
      let link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "data.csv");
      document.body.appendChild(link);
      link.click();
    }
  };
  return (
    <div className="taskstats">
      <div className="left">
        <div className="bar">
          <div></div>
          <h2>Key Indicators</h2>
        </div>
        <div className="outer">
          <div className="ll">
            <BoxItem
              amount={data && data["WKW-3.4"] ? data["WKW-3.4"] : 0}
              description="WRUAs trained on effective WRM Practices"
              title="Number"
              unit=""
              percent=""
              img={training}
            />
            <BoxItem
              amount={data && data["WKW-3.3"] ? data["WKW-3.3"] : 0}
              description="No of Sub-Catchment Management Plans"
              title="Number"
              unit=""
              percent=""
              img={catchment}
            />
            <BoxItem
              amount={data && data["WKW-3.2"] ? data["WKW-3.2"] : 0}
              description="Payment for Ecosystem Services Action Plans Developed"
              title="Amount"
              unit="US$ "
              percent=""
              img={ecosystem}
            />
            <BoxItem
              amount={data && data["WKW-3.1"] ? data["WKW-3.1"] : 0}
              description="Digital Solutions Adopted and Operationalised"
              title="Percent"
              unit=""
              percent="%"
              img={digital}
            />
          </div>
          <div className="section">
            <h3>People benefiting from improved Water Resource Management</h3>
            <CustomBarChart
              data={props?.charts?.WRMBeneficiaries}
              aspect={isMobile ? 1 : 1.2}
              color="#002F6C"
            />
          </div>
        </div>
      </div>
      <div className="right">
        <div className="bar">
          <div></div>
          <h2>Performance</h2>
        </div>
        <div className="ll2">
          <div className="section">
            <p>WRUAs Trained...</p>
            <GaugeChart
              className="gg"
              id="gauge-chart2"
              nrOfLevels={3}
              colors={["red", "orange", "green"]}
              percent={data ? (data["WKW-3.4"] ? data["WKW-3.4"] / 20 : 0) : 0}
              textColor="gray"
            />
          </div>
          <div className="section">
            <p>Sub-catchment management...</p>
            <GaugeChart
              className="gg"
              id="gauge-chart2"
              nrOfLevels={10}
              colors={["red", "orange", "green"]}
              percent={data ? (data["WKW-3.3"] ? data["WKW-3.3"] / 6 : 0) : 0}
              textColor="gray"
            />
          </div>
          <div className="section">
            <p>Digital solutions...</p>
            <GaugeChart
              className="gg"
              id="gauge-chart2"
              nrOfLevels={30}
              colors={["red", "orange", "green"]}
              percent={data ? (data["WKW-3.1"] ? data["WKW-3.1"] / 20 : 0) : 0}
              textColor="gray"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const Finance = (props) => {
  const p1ref = useRef();
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  const handleDownloadImage = async (printRef) => {
    const element = printRef.current;
    const canvas = await html2canvas(element);

    const data = canvas.toDataURL("image/jpg");
    const link = document.createElement("a");

    if (typeof link.download === "string") {
      link.href = data;
      link.download = "image.jpg";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(data);
    }
  };

  const saveData = (data) => {
    if (data.length > 0) {
      let rows = [];
      rows.push(Object.keys(data[0]));
      data.map((item) => {
        rows.push(Object.values(item));
      });
      let csvContent =
        "data:text/csv;charset=utf-8," +
        rows.map((e) => e.join(",")).join("\n");

      let encodedUri = encodeURI(csvContent);
      let link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "data.csv");
      document.body.appendChild(link);
      link.click();
    }
  };
  return (
    <div className="taskstats">
      <div className="left">
        <div className="bar">
          <div></div>
          <h2>Key Indicators</h2>
        </div>
        <div className="outer">
          <div className="ll">
            <BoxItem
              amount={data && data["WKW-4.1"] ? data["WKW-4.1"] : 0}
              description="Instruments Set up to Mobilize Private/Public Sector"
              title="Number"
              unit=""
              percent=""
              img={instruments}
            />
            <BoxItem
              amount={data && data["WKW-4.3"] ? data["WKW-4.3"] : 0}
              description="New Funding Mobilized to the Water Sector"
              title="Value"
              unit="US$"
              percent=""
              img={mobilized}
            />
            <BoxItem
              amount={data && data["WKW-4.6"] ? data["WKW-4.6"] : 0}
              description="Value of Private Sector Resources Leveraged"
              title="Value"
              unit="US$"
              percent=""
              img={leveraged}
            />
            <BoxItem
              amount={data && data["WKW-4.4"] ? data["WKW-4.4"] : 0}
              description="Number of Agreements Formalized"
              title="Number"
              unit=""
              percent=""
              img={agreements}
            />
          </div>
          <div className="section">
            <h3>
              Value of new funding mobilized to the water and sanitation sector
            </h3>
            <CustomBarChart
              data={props?.charts?.FnFunding}
              aspect={isMobile ? 1 : 1.2}
              color="#BA0C2F"
            />
          </div>
        </div>
      </div>
      <div className="right">
        <div className="bar">
          <div></div>
          <h2>Performance</h2>
        </div>
        <div className="ll2">
          <div className="section">
            <p>Instruments...</p>
            <GaugeChart
              className="gg"
              id="gauge-chart2"
              nrOfLevels={3}
              colors={["red", "orange", "green"]}
              percent={data ? (data["WKW-4.1"] ? data["WKW-4.1"] / 1 : 0) : 0}
              textColor="gray"
            />
          </div>
          <div className="section">
            <p>New Funding...</p>
            <GaugeChart
              className="gg"
              id="gauge-chart2"
              nrOfLevels={10}
              colors={["red", "orange", "green"]}
              percent={
                data ? (data["WKW-4.3"] ? data["WKW-4.3"] / 4000000 : 0) : 0
              }
              textColor="gray"
            />
          </div>
          <div className="section">
            <p>Agreements...</p>
            <GaugeChart
              className="gg"
              id="gauge-chart2"
              nrOfLevels={30}
              colors={["red", "orange", "green"]}
              percent={data ? (data["WKW-4.4"] ? data["WKW-4.4"] / 4 : 0) : 0}
              textColor="gray"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const Policy = (props) => {
  const p1ref = useRef();
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  const handleDownloadImage = async (printRef) => {
    const element = printRef.current;
    const canvas = await html2canvas(element);

    const data = canvas.toDataURL("image/jpg");
    const link = document.createElement("a");

    if (typeof link.download === "string") {
      link.href = data;
      link.download = "image.jpg";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(data);
    }
  };

  const saveData = (data) => {
    if (data.length > 0) {
      let rows = [];
      rows.push(Object.keys(data[0]));
      data.map((item) => {
        rows.push(Object.values(item));
      });
      let csvContent =
        "data:text/csv;charset=utf-8," +
        rows.map((e) => e.join(",")).join("\n");

      let encodedUri = encodeURI(csvContent);
      let link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "data.csv");
      document.body.appendChild(link);
      link.click();
    }
  };
  return (
    <div className="taskstats">
      <div className="left">
        <div className="bar">
          <div></div>
          <h2>Policy & Governance</h2>
        </div>
        <div className="outer">
          <div className="ll">
            <BoxItem
              amount={data && data["WKW-5.3"] ? data["WKW-5.3"] : 0}
              description="Policies, Laws, and/or Guidelines Developed and/or Implemented"
              title="Number"
              unit=""
              percent=""
              img={laws}
            />
            <BoxItem
              amount={data && data["WKW-5.4"] ? data["WKW-5.4"] : 0}
              description="Officials trained on Corporate Governance"
              title="Number"
              unit=""
              percent=""
              img={governance}
            />
            <BoxItem
              amount={data && data["WKW-5.2"] ? data["WKW-5.2"] : 0}
              description="Institutions with improved capacity to address climate change risks"
              title="Number"
              unit=""
              percent=""
              img={climate}
            />
            <BoxItem
              amount={data && data["WKW-5.1"] ? data["WKW-5.1"] : 0}
              description="Increase in county budgetary allocations for Water"
              title="Percentage"
              unit=""
              percent="%"
              img={budget}
            />
          </div>
          <div className="section">
            <h3>Developed Policies</h3>
            <CustomBarChart
              data={props?.charts?.PgPolicies}
              aspect={isMobile ? 1 : 1.2}
              color="#BA0C2F"
            />
          </div>
        </div>
      </div>
      <div className="right">
        <div className="bar">
          <div></div>
          <h2>Performance</h2>
        </div>
        <div className="ll2">
          <div className="section">
            <p>Policies...</p>
            <GaugeChart
              className="gg"
              id="gauge-chart2"
              nrOfLevels={3}
              colors={["red", "orange", "green"]}
              percent={data ? (data["WKW-5.3"] ? data["WKW-5.3"] / 4 : 0) : 0}
              textColor="gray"
            />
          </div>
          <div className="section">
            <p>Officials trained...</p>
            <GaugeChart
              className="gg"
              id="gauge-chart2"
              nrOfLevels={10}
              colors={["red", "orange", "green"]}
              percent={data ? (data["WKW-5.4"] ? data["WKW-5.4"] / 52 : 0) : 0}
              textColor="gray"
            />
          </div>
          <div className="section">
            <p>Institutions...</p>
            <GaugeChart
              className="gg"
              id="gauge-chart2"
              nrOfLevels={30}
              colors={["red", "orange", "green"]}
              percent={data ? (data["WKW-5.2"] ? data["WKW-5.2"] / 10 : 0) : 0}
              textColor="gray"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
