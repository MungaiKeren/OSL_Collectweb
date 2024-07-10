import React from "react";
import Select from "react-select";

class MultiSelect extends React.Component {
  constructor(props) {
    super(props);
    this.input = React.createRef();
    this.state = {
      value: this.parseValueFromString(props.value), // Parse the initial value
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      this.setState({
        value: this.parseValueFromString(this.props.value), // Update value from props
      });
    }
  }

  parseValueFromString = (valueString) => {
    if (!valueString) return []; // Return an empty array if no string is provided
    const values = valueString.split(",").map((value) => value.trim());
    return this.props.options.filter((option) => values.includes(option.value));
  };

  render() {
    const customStyles = {
      control: (provided, state) => ({
        ...provided,
        border: "1px solid #60606030",
        borderBottom: state.isFocused
          ? "1px solid #002F6C"
          : "1px solid #60606030",
        fontSize: "small",
        boxShadow: state.isFocused ? 0 : 0,
        "&:hover": {
          border: "1px solid #60606030",
        },
      }),
    };
    return (
      <div className="select">
        <label htmlFor="input">{this.props.label}</label>
        <Select
          onChange={(selectedOptions) => {
            const selectedValues = selectedOptions.map(
              (option) => option.value
            );
            this.setState({ value: selectedOptions });
            if (this.props.setChanged) {
              this.props.setChanged(selectedValues);
            }
          }}
          isMulti
          options={this.props.options}
          ref={this.input}
          name="select"
          isDisabled={this.props.readOnly}
          value={this.state.value}
          className="basic-multi-select"
          classNamePrefix={"Select"}
          styles={customStyles}
        />
      </div>
    );
  }
}

export default MultiSelect;
