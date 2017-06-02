import React from 'react';

class Counter extends React.Component {
  constructor() {
    super();
    this.state = { val: 0 };
  }

  render() {
    const props = this.props;
    const state = this.state;

    const { val } = state;
    const v = state.val;
    const vs = state['val'];
    const vxs = [state.val].map(n => n + 1);
    const dec = () => this.setState({ val: --val });
    return React.createElement(
      'div',
      null,
      React.createElement(
        'button',
        { onClick: dec },
        '-'
      ),
      React.createElement(
        'span',
        null,
        state.val
      ),
      React.createElement(
        'button',
        { onClick: () => this.setState({ val: ++val }) },
        '+'
      )
    );
  }

}

class App extends React.Component {
  constructor() {
    super();
    this.state = { val: '' };
  }

  render() {
    const { text } = this.props;
    const { theme } = this.context;
    const { val } = this.state;

    return React.createElement(
      'div',
      { className: theme },
      React.createElement(
        'h1',
        null,
        text
      ),
      React.createElement('input', { value: val, onChange: e => this.setState({ val: e.target.value }) }),
      React.createElement(Counter, null)
    );
  }

}
