import React, { forwardRef, useEffect, useState } from "react";

const ReportInput = (props, ref) => {
  const [value, setValue] = useState(props.value);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  return (
    <div className="usrinput">
      <h4>{props.label}</h4>
      <input
        autoComplete="none"
        ref={ref}
        type={props.type}
        placeholder={props.hint}
        maxLength="50"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          if (props.handleChange) {
            props.handleChange(e.target.value);
          }
        }}
      />
      {props.icon && <i className={"fa " + props.icon}></i>}
    </div>
  );
};

export default forwardRef(ReportInput);
