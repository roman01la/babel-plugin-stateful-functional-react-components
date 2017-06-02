import React from 'react';

const Input = ({ value, onChange }) => React.createElement('input', { value: value, onChange: onChange });

class Counter extends React.Component {
  constructor() {
    super();
    this.state = { val: 0 };

    this._dec = () => this.setState({ val: val - 1 });

    this._inc = () => this.setState({ val: val + 1 });
  }

  render() {
    const props = this.props;
    const { val } = this.state;
    return React.createElement(
      'div',
      null,
      React.createElement(
        'button',
        { onClick: this._dec },
        '-'
      ),
      React.createElement(
        'span',
        null,
        val
      ),
      React.createElement(
        'button',
        { onClick: this._inc },
        '+'
      )
    );
  }

}

class App extends React.Component {
  constructor() {
    super();
    this.state = { val: '' };

    this._handleInput = e => this.setState({ val: e.target.value });
  }

  render() {
    const { text } = this.props;
    const { val } = this.state;

    return React.createElement(
      'div',
      null,
      React.createElement(
        'h1',
        null,
        text
      ),
      React.createElement(Input, { value: val, onChange: this._handleInput }),
      React.createElement(Counter, null)
    );
  }

}
