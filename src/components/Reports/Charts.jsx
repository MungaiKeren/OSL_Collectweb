import html2canvas from "html2canvas";
import { useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import { BsDownload } from "react-icons/bs";
import CustomBarChart from "../Stats/CustomBarChart";
import Select from "../Util/Select";

export default function Charts(props) {
  const p1ref = useRef();

  const [charts, setCharts] = useState(null);
  const [year, setYear] = useState("2023");

  useEffect(() => {
    if (year !== "") {
      getData();
    }
  }, [year]);

  function getData() {
    fetch(`/api/budgetallocations/sumfy/${year}`)
      .then((res) => {
        if (res.ok) return res.json();
        else throw Error("");
      })
      .then((dt) => {
        setCharts(dt);
      })
      .catch((e) => { });
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

  return (
    <div className="charts">
      <div className="div1auto">
        <h1>Report Charts</h1>
        <div>
          <Select
            setChanged={(v) => {
              setYear(v);
            }}
            value={year}
            data={["2022", "2023", "2024", "2025", "2026", "2027"]}
          />
        </div>
      </div>
      <div ref={p1ref} className="chart">
        <div className="tp">
          <div>
            <h3>Budget Allocation</h3>
            <p>Percentage increase in budget allocation</p>
          </div>

          <BsDownload
            className="download"
            onClick={() => {
              handleDownloadImage(p1ref);
            }}
          />
        </div>
        <CustomBarChart
          data={charts?.twoAnnualAllocations}
          aspect={isMobile ? 1 : 3.5}
          color="#BA0C2F"
        />
      </div>
      <div ref={p1ref} className="chart">
        <div className="tp">
          <div>
            <h3>Spatial Distribution of WKWP Interventions</h3>
            <p>Number of people gaining access to basic drinking water services as a result of USG intervension</p>
          </div>

          <BsDownload
            className="download"
            onClick={() => {
              handleDownloadImage(p1ref);
            }}
          />
        </div>
        <CustomBarChart
          data={charts?.RUBeneficiaries}
          aspect={isMobile ? 1 : 3.5}
          color="#BA0C2F"
        />
      </div>
    </div>
  );
}
