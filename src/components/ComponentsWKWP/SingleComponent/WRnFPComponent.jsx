import html2canvas from "html2canvas";
import { useEffect, useRef, useState } from "react";
import { BsDownload } from "react-icons/bs";
import "../../../Styles/wrnfpComponent.scss";
import BoxItem from "../../Stats/BoxItem";
import CustomPieChart from "../../Stats/CustomPieChart";

export default function WRnFPComponent(props) {
  const [data, setData] = useState(null);
  const [monthlyStats, setMonthlyStats] = useState(null);
  const [projects, setProjects] = useState(null);
  const [showing, setShowing] = useState(true);
  const [aspect, setAspect] = useState(1.5);
  const [aspect1, setAspect1] = useState(1.5);
  const [internal, setInternal] = useState(null);
  const [external, setExternal] = useState(null);

  const p1ref = useRef();



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


  useEffect(() => {
    setShowing(false);
    setTimeout(() => {
      setShowing(true);
    }, 1);
  }, [props.showing]);

  useEffect(() => {

    fetch(`/api/documents/stats`)
      .then((res) => {
        if (res.ok) return res.json();
        else throw Error("");
      })
      .then((data) => {
        setData(data);
      })
      .catch(() => { });
  }, []);

  useEffect(() => {
    fetch(`/api/documents/stats/Internal`)
      .then((res) => {
        if (res.ok) return res.json();
        else throw Error("");
      })
      .then((data) => {
    
        setInternal(data);
      })
      .catch(() => { });
  }, []);

  useEffect(() => {
    fetch(`/api/documents/stats/External`)
      .then((res) => {
        if (res.ok) return res.json();
        else throw Error("");
      })
      .then((data) => {
      
        setExternal(data);
      })
      .catch(() => { });
  }, []);

  useEffect(() => {
    fetch(`/api/documents/monthly/published/2023-01-01/2024-01-01`)
      .then((res) => {
        if (res.ok) return res.json();
        else throw Error("");
      })
      .then((data) => {

        setMonthlyStats(data);
      })
      .catch(() => { });
  }, []);
  useEffect(() => {
    fetch(`/api/documents/charts`)
      .then((res) => {
        if (res.ok) return res.json();
        else throw Error("");
      })
      .then((data) => {
        setProjects(data);
      })
      .catch(() => { });
  }, []);



  return (
    <>
      {showing && (
        <div className="wrnfpComponent">
          <div className="top">
            <div className="title">
              <h3>{props.title.replaceAll("%20", " ")}</h3>
              <p>KPIs</p>
            </div>
            <div className="div31">
              <div className="midtop">
                <BoxItem
                  amount="400"
                  target="440"
                  component="Number of Trees Planted"
                />
                <BoxItem
                  amount="34000"
                  target="71000"
                  component="Number of Springs Protected"
                />
                <BoxItem
                  amount="9000"
                  target="13000"
                  component="Number of Kilometers of terrace"
                />
                <BoxItem
                  amount="45005"
                  target="47000"
                  component="Number of WRUAs with SCMP"
                />
                <BoxItem
                  amount="65057"
                  target="68300"
                  component="Number of Tree nurseries established"
                />
                <BoxItem
                  amount="400"
                  target="440"
                  component="Kilometers of River line protected"
                />
                <BoxItem
                  amount="34000"
                  target="71000"
                  component="Number of Kilometers of terrace"
                />
                <BoxItem
                  amount="9000"
                  target="13000"
                  component="Number of Hectares of Land Rehabilitated"
                />
                <BoxItem
                  amount="45005"
                  target="47000"
                  component="Data management and digital solution adopted"
                />
              </div>
              <div className="div3row">
                <div ref={p1ref} className="chart">
                  <div className="tp">
                    <div>
                      <h3>Beneficiaries of Alternative/ Enhanced IGAs</h3>
                      <p>Gender Distribution</p>
                    </div>

                    <BsDownload
                      className="download"
                      onClick={() => {
                        handleDownloadImage(p1ref);
                      }}
                    />
                  </div>
                  {projects && (
                    <CustomPieChart data={projects?.Category} aspect={1.6} />
                  )}
                </div>
                <div ref={p1ref} className="chart">
                  <div className="tp">
                    <div>
                      <h3>Beneficiaries of measures to improve WRM</h3>
                      <p>Gender Distribution</p>
                    </div>

                    <BsDownload
                      className="download"
                      onClick={() => {
                        handleDownloadImage(p1ref);
                      }}
                    />
                  </div>
                  {projects && (
                    <CustomPieChart data={projects?.Category} aspect={1.6} />
                  )}
                </div>
                <div ref={p1ref} className="chart">
                  <div className="tp">
                    <div>
                      <h3>WRUA Committees Trained on Effective WRM Practices</h3>
                      <p>Gender Distribution</p>
                    </div>

                    <BsDownload
                      className="download"
                      onClick={() => {
                        handleDownloadImage(p1ref);
                      }}
                    />
                  </div>
                  {projects && (
                    <CustomPieChart data={projects?.Category} aspect={1.6} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
