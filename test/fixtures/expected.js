class Counter extends React.Component {
  constructor() {
    super();
    this.state = { val: 0 };
  }

  render() {
    const { val } = this.state;
    const v = this.state.val;
    const vs = this.state['val'];
    const vxs = [this.state.val].map(n => n + 1);
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
        this.state.val
      ),
      React.createElement(
        'button',
        { onClick: () => this.setState({ val: ++val }) },
        '+'
      )
    );
  }

}
