import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import "../../Styles/counties.scss";
import SummarySection from "./SummarySection";
import Reporting from "./Reporting";

const BoxItem = (props) => {
  return (
    <div
      className="itm"
      onClick={() => {
        window.location.href = "/counties/" + props.county;
      }}
    >
      <span>County Dashboard</span>
      <h2>{props.county}</h2>
      <div className="ft">
        <p className="p">{props.more}</p>
        <div className="more">
          <FontAwesomeIcon icon={faArrowRight} />
        </div>
      </div>
    </div>
  );
};

export default function AllCounties() {
  const [active, setActive] = useState("Counties Summary");
  return (
    <div className="all-counties">
      <div className="top-part">
        <h4 className="title">WKWP Counties</h4>
        <p className="small-title">County Dashboard Links</p>
        <div className="box-items">
          <BoxItem date="2nd Oct 2023" county="Busia" more="View More" />
          <BoxItem date="2nd Oct 2023" county="Bungoma" more="View More" />
          <BoxItem date="2nd Oct 2023" county="Homabay" more="View More" />
          <BoxItem date="2nd Oct 2023" county="Kakamega" more="View More" />
          <BoxItem date="2nd Oct 2023" county="Kisii" more="View More" />
          <BoxItem date="2nd Oct 2023" county="Kisumu" more="View More" />
          <BoxItem date="2nd Oct 2023" county="Migori" more="View More" />
          <BoxItem date="2nd Oct 2023" county="Siaya" more="View More" />
        </div>
      </div>

      <div className="bar">
        <h4
          onClick={() => {
            setActive("Counties Summary");
          }}
          className={active == "Counties Summary" ? "active" : ""}
        >
          Counties Summary
        </h4>
        <h4
          onClick={() => {
            setActive("Reporting");
          }}
          className={active == "Reporting" ? "active" : ""}
        >
          Reporting
        </h4>
      </div>

      {active == "Counties Summary" && (
        <SummarySection
          title="Summary Reporting"
          subtitle="Results, Activities, and TAs"
        />
      )}
      {active == "Reporting" && (
        <Reporting
          title="Summary Reporting"
          subtitle="Results, Activities, and TAs"
        />
      )}
    </div>
  );
}
