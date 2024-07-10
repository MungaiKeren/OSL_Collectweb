import React from "react";
import "../../../Styles/singlecounty.scss";
import GISCountySingle from "../../GIS/GISCountySingle";
import CountyStats from "../../Stats/CountyStats";

export default function SingleCounty() {
  const path = window.location.pathname.split("/");
  return (
    <div className="single-county">
      <CountyStats county={decodeURIComponent(path[2])} />
      <br />
      <br />

      <GISCountySingle county={decodeURIComponent(path[2])} />
    </div>
  );
}
