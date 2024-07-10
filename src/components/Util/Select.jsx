import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
} from "react";

const Select = forwardRef((props, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [data, setData] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const inputIdRef = useRef(`input_${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    if (props.value != null && props.value != "") {
      setIsFocused(true);
      setInputValue(props.value);
    }
  }, [props.value]);

  useEffect(() => {
    if (props.data) {
      let d = props.data;
      d.unshift("");
      setData(d);
    }
  }, [props.data]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(inputValue !== "");
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  useImperativeHandle(ref, () => ({
    focusInput: () => {
      ref.current.focus();
    },
    value: inputValue,
  }));

  return (
    <div className="select-container">
      <label
        className={`label ${isFocused || inputValue !== "" ? "up" : ""}`}
        htmlFor={inputIdRef.current}
      >
        {props.label}
      </label>
      <select
        onChange={(e) => {
          handleChange(e);
          if (props.setChanged) {
            props.setChanged(e.target.value);
          }
        }}
        id={inputIdRef.current}
        ref={ref}
        value={inputValue}
        disabled={props.readOnly}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        {data &&
          data.map((item, index) => {
            return (
              <option key={index} value={item}>
                {item}
              </option>
            );
          })}
      </select>
    </div>
  );
});

export default Select;
