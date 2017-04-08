class Counter extends React.Component {
  constructor() {
    super();
    this.state = { val: 0 };
  }

  render() {
    return React.createElement(
      "div",
      null,
      React.createElement(
        "button",
        { onClick: () => this.setState({ val: --this.state.val }) },
        "-"
      ),
      React.createElement(
        "span",
        null,
        this.state.val
      ),
      React.createElement(
        "button",
        { onClick: () => this.setState({ val: ++this.state.val }) },
        "+"
      )
    );
  }

}
