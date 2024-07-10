import { useState } from "react";
import "../../Styles/reports.scss";
import Charts from "./Charts";
import QueryBuilder from "./QueryBuilder";
import Tables from "./Tables";

export default function ReportsHome(props) {
  const [active, setActive] = useState("Tables");
  const Item = (params) => {
    return (
      <p
        onClick={() => {
          setActive(params.txt);
        }}
        className={params.txt === active ? "active" : ""}
      >
        {params.txt}
      </p>
    );
  };
  return (
    <div className="reports">
      <div className="bars">
        <Item txt="Query Builder" />
        <Item txt="Tables" />
        <Item txt="Charts" />
      </div>
      {active === "Query Builder" && <QueryBuilder />}
      {active === "Tables" && <Tables />}
      {active === "Charts" && <Charts />}
    </div>
  );
}
