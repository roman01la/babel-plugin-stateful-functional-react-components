import React from 'react';

const Input = ({ value, onChange }) => (
  <input value={value} onChange={onChange} />
)

const Counter = (props, { val } = { val: 0 }, { setState, bindTo }) => (
  <div>
    <button onClick={bindTo('_dec', () => setState({ val: val - 1 }))}>-</button>
    <span>{val}</span>
    <button onClick={bindTo('_inc', () => setState({ val: val + 1 }))}>+</button>
  </div>
);

const App = ({ text }, { val } = { val: '' }, { setState, bindTo }) => {
  return (
    <div>
      <h1>{text}</h1>
      <Input value={val} onChange={bindTo('_handleInput', (e) => setState({ val: e.target.value }))} />
      <Counter />
    </div>
  );
};
