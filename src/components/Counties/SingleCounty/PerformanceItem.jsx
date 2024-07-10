import React from "react";


const PerformanceItem = (props) => {
  return (
    <div className="items">
      <p className="duration">
        {props.months} <span>{props.year}</span>
      </p>
      <p>{props.description}</p>
      <div className="st">
        <p>
          <span className="blue">{props.male} </span>
          <span className="red">{props.malestat}</span>
        </p>
        <p>
          <span className="blue">{props.female} </span>
          <span className="red">{props.femalestat}</span>
        </p>
      </div>
      <p className="badge">{props.total}</p>
    </div>
  );
};

export default PerformanceItem;