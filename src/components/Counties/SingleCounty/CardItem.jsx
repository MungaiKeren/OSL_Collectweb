import React from "react";

const CardItem = (props) => {
  return (
    <div className="itm">
      <p className="title">{props.Indicator}</p>
      <p className="p">Target: {props.Target}</p>
      <h2>{props.percent}%</h2>
      <p className="stat">{props.Total}</p>
      <table>
        <tr>
          <th>M</th>
          <th>F</th>
        </tr>
        <tr>
          <td>{props.Male}</td>
          <td>{props.Female}</td>
        </tr>
      </table>
    </div>
  );
};

export default CardItem;