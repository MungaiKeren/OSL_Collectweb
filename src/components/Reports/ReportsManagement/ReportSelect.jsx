import React, { forwardRef } from "react";

const Select = (props, ref) => {
  return (
    <div className="usrselect">
      <h4 htmlFor="select">{props.label}</h4>
      <select
        onChange={(e) => {
          props?.handleSelection(e.target.value);
        }}
        ref={ref}
        value={props.value}
      >
        {props.data &&
          props.data.map((item) => {
            return (
              <option key={item} value={item}>
                {item}
              </option>
            );
          })}
      </select>
    </div>
  );
};

export default forwardRef(Select);
