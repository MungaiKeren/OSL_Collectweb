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

export default function Stats(props) {
  const [data, setData] = useState({});
  const [charts, setCharts] = useState(null);
  const [cCharts, setCcharts] = useState(null);
  const [showing, setShowing] = useState(true);
  const [year, setYear] = useState("2023");
  const [selected, setSelected] = useState("Main");
  const [active, setActive] = useState(year);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [refresh, setRefresh] = useState(false);

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
    getChartsBasedOnClickedItem();
    fetch(`/api/rmf/home/charts/${start}/${end}`)
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
    fetch(`/api/rmf/home/crosscutting/null/${start}/${end}`)
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
    fetch(`/api/rmf/home/urbancomponent/null/${start}/${end}`)
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
    fetch(`/api/rmf/home/ruralcomponent/null/${start}/${end}`)
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
    fetch(`/api/rmf/home/wrmcomponent/null/${start}/${end}`)
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
    fetch(`/api/rmf/home/financecomponent/null/${start}/${end}`)
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

  async function getChartsBasedOnClickedItem() {
    fetch(`/api/rmf/ind/pg/charts/${start}/${end}`)
      .then((res) => {
        if (res.ok) return res.json();
        else throw Error("");
      })
      .then((data) => {
        setCcharts(data);
      })
      .catch((err) => {});
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
          <h1>Dashboard</h1>
          <div className="welcome">
            <div className="options">
              <Bar txt="Main" />
              <Bar txt="Rural" />
              <Bar txt="Urban" />
              <Bar txt="WRM" />
              <Bar txt="Finance & Private Sector Engagement" />
              <Bar txt="Policy & Governance" />
            </div>
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

            <FiRefreshCcw
              onClick={() => {
                setRefresh(!refresh);
              }}
              className="refresh"
            />
          </div>

          {selected === "Main" && <Top data={data} />}
          {selected === "Rural" && (
            <Rural data={data} charts={charts} cCharts={cCharts} />
          )}
          {selected === "Urban" && (
            <Urban data={data} charts={charts} cCharts={cCharts} />
          )}
          {selected === "WRM" && (
            <WRM data={data} charts={charts} cCharts={cCharts} />
          )}
          {selected === "Finance & Private Sector Engagement" && (
            <Finance data={data} charts={charts} cCharts={cCharts} />
          )}
          {selected === "Policy & Governance" && (
            <Policy data={data} charts={charts} cCharts={cCharts} />
          )}
        </div>
      )}
    </>
  );
}

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
                <p>
                  The project is targeting eight Lake Region counties -{" "}
                  <b>
                    Bungoma, Busia, Kakamega, Siaya, Homabay, Kisii, Kisumu, and
                    Migori.
                  </b>
                </p>
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
                  data
                    ? data["WKW-1"]
                      ? data["WKW-1"] / 500000 > 1
                        ? 1
                        : data["WKW-1"] / 500000
                      : 0
                    : 0
                }
                // percent={
                //   data ? (data["WKW-1"] ? data["WKW-1"] / 500000 : 0) : 0
                // }
                textColor="gray"
              />
              <div className="">
                <p className="bold">
                  Performance: {withCommas(data && data["WKW-1"])}
                </p>
                <p className="bold">Target: {withCommas(500000)}</p>

                {data &&
                  (data["WKW-1"] / 500000 > 1 ? (
                    <p className="bolds">
                      Actual Performance:{" "}
                      {((data["WKW-1"] / 500000) * 100).toFixed(2)} %
                    </p>
                  ) : (
                    <></>
                  ))}
              </div>
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
                  data
                    ? data["WKW-2"]
                      ? data["WKW-2"] / 300000 > 1
                        ? 1
                        : data["WKW-2"] / 300000
                      : 0
                    : 0
                }
                textColor="gray"
              />
              <div className="">
                <p className="bold">
                  Performance: {withCommas(data && data["WKW-2"])}
                </p>
                <p className="bold">Target: {withCommas(300000)}</p>
                {data &&
                  (data["WKW-2"] / 300000 > 1 ? (
                    <p className="bolds">
                      Actual Performance:{" "}
                      {((data["WKW-2"] / 300000) * 100).toFixed(2)} %
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

const Rural = (props) => {
  const p1ref = useRef();
  const [data, setData] = useState(null);
  const [chartTitle, setChartTitle] = useState("County Distribution");
  const [clickedItemCode, setClickedItemCode] = useState("");
  const [active, setActive] = useState("");

  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  function withCommas(x) {
    return x?.toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ",");
  }

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

  const handleClick = (title, code) => {
    setChartTitle(title);
    setActive(title);
    setClickedItemCode(code);
  };
  return (
    <div className="taskstats">
      <div className="left">
        <div className="bar">
          <div></div>
          <h2>Rural Water Services</h2>
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
              onClick={() => {
                handleClick("Water service delivery models", "WKW21");
              }}
              active={active === "Water service delivery models" ? active : ""}
            />
            <BoxItem
              amount={data && data["WKW-2.2"] ? data["WKW-2.2"] : 0}
              title="Number"
              unit=""
              percent=""
              img={regulated}
              description="Regulated rural enterprises"
              onClick={() => {
                handleClick("Regulated rural enterprises", "WKW22");
              }}
              active={active === "Regulated rural enterprises" ? active : ""}
            />
            <BoxItem
              amount={data && data["WKW-2.3"] ? data["WKW-2.3"] : 0}
              title="Number"
              unit=""
              percent=""
              img={sdm}
              description="Drinking Water Systems"
              onClick={() => {
                handleClick("Drinking Water Systems", "WKW23");
              }}
              active={active === "Drinking Water Systems" ? active : ""}
            />
            <BoxItem
              amount={data && data["WKW-2.4"] ? data["WKW-2.4"] : 0}
              title="Number"
              unit=""
              percent=""
              img={sdm}
              description="Microenterprises supported by USG assistance"
              onClick={() => {
                handleClick(
                  "Microenterprises supported by USG assistance",
                  "WKW24"
                );
              }}
              active={
                active === "Microenterprises supported by USG assistance"
                  ? active
                  : ""
              }
            />
          </div>
          <div className="section">
            <h3>{chartTitle}</h3>
            {clickedItemCode ? (
              <CustomBarChart
                data={props?.cCharts?.[clickedItemCode]}
                aspect={isMobile ? 1 : 1.2}
                color="#BA0C2F"
              />
            ) : (
              <CustomBarChart
                data={props?.charts?.PgPolicies}
                aspect={isMobile ? 1 : 1.2}
                color="#BA0C2F"
              />
            )}
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
            <p>Performance: {withCommas(data && data["WKW-2.1"])}</p>
            <p>Target: {withCommas(2)}</p>
            {data &&
              (data["WKW-2.1"] / 2 > 1 ? (
                <p className="bolds">
                  Actual Performance: {((data["WKW-2.1"] / 2) * 100).toFixed(2)}{" "}
                  %
                </p>
              ) : (
                <></>
              ))}
            <GaugeChart
              className="gg"
              id="gauge-chart2"
              nrOfLevels={3}
              colors={["red", "orange", "green"]}
              percent={
                data
                  ? data["WKW-2.1"]
                    ? data["WKW-2.1"] / 2 > 1
                      ? 1
                      : data["WKW-2.1"] / 2
                    : 0
                  : 0
              }
              textColor="gray"
            />
          </div>
          <div className="section">
            <p>Regulatory oversight...</p>
            <p>Performance: {withCommas(data && data["WKW-2.2"])}</p>
            <p>Target: {withCommas(26)}</p>
            {data &&
              (data["WKW-2.2"] / 26 > 1 ? (
                <p className="bolds">
                  Actual Performance:{" "}
                  {((data["WKW-2.2"] / 26) * 100).toFixed(2)} %
                </p>
              ) : (
                <></>
              ))}
            <GaugeChart
              className="gg"
              id="gauge-chart2"
              nrOfLevels={5}
              colors={["red", "orange", "green"]}
              percent={
                data
                  ? data["WKW-2.2"]
                    ? data["WKW-2.2"] / 26 > 1
                      ? 1
                      : data["WKW-2.2"] / 26
                    : 0
                  : 0
              }
              textColor="gray"
            />
          </div>
          <div className="section">
            <p>Drinking Water Systems...</p>
            <p>Performance: {withCommas(data && data["WKW-2.3"])}</p>
            <p>Target: {withCommas(35)}</p>
            {data &&
              (data["WKW-2.3"] / 35 > 1 ? (
                <p className="bolds">
                  Actual Performance:{" "}
                  {((data["WKW-2.3"] / 35) * 100).toFixed(2)} %
                </p>
              ) : (
                <></>
              ))}
            <GaugeChart
              className="gg"
              id="gauge-chart2"
              nrOfLevels={30}
              colors={["red", "orange", "green"]}
              percent={
                data
                  ? data["WKW-2.3"]
                    ? data["WKW-2.3"] / 35 > 1
                      ? 1
                      : data["WKW-2.3"] / 35
                    : 0
                  : 0
              }
              textColor="gray"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const Urban = (props) => {
  const p1ref = useRef();
  const [data, setData] = useState(null);
  const [chartTitle, setChartTitle] = useState("County Distribution");
  const [clickedItemCode, setClickedItemCode] = useState("");
  const [active, setActive] = useState("");

  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  function withCommas(x) {
    return x?.toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ",");
  }

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

  const handleClick = (title, code) => {
    setChartTitle(title);
    setActive(title);
    setClickedItemCode(code);
  };
  return (
    <div className="taskstats">
      <div className="left">
        <div className="bar">
          <div></div>
          <h2>Urban Water Services</h2>
        </div>

        <div className="outer">
          <div className="ll">
            <BoxItem
              amount={data && data["WKW-1.2"] ? data["WKW-1.2"] : 0}
              title="Number"
              unit=""
              percent=""
              img={sdm}
              description="WSPs implementing PIPs informed by system data"
              onClick={() => {
                handleClick(
                  "WSPs implementing PIPs informed by system data",
                  "WKW12"
                );
              }}
              active={
                active === "WSPs implementing PIPs informed by system data"
                  ? active
                  : ""
              }
            />
            <BoxItem
              amount={data && data["WKW-1.3"] ? data["WKW-1.3"] : 0}
              title="Number"
              unit=""
              percent=""
              img={sdm}
              description="WSPs with Water Safety Plans approved"
              onClick={() => {
                handleClick("WSPs with Water Safety Plans approved", "WKW13");
              }}
              active={
                active === "WSPs with Water Safety Plans approved" ? active : ""
              }
            />
            <BoxItem
              amount={data && data["WKW-1.4"] ? data["WKW-1.4"] : 0}
              title="Number"
              unit=""
              percent=""
              img={o_m}
              description="WSPs with Business Plans"
              onClick={() => {
                handleClick("WSPs with Business Plans", "WKW14");
              }}
              active={active === "WSPs with Business Plans" ? active : ""}
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
              onClick={() => {
                handleClick("Reduction in NRW in targeted WSPs", "WKW15");
              }}
              active={
                active === "Reduction in NRW in targeted WSPs" ? active : ""
              }
            />
          </div>
          <div className="section">
            <h3>{chartTitle}</h3>
            {clickedItemCode ? (
              <CustomBarChart
                data={props?.cCharts?.[clickedItemCode]}
                aspect={isMobile ? 1 : 1.2}
                color="#BA0C2F"
              />
            ) : (
              <CustomBarChart
                data={props?.charts?.PgPolicies}
                aspect={isMobile ? 1 : 1.2}
                color="#BA0C2F"
              />
            )}
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
            <p>NRW...</p>
            <p>Performance: {withCommas(data && data["WKW-1.5"])}</p>
            <p>Target: {withCommas(-2)}</p>
            {data &&
              (data["WKW-1.5"] / -2 > 1 ? (
                <p className="bolds">
                  Actual Performance:{" "}
                  {((data["WKW-1.5"] / -2) * 100).toFixed(2)} %
                </p>
              ) : (
                <></>
              ))}
            <GaugeChart
              className="gg"
              id="gauge-chart2"
              nrOfLevels={10}
              colors={["red", "orange", "green"]}
              percent={
                data
                  ? data["WKW-1.5"]
                    ? data["WKW-1.5"] / -2 > 1
                      ? 1
                      : data["WKW-1.5"] / -2
                    : 0
                  : 0
              }
              textColor="gray"
            />
          </div>
          <div className="section">
            <p>O&M Coverage...</p>
            <p>Performance: {withCommas(data && data["WKW-1.1"])}</p>
            <p>Target: {withCommas(39)}</p>
            {data &&
              (data["WKW-1.1"] / 39 > 1 ? (
                <p className="bolds">
                  Actual Performance:{" "}
                  {((data["WKW-1.1"] / 39) * 100).toFixed(2)} %
                </p>
              ) : (
                <></>
              ))}
            <GaugeChart
              className="gg"
              id="gauge-chart2"
              nrOfLevels={30}
              colors={["red", "orange", "green"]}
              percent={
                data
                  ? data["WKW-1.1"]
                    ? data["WKW-1.1"] / 39 > 1
                      ? 1
                      : data["WKW-1.1"] / 39
                    : 0
                  : 0
              }
              textColor="gray"
            />
          </div>
          <div className="section">
            <p>Water Safety Plans Approved...</p>
            <p>Performance: {withCommas(data && data["WKW-1.3"])}</p>
            <p>Target: {withCommas(2)}</p>
            {data &&
              (data["WKW-1.3"] / 2 > 1 ? (
                <p className="bolds">
                  Actual Performance: {((data["WKW-1.3"] / 2) * 100).toFixed(2)}{" "}
                  %
                </p>
              ) : (
                <></>
              ))}
            <GaugeChart
              className="gg"
              id="gauge-chart2"
              nrOfLevels={3}
              colors={["red", "orange", "green"]}
              percent={
                data
                  ? data["WKW-1.3"]
                    ? data["WKW-1.3"] / 2 > 1
                      ? 1
                      : data["WKW-1.3"] / 2
                    : 0
                  : 0
              }
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
  const [chartTitle, setChartTitle] = useState(
    "People benefiting from improved Water Resource Management"
  );
  const [clickedItemCode, setClickedItemCode] = useState("");
  const [active, setActive] = useState("");

  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  function withCommas(x) {
    return x?.toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ",");
  }

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

  const handleClick = (title, code) => {
    setChartTitle(title);
    setActive(title);
    setClickedItemCode(code);
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
              onClick={() =>
                handleClick("WRUAs trained on effective WRM Practices", "WKW34")
              }
              active={
                active === "WRUAs trained on effective WRM Practices"
                  ? active
                  : ""
              }
            />
            <BoxItem
              amount={data && data["WKW-3.3"] ? data["WKW-3.3"] : 0}
              description="No of Sub-Catchment Management Plans"
              title="Number"
              unit=""
              percent=""
              img={catchment}
              onClick={() =>
                handleClick("No of Sub-Catchment Management Plans", "WKW33")
              }
              active={
                active === "No of Sub-Catchment Management Plans" ? active : ""
              }
            />
            <BoxItem
              amount={data && data["WKW-3.2"] ? data["WKW-3.2"] : 0}
              description="Payment for Ecosystem Services Action Plans Developed"
              title="Amount"
              unit="US$ "
              percent=""
              img={ecosystem}
              onClick={() =>
                handleClick(
                  "Payment for Ecosystem Services Action Plans Developed",
                  "WKW32"
                )
              }
              active={
                active ===
                "Payment for Ecosystem Services Action Plans Developed"
                  ? active
                  : ""
              }
            />
            <BoxItem
              amount={data && data["WKW-3.1"] ? data["WKW-3.1"] : 0}
              description="Digital Solutions Adopted and Operationalised"
              title="Percent"
              unit=""
              percent="%"
              img={digital}
              onClick={() =>
                handleClick(
                  "Digital Solutions Adopted and Operationalised",
                  "WKW31"
                )
              }
              active={
                active === "Digital Solutions Adopted and Operationalised"
                  ? active
                  : ""
              }
            />
          </div>
          <div className="section">
            <h3>{chartTitle}</h3>
            {clickedItemCode ? (
              <CustomBarChart
                data={props?.cCharts?.[clickedItemCode]}
                aspect={isMobile ? 1 : 1.2}
                color="#BA0C2F"
              />
            ) : (
              <CustomBarChart
                data={props?.charts?.PgPolicies}
                aspect={isMobile ? 1 : 1.2}
                color="#BA0C2F"
              />
            )}
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
            <p>Performance: {withCommas(data && data["WKW-3.4"])}</p>
            <p>Target: {withCommas(20)}</p>
            {data &&
              (data["WKW-3.4"] / 20 > 1 ? (
                <p className="bolds">
                  Actual Performance:{" "}
                  {((data["WKW-3.4"] / 20) * 100).toFixed(2)} %
                </p>
              ) : (
                <></>
              ))}
            <GaugeChart
              className="gg"
              id="gauge-chart2"
              nrOfLevels={3}
              colors={["red", "orange", "green"]}
              percent={
                data
                  ? data["WKW-3.4"]
                    ? data["WKW-3.4"] / 20 > 1
                      ? 1
                      : data["WKW-3.4"] / 20
                    : 0
                  : 0
              }
              textColor="gray"
            />
          </div>
          <div className="section">
            <p>Sub-catchment management...</p>
            <p>Performance: {withCommas(data && data["WKW-3.3"])}</p>
            <p>Target: {withCommas(6)}</p>
            {data &&
              (data["WKW-3.3"] / 6 > 1 ? (
                <p className="bolds">
                  Actual Performance: {((data["WKW-3.3"] / 6) * 100).toFixed(2)}{" "}
                  %
                </p>
              ) : (
                <></>
              ))}
            <GaugeChart
              className="gg"
              id="gauge-chart2"
              nrOfLevels={10}
              colors={["red", "orange", "green"]}
              percent={
                data
                  ? data["WKW-3.3"]
                    ? data["WKW-3.3"] / 6 > 1
                      ? 1
                      : data["WKW-3.3"] / 6
                    : 0
                  : 0
              }
              textColor="gray"
            />
          </div>
          <div className="section">
            <p>Digital solutions...</p>
            <p>Performance: {withCommas(data && data["WKW-3.1"])}</p>
            <p>Target: {withCommas(20)}</p>
            {data &&
              (data["WKW-3.1"] / 20 > 1 ? (
                <p className="bolds">
                  Actual Performance:{" "}
                  {((data["WKW-3.1"] / 20) * 100).toFixed(2)} %
                </p>
              ) : (
                <></>
              ))}
            <GaugeChart
              className="gg"
              id="gauge-chart2"
              nrOfLevels={10}
              colors={["red", "orange", "green"]}
              percent={
                data
                  ? data["WKW-3.1"]
                    ? data["WKW-3.1"] / 20 > 1
                      ? 1
                      : data["WKW-3.1"] / 20
                    : 0
                  : 0
              }
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
  const [chartTitle, setChartTitle] = useState(
    "Value of new funding mobilized to the water and sanitation sector"
  );
  const [clickedItemCode, setClickedItemCode] = useState("");
  const [active, setActive] = useState("");

  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  function withCommas(x) {
    return x?.toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ",");
  }

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

  const handleClick = (title, code) => {
    setChartTitle(title);
    setActive(title);
    setClickedItemCode(code);
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
              onClick={() =>
                handleClick(
                  "Instruments Set up to Mobilize Private/Public Sector",
                  "WKW41"
                )
              }
              active={
                active ===
                "Instruments Set up to Mobilize Private/Public Sector"
                  ? active
                  : ""
              }
            />
            <BoxItem
              amount={data && data["WKW-4.3"] ? data["WKW-4.3"] : 0}
              description="New Funding Mobilized to the Water Sector"
              title="Value"
              unit="US$"
              percent=""
              img={mobilized}
              onClick={() =>
                handleClick(
                  "New Funding Mobilized to the Water Sector",
                  "WKW43"
                )
              }
              active={
                active === "New Funding Mobilized to the Water Sector"
                  ? active
                  : ""
              }
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
            <h3>{chartTitle}</h3>
            {clickedItemCode ? (
              <CustomBarChart
                data={props?.cCharts?.[clickedItemCode]}
                aspect={isMobile ? 1 : 1.2}
                color="#BA0C2F"
              />
            ) : (
              <CustomBarChart
                data={props?.charts?.FnFunding}
                aspect={isMobile ? 1 : 1.2}
                color="#BA0C2F"
              />
            )}
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
            <p>Performance: {withCommas(data && data["WKW-4.1"])}</p>
            <p>Target: {withCommas(1)}</p>
            {data &&
              (data["WKW-4.1"] / 1 > 1 ? (
                <p className="bolds">
                  Actual Performance: {((data["WKW-4.1"] / 1) * 100).toFixed(2)}{" "}
                  %
                </p>
              ) : (
                <></>
              ))}
            <GaugeChart
              className="gg"
              id="gauge-chart2"
              nrOfLevels={3}
              colors={["red", "orange", "green"]}
              percent={
                data
                  ? data["WKW-4.1"]
                    ? data["WKW-4.1"] / 1 > 1
                      ? 1
                      : data["WKW-4.1"] / 1
                    : 0
                  : 0
              }
              textColor="gray"
            />
          </div>
          <div className="section">
            <p>New Funding...</p>
            <p>Performance: {withCommas(data && data["WKW-4.3"])}</p>
            <p>Target: {withCommas(4000000)}</p>
            {data &&
              (data["WKW-4.3"] / 4000000 > 1 ? (
                <p className="bolds">
                  Actual Performance:{" "}
                  {((data["WKW-4.3"] / 4000000) * 100).toFixed(2)} %
                </p>
              ) : (
                <></>
              ))}
            <GaugeChart
              className="gg"
              id="gauge-chart2"
              nrOfLevels={10}
              colors={["red", "orange", "green"]}
              percent={
                data
                  ? data["WKW-4.3"]
                    ? data["WKW-4.3"] / 4000000 > 1
                      ? 1
                      : data["WKW-4.3"] / 4000000
                    : 0
                  : 0
              }
              textColor="gray"
            />
          </div>
          <div className="section">
            <p>Agreements...</p>
            <p>Performance: {withCommas(data && data["WKW-4.4"])}</p>
            <p>Target: {4}</p>
            {data &&
              (data["WKW-4.4"] / 4 > 1 ? (
                <p className="bolds">
                  Actual Performance: {((data["WKW-4.4"] / 4) * 100).toFixed(2)}{" "}
                  %
                </p>
              ) : (
                <></>
              ))}
            <GaugeChart
              className="gg"
              id="gauge-chart2"
              nrOfLevels={30}
              colors={["red", "orange", "green"]}
              percent={
                data
                  ? data["WKW-4.4"]
                    ? data["WKW-4.4"] / 4 > 1
                      ? 1
                      : data["WKW-4.4"] / 4
                    : 0
                  : 0
              }
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
  const [chartTitle, setChartTitle] = useState("Developed Policies");
  const [clickedItemCode, setClickedItemCode] = useState("");
  const [active, setActive] = useState("");

  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  function withCommas(x) {
    return x?.toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ",");
  }

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

  const handleClick = (title, code) => {
    setChartTitle(title);
    setActive(title);
    setClickedItemCode(code);
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
              onClick={() => {
                handleClick(
                  "Policies, Laws, and/or Guidelines Developed and/or Implemented",
                  "WKW53"
                );
              }}
              active={
                active ===
                "Policies, Laws, and/or Guidelines Developed and/or Implemented"
                  ? active
                  : ""
              }
            />
            <BoxItem
              amount={data && data["WKW-5.4"] ? data["WKW-5.4"] : 0}
              description="Officials trained on Corporate Governance"
              title="Number"
              unit=""
              percent=""
              img={governance}
              onClick={() =>
                handleClick(
                  "Officials trained on Corporate Governance",
                  "WKW54"
                )
              }
              active={
                active === "Officials trained on Corporate Governance"
                  ? active
                  : ""
              }
            />
            <BoxItem
              amount={data && data["WKW-5.2"] ? data["WKW-5.2"] : 0}
              description="Institutions with improved capacity to address climate change risks"
              title="Number"
              unit=""
              percent=""
              img={climate}
              onClick={() =>
                handleClick(
                  "Institutions with improved capacity to address climate change risks",
                  "WKW52"
                )
              }
              active={
                active ===
                "Institutions with improved capacity to address climate change risks"
                  ? active
                  : ""
              }
            />
            <BoxItem
              amount={data && data["WKW-5.1"] ? data["WKW-5.1"] : 0}
              description="Increase in county budgetary allocations for Water"
              title="Percentage"
              unit=""
              percent="%"
              img={budget}
              onClick={() =>
                handleClick(
                  "Increase in county budgetary allocations for Water",
                  "WKW51"
                )
              }
              active={
                active === "Increase in county budgetary allocations for Water"
                  ? active
                  : ""
              }
            />
          </div>
          <div className="section">
            <h3>{chartTitle}</h3>
            {clickedItemCode ? (
              <CustomBarChart
                data={props?.cCharts?.[clickedItemCode]}
                aspect={isMobile ? 1 : 1.2}
                color="#BA0C2F"
              />
            ) : (
              <CustomBarChart
                data={props?.charts?.PgPolicies}
                aspect={isMobile ? 1 : 1.2}
                color="#BA0C2F"
              />
            )}
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
            <p>Performance: {withCommas(data && data["WKW-5.3"])}</p>
            <p>Target: {withCommas(4)}</p>
            {data &&
              (data["WKW-5.3"] / 4 > 1 ? (
                <p className="bolds">
                  Actual Performance: {((data["WKW-5.3"] / 4) * 100).toFixed(2)}{" "}
                  %
                </p>
              ) : (
                <></>
              ))}
            <GaugeChart
              className="gg"
              id="gauge-chart2"
              nrOfLevels={3}
              colors={["red", "orange", "green"]}
              percent={
                data
                  ? data["WKW-5.3"]
                    ? data["WKW-5.3"] / 4 > 1
                      ? 1
                      : data["WKW-5.3"] / 4
                    : 0
                  : 0
              }
              textColor="gray"
            />
          </div>
          <div className="section">
            <p>Officials trained...</p>
            <p>Performance: {withCommas(data && data["WKW-5.4"])}</p>
            <p>Target: {withCommas(52)}</p>
            {data &&
              (data["WKW-5.4"] / 52 > 1 ? (
                <p className="bolds">
                  Actual Performance:{" "}
                  {((data["WKW-5.4"] / 52) * 100).toFixed(2)} %
                </p>
              ) : (
                <></>
              ))}
            <GaugeChart
              className="gg"
              id="gauge-chart2"
              nrOfLevels={10}
              colors={["red", "orange", "green"]}
              percent={
                data
                  ? data["WKW-5.4"]
                    ? data["WKW-5.4"] / 52 > 1
                      ? 1
                      : data["WKW-5.4"] / 52
                    : 0
                  : 0
              }
              textColor="gray"
            />
          </div>
          <div className="section">
            <p>Institutions...</p>
            <p>Performance: {withCommas(data && data["WKW-5.2"])}</p>
            <p>Target: {withCommas(10)}</p>
            {data &&
              (data["WKW-5.2"] / 10 > 1 ? (
                <p className="bolds">
                  Actual Performance:{" "}
                  {((data["WKW-5.2"] / 10) * 100).toFixed(2)} %
                </p>
              ) : (
                <></>
              ))}
            <GaugeChart
              className="gg"
              id="gauge-chart2"
              nrOfLevels={30}
              colors={["red", "orange", "green"]}
              percent={
                data
                  ? data["WKW-5.2"]
                    ? data["WKW-5.2"] / 10 > 1
                      ? 1
                      : data["WKW-5.2"] / 10
                    : 0
                  : 0
              }
              textColor="gray"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
