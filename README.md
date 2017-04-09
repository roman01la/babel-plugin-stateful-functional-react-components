# babel-plugin-stateful-functional-react-components

✨ _Stateful functional React components without runtime overhead_ ✨

_Compiles stateful functional React components syntax into ES2015 classes_

WARNING: _This plugin is experimental. If you are interested in taking this further, please open an issue or submit a PR with improvements._

## Why?
Because functional components are concise and it's annoying to write ES2015 classes when all you need is local state.

## Example

__Input__
```js
const Counter = (props, state = { val: 0 }, setState) => (
  <div>
    <button onClick={() => setState({ val: --state.val })}>-</button>
    <span>{state.val}</span>
    <button onClick={() => setState({ val: ++state.val })}>+</button>
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
    return (
      <div>
        <button onClick={() => this.setState({ val: --this.state.val })}>-</button>
        <span>{this.state.val}</span>
        <button onClick={() => this.setState({ val: ++this.state.val })}>+</button>
      </div>
    );
  }
}
```

## Requirements
- The second parameter _must_ be named `state`
- The second parameter _must_ be assigned default value
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
