class Counter extends React.Component {
  constructor() {
    super();
    this.state = { val: 0 };
  }

  render() {
    const props = this.props;
    const { val } = this.state;
    return React.createElement(
      'div',
      null,
      React.createElement(
        'button',
        { onClick: () => this.setState({ val: val - 1 }) },
        '-'
      ),
      React.createElement(
        'span',
        null,
        val
      ),
      React.createElement(
        'button',
        { onClick: () => this.setState({ val: val + 1 }) },
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
