const Counter = (props, { val } = { val: 0 }, setState) => (
  <div>
    <button onClick={() => setState({ val: val - 1 })}>-</button>
    <span>{val}</span>
    <button onClick={() => setState({ val: val + 1 })}>+</button>
  </div>
);

const App = ({ text }, { val } = { val: '' }, setState) => {
  return (
    <div>
      <h1>{text}</h1>
      <input value={val} onChange={(e) => setState({ val: e.target.value })} />
      <Counter />
    </div>
  );
};
