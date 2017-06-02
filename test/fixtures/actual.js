import React from 'react';

const Counter = (props, state = { val: 0 }, setState) => {
  const { val } = state;
  const v = state.val;
  const vs = state['val'];
  const vxs = [state.val].map((n) => n + 1);
  const dec = () => setState({ val: --val });
  return (
    <div>
      <button onClick={dec}>-</button>
      <span>{state.val}</span>
      <button onClick={() => setState({ val: ++val })}>+</button>
    </div>
  );
};

const App = ({ text }, { theme }, { val } = { val: '' }, setState) => {
  return (
    <div className={theme}>
      <h1>{text}</h1>
      <input value={val} onChange={(e) => setState({ val: e.target.value })} />
      <Counter />
    </div>
  );
};
