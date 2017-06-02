# babel-plugin-stateful-functional-react-components

✨ _Stateful functional React components without runtime overhead (inspired by ClojureScript)_ ✨

_Compiles stateful functional React components syntax into ES2015 classes_

WARNING: _This plugin is experimental. If you are interested in taking this further, please open an issue or submit a PR with improvements._

[![npm](https://img.shields.io/npm/v/babel-plugin-stateful-functional-react-components.svg?style=flat-square)](https://www.npmjs.com/package/babel-plugin-stateful-functional-react-components)

## Why?
Because functional components are concise and it's annoying to write ES2015 classes when all you need is local state.

## Advantages
- No runtime overhead
- No dependencies that adds additional KB's to your bundle

## Example

__Input__
```js
//                props      context   state    init state
const Counter = ({ text }, { theme }, { val } = { val: 0 }, setState) => (
  <div className={theme}>
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
    const { theme } = this.context;
    const { val } = this.state;

    return (
      <div className={theme}>
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

## API

**(props [,context], state = initialState, setState)**

- `props` is component’s props i.e. `this.props`
- `context` is optional parameter which corresponds to React’s context
- `state` is component’s state, `initialState` is required
- `setState` maps to `this.setState`

## Important notes
- _state_ parameter _must_ be assigned default value (_initial state_)
- The last parameter _must_ be named `setState`
- Even though this syntax makes components look _functional_, don't forget that they are also _stateful_, which means that hot-reloading won't work for them.

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
