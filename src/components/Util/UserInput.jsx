import React from "react";

export default class UserInput extends React.Component {
  constructor(props) {
    super(props);
    this.input = React.createRef();
    this.getValue = this.getValue.bind(this);
  }

  getValue() {
    return this.input.current.value;
  }

  render() {
    return (
      <div className="input">
        <h4>{this.props.label}</h4>
        <input
          ref={this.input}
          type={this.props.type}
          placeholder={this.props.placeholder}
          required
          autoComplete="off"
        />
      </div>
    );
  }
}
