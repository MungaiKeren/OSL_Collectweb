import React from "react";

export default class UserSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
    };
    this.input = React.createRef();
    this.getValue = this.getValue.bind(this);
  }

  getValue() {
    return this.input.current.value;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data.length !== this.props.data.length) {
      this.setState({ data: this.props.data });
    }
  }

  render() {
    return (
      <div className="usrselect">
        <h4>{this.props.label}</h4>
        <select
          onChange={(e) => {
            this.props.onChange(e.target.value);
          }}
          ref={this.input}
        >
          {this.state.data.map((item, index) => {
            return (
              <option key={index} value={item}>
                {item}{" "}
              </option>
            );
          })}
        </select>
      </div>
    );
  }
}
