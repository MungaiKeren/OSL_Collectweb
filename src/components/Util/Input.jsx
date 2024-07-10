import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
} from "react";

const Input = forwardRef((props, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [valid, setValid] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const inputIdRef = useRef(`input_${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    if (props.value) {
      setInputValue(props.value);
    }
  }, [props.value]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(inputValue !== "");
  };

  const handleChange = (e) => {
    if (props.handleChange) {
      props.handleChange(e.target.value);
    }
    setInputValue(e.target.value);
  };

  useEffect(() => {
    if (props.type == "number") {
      if (!isNaN(inputValue)) {
        setValid(false);
      } else setValid(true);
    }
  }, [inputValue, props.type]);

  useImperativeHandle(ref, () => ({
    focusInput: () => {
      ref.current.focus();
    },
    value: inputValue,
  }));

  return (
    <div className={`input-container ${isFocused ? "focused" : ""}`}>
      <label
        className={`label ${isFocused || inputValue !== "" ? "up" : ""}`}
        htmlFor={inputIdRef.current}
      >
        {props.label}
      </label>
      {props.type === "textarea" ? (
        <textarea
          ref={ref}
          id={inputIdRef.current}
          rows={5}
          readOnly={props.readOnly}
          value={inputValue}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
        />
      ) : (
        <input
          type={props.type}
          id={inputIdRef.current}
          ref={ref}
          readOnly={props.readOnly}
          value={inputValue}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          max={
            props.type == "date" && props.max == null
              ? new Date().toISOString().split("T")[0]
              : ""
          }
        />
      )}
    </div>
  );
});

export default Input;
