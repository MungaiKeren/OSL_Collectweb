import React from "react";

const ActivityDetail = (props) => {

  function formatDate(inputDate) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(inputDate);
    return date.toLocaleDateString("en-US", options);
  }
    return (
      <div>
        <p className="text-right">{formatDate(props?.item?.Date)}</p>
        <h5 className="bold-title">
          {props?.item?.ActivityType}: {props?.item?.ActivityName}
        </h5>
        <p>
          <span className="activity">{props?.item?.ActivitySector}:</span>
          {props?.item?.ActivityDescription}
        </p>
        <p>
          <span className="activity">Location: </span>
          {props?.item?.County} County, {props?.item?.SubCounty} Sub County,
          {props?.item?.Ward} Ward
        </p>
        <p>
          <span className="activity">Facilitator Name:</span>
          {props?.item?.FacilitatorName}
          <br />
          <span className="activity">Facilitator Organization: </span>
          {props?.item?.FacilitatorOrganisation} <br />
          <span className="activity">Facilitator Contact:</span>
          {props?.item?.FacilitatorContact}
        </p>
        <p>
          <span className="activity">
            Brief Description of {props?.item?.ActivityType} provided:
          </span>{" "}
          <br />
          {props?.item?.ActivityDescription}
        </p>

        <h5 className="bold-title">Entity Representative</h5>
        <p>
          <span className="activity">Name: </span> John Brown
        </p>
        <p>
          <span className="activity">Designation: </span> Project Head
        </p>

        <h5 className="bold-title">WKWP Representative</h5>
        <p>
          <span className="activity">Name: </span> Daniel Oganda
        </p>
        <p>
          <span className="activity">Designation: </span> Urban Specialist
        </p>
      </div>
    );
};

export default ActivityDetail;