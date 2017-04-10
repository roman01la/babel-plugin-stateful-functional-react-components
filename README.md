# babel-plugin-stateful-functional-react-components

✨ _Stateful functional React components without runtime overhead_ ✨

_Compiles stateful functional React components syntax into ES2015 classes_

WARNING: _This plugin is experimental. If you are interested in taking this further, please open an issue or submit a PR with improvements._

## Why?
Because functional components are concise and it's annoying to write ES2015 classes when all you need is local state.

## Example

__Input__
```js
const Counter = ({ text }, { val } = { val: 0 }, setState) => (
  <div>
    <h1>{text}</h1>
    <div>
      <button onClick={() => setState({ val: val - 1 })}>-</button>
      <span>{val}</span>
      <button onClick={() => setState({ val: val + 1 })}>+</button>
    </div>
  </div>
);
```

__Output__
```js
class Counter extends React.Component {
  constructor() {
    super();
    this.state = { val: 0 };
  }
  render() {

    const { text } = this.props;
    const { val } = this.state;

    return (
      <div>
        <h1>{text}</h1>
        <div>
          <button onClick={() => this.setState({ val: val - 1 })}>-</button>
          <span>{val}</span>
          <button onClick={() => this.setState({ val: val + 1 })}>+</button>
        </div>
      </div>
    );
  }
}
```

## Requirements
- The second parameter (_state_) _must_ be assigned default value (_initial state_)
- The third parameter _must_ be named `setState`

## Installation
```
npm i babel-plugin-stateful-functional-react-components
```

## Usage

### Via .babelrc (Recommended)

__.babelrc__
```json
{
  "plugins": ["stateful-functional-react-components"]
}
```

### Via CLI
```
babel --plugins stateful-functional-react-components script.js
```

### Via Node API
```js
require("babel-core").transform("code", {
  plugins: ["stateful-functional-react-components"]
});
```

## License
MIT
