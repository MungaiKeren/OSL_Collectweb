import html2canvas from "html2canvas";
import { useEffect, useRef, useState } from "react";
import { BsDownload } from "react-icons/bs";
import "../../../Styles/singleComponent.scss";
import kpiwheel from "../../../assets/imgs/KPIWheel.svg";
import BoxItem from "../../Stats/BoxItem";
import CustomPieChart from "../../Stats/CustomPieChart";

export default function SingleComponent(props) {
  const [monthlyStats, setMonthlyStats] = useState(null);
  const [projects, setProjects] = useState(null);
  const chrt = useRef(null);
  const [showing, setShowing] = useState(true);
  const [aspect, setAspect] = useState(1.5);
  const [aspect1, setAspect1] = useState(1.5);
  const [internal, setInternal] = useState(null);
  const [external, setExternal] = useState(null);

  const p1ref = useRef();
  const l2ref = useRef();
  const b1ref = useRef();
  const b2ref = useRef();



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

  useEffect(() => {
    setShowing(false);
    setTimeout(() => {
      setShowing(true);
    }, 1);
  }, [props.showing]);



  return (
    <>
      {showing && (
        <div className="singleComponent">
          <div className="top">
            <div className="title">
              <h3>{props.title}</h3>
              <p>KPIs</p>
            </div>
            {<div className="midtop">
              <BoxItem
                amount={props.data?.ATW}
                target="440"
                component="Access to Basic Drinking Water"
              />
              <BoxItem
                amount={props.data?.ISD}
                target="71000"
                component="Access to Improved Service Quality"
              />
              <BoxItem
                amount={props.data?.RU_NewConnections}
                target="13000"
                component="New Water Connections"
              />
              <BoxItem
                amount={props.data?.RU_WaterVolume}
                target="47000"
                component="Volume of Water Produced"
              />
              <BoxItem
                amount={props.data?.RU_Beneficiaries_ImprovedService}
                target="68300"
                component="Beneficiaries of Improved Service"
              />
            </div>}
          </div>
          <div className="mid">
            {props.data && <div className="componentpies">
              <div ref={p1ref} className="chart">
                <div className="tp">
                  <h3>Improved Service</h3>
                  <BsDownload
                
                    color="BA0C2F"
                    onClick={() => {
                      handleDownloadImage(p1ref);
                    }}
                  />
                </div>
                {props.data && (
                  <CustomPieChart data={props.data?.ISDDistribution} aspect={1.6} />
                )}
              </div>
              <div ref={p1ref} className="chart">
                <div className="tp">
                  <h3>Access to Water</h3>
                  <BsDownload
                 
                    color="BA0C2F"
                    onClick={() => {
                      handleDownloadImage(p1ref);
                    }}
                  />
                </div>
                {props.data && <CustomPieChart data={props.data?.ATWDistribution} aspect={1.6} />}
              </div>
              <div ref={p1ref} className="chart">
                <div className="tp">
                  <h3>Billing vs Revenue</h3>
                  <BsDownload
                    
                    color="BA0C2F"
                    onClick={() => {
                      handleDownloadImage(p1ref);
                    }}
                  />
                </div>
                {props.data && <CustomPieChart data={props.data?.Billing} aspect={1.6} />}
              </div>
              <div ref={p1ref} className="chart">
                <div className="tp">
                  <h3>New Connections</h3>
                  <BsDownload
                
                    color="BA0C2F"
                    onClick={() => {
                      handleDownloadImage(p1ref);
                    }}
                  />
                </div>
                {props.data && <CustomPieChart data={props.data?.NewConnectionsBenefDistribution} aspect={1.6} />}
              </div>
            </div>}
          </div>
        </div>
      )}
    </>
  );
}

const TopItem = (props) => {
  function withCommas(x) {
    return x?.toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ",");;
  }
  return (
    <div
      style={{ backgroundColor: props.color ?? props.color }}
      className="tp_item"
    >
      <div className="text">
        <div className="wheel">
          <img src={kpiwheel} alt="" />
          <p className="percent">5%</p>
        </div>
        <p className="stat">{withCommas(props.amt)}</p>
        <div className="btm">
          <p className="name">{props.title}</p>
          <div className="desc">
            <p>{props.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
