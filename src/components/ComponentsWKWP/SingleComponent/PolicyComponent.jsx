import { useEffect, useState } from "react";
import "../../../Styles/policyComponent.scss";
import BoxItem from "../../Stats/BoxItem";

export default function PolicyComponent(props) {
  const [data, setData] = useState(null);
  const [monthlyStats, setMonthlyStats] = useState(null);
  const [projects, setProjects] = useState(null);
  const [showing, setShowing] = useState(true);
  const [aspect, setAspect] = useState(1.5);
  const [aspect1, setAspect1] = useState(1.5);
  const [internal, setInternal] = useState(null);
  const [external, setExternal] = useState(null);

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
        <div className="policyComponent">
          <div className="top">
            <div className="title">
              <h3>{props.title.replaceAll("%20", " ")}</h3>
              <p>KPIs</p>
            </div>
            <div className="midtop">
              <BoxItem
                amount="4"
                target="4"
                component="Water Policies, Laws and Guidelines Developed/ Reviewed"
              />
              <BoxItem
                amount="31"
                target="20"
                component="County Government Officials Trained in Corporate Governance"
              />
              <BoxItem
                amount="2"
                target="4"
                component="Number of Institutions with Capacity to Address Climate Change Risks"
              />
              <BoxItem
                amount="0"
                target="1"
                component="Percentage Increase in County Budget Allocations to WASH"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}


