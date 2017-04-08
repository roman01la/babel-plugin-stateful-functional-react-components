const Counter = (props, state = { val: 0 }, setState) => (
  <div>
    <button onClick={() => setState({ val: --state.val })}>-</button>
    <span>{state.val}</span>
    <button onClick={() => setState({ val: ++state.val })}>+</button>
  </div>
);
