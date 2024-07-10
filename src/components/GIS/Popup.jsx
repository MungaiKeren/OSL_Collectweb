import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { forwardRef, useEffect, useState } from "react";
import Pagination from "../Util/Pagination";

const Popup = forwardRef((props, ref) => {
  const [cols, setCols] = useState(null);
  const [single, setSingle] = useState(null);
  const [type, setType] = useState("");
  const [koffset, setKOffset] = useState(0);
  const [offset, setOffset] = useState(0);
  const [data, setData] = useState(null);
  const [kpis, setKPIs] = useState(null);

  useEffect(() => {
    if (props.data) {
    
      if (props.data.length === 1) {
        setSingle(props.data[0].data);
        if (props.data[0].Name === "Beneficiaries") {
          setType("Beneficiaries");
        }
      } else setSingle(null);
    }
  }, [props.data]);

  useEffect(() => {
    if (single) {
      let d = single;
      delete d.geometry;
      const keysToExclude = [
        "ID",
        "geometry",
        "point",
        "createdAt",
        "updatedAt",
      ];
      const c = Object.keys(d).filter((key) => !keysToExclude.includes(key));
      setCols(c);
    }
  }, [single]);

  useEffect(() => {
    if (type === "Beneficiaries" && single) {
      fetch(`/api/providerperfomance/stakeholder/${single?.ID}/${offset}`, {
        method: "get",
        credentials: "include",
      })
        .then((res) => {
          if (res.ok) return res.json();
        })
        .then((data) => {
        
          setData(data);
        })
        .catch((error) => { });
      fetch(`/api/indicatorsperformance/stakeholder/${single?.ID}/${koffset}`, {
        method: "get",
        credentials: "include",
      })
        .then((res) => {
          if (res.ok) return res.json();
        })
        .then((data) => {
        
          setKPIs(data);
        })
        .catch((error) => { });
    }
  }, [type, single]);

  const Item = (params) => {
    return (
      <div className="itt">
        <p className="date">Date: {params?.item?.Date}</p>
        <div className="div3equal">
          <p>Regulated: {params?.item?.Regulation}</p>
          <p>SDM: {params?.item?.SDM}</p>
          <p>DS Rehabilitated: {params?.item?.DrinkingSystems_Rehabilitated}</p>
        </div>
        <div className="div4equal">
          <p>Staff M: {params?.item?.No_StaffMale}</p>
          <p>Staff F: {params?.item?.No_StaffFemale}</p>
          <p>BOD M: {params?.item?.BoardMembers_Male}</p>
          <p>BOD F: {params?.item?.BoardMembers_Female}</p>
        </div>
        <div className="div4equal">
          <p>BOD Trained M: {params?.item?.Training_BoardMembers_Male}</p>
          <p>BOD Trained F: {params?.item?.Training_BoardMembers_Female}</p>
          <p>Resources Leveraged: {params?.item?.ResourcesLeveraged}</p>
        </div>
      </div>
    );
  };

  const KPI = (params) => {
    return (
      <div className="itt">
        <p className="date">Date: {params?.item?.Date}</p>
        <div className="div2equal">
          <p>
            NRW: {params?.item?.NRW_Percentage} -{" "}
            {params?.item?.NRW_Percentage_Baseline}%
          </p>
          <p>
            Supply Hours: {params?.item?.SupplyHours}  -{" "}
            {params?.item?.SupplyHours_Baseline} Hrs
          </p>
        </div>
        <div className="div2equal">
          <p>
            Cost Coverage: {params?.item?.CostCoverage} -{" "}
            {params?.item?.CostCoverage_Baseline}%
          </p>
          <p>
            Revenue Collection Efficiency:{" "}
            {params?.item?.RevenueCollection_Efficiency} -{" "}
            {params?.item?.RevenueCollection_Efficiency_Baseline}%
          </p>
        </div>
        <div className="div2equal">
          <p>
            Water Coverage: {params?.item?.WaterCoverage_Percentage} -{" "}
            {params?.item?.WaterCoverage_Percentage_Baseline}%
          </p>
          <p>
            DQW Percentage: {params?.item?.DWQ_Percentage} -{" "}
            {params?.item?.DWQ_Percentage_Baseline}%
          </p>
        </div>
        <div className="div2equal">
          <p>
            Staff Productivity: {params?.item?.StaffProductivity} -{" "}
            {params?.item?.StaffProductivity_Baseline}
          </p>
          <p>
            Personnel Expenditure: {params?.item?.PersonnelExpenditure} -{" "}
            {params?.item?.PersonnelExpenditure_Baseline}
          </p>
        </div>
        <p>
          Metering Ratio: {params?.item?.MeteringRatio} -{" "}
          {params?.item?.MeteringRatio_Baseline}
        </p>
      </div>
    );
  };

  return (
    <div ref={ref} className="cpopup">
      <div className="ccontainer">
        <div className="ctop">
          <h3>Feature Details</h3>
          <FontAwesomeIcon
            className="fa fa-times"
            onClick={() => {
              props.setPopup(null);
            }}
            icon={faTimes}
          />
        </div>

        <hr />
        {single ? (
          <>
            {type === "Beneficiaries" ? (
              <div className="div3equal">
                <div>
                  {cols &&
                    cols.map((e, i) => {
                      return (
                        <div key={i} className="pitem">
                          <h4>{e}: </h4>
                          <p>{single[e]}</p>
                        </div>
                      );
                    })}
                </div>
                <div>
                  <h4>Beneficiary Details</h4>
                  <hr />
                  <div className="mlist">
                    {data &&
                      data?.data?.length > 0 &&
                      data?.data?.map((item, i) => {
                        return <Item key={i} item={item} />;
                      })}
                    {data && (
                      <Pagination
                        totalItems={data?.total}
                        currentPage={offset}
                        onPageChange={(v) => {
                          setOffset(v);
                        }}
                      />
                    )}
                  </div>
                </div>
                <div>
                  <h4>WASREB KPIs</h4>
                  <hr />
                  <div className="mlist">
                    {kpis &&
                      kpis?.data?.length > 0 &&
                      kpis?.data?.map((item, i) => {
                        return <KPI key={i} item={item} />;
                      })}
                    {kpis && (
                      <Pagination
                        totalItems={kpis?.total}
                        currentPage={koffset}
                        onPageChange={(v) => {
                          setKOffset(v);
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="div3equal">
                {cols &&
                  cols.map((e, i) => {
                    return (
                      <div key={i} className="pitem">
                        <h4>{e}: </h4>
                        <p>{single[e]}</p>
                      </div>
                    );
                  })}
              </div>
            )}
          </>
        ) : (
          <div className="selection">
            <h4>Select a Feature</h4>
            {props.data.map((item, i) => {
              return (
                <h5
                  onClick={() => {
                    setSingle(item.data);
                    setType(item.Name);
                  }}
                >
                  {item.Name}
                </h5>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
});

export default Popup;
