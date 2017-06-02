function rewriteFunctionalComponent(t, path, isCtx) {

  const bodyPath = path.get('declarations.0.init.body');
  const decl = path.node.declarations[0];

  const className = decl.id;
  const propsRefs = decl.init.params[0];
  const ctxRefs = isCtx ? decl.init.params[1] : null;
  const stateRefs = isCtx ? decl.init.params[2].left : decl.init.params[1].left;
  const stateVal = isCtx ? decl.init.params[2].right : decl.init.params[1].right;

 // replace `setState` with `this.setState`
  bodyPath.traverse({
    CallExpression(path) {
      if (path.node.callee.name === 'setState') {
        path.replaceWith(
          t.CallExpression(
            t.MemberExpression(
              t.ThisExpression(),
              path.node.callee),
            path.node.arguments));
      }
    }
  });

  // get return value as a block statement
  const returnVal = t.isBlockStatement(bodyPath.node)
    ? bodyPath.node
    : t.BlockStatement([
            t.ReturnStatement(bodyPath.node)]);

  // rewrite `state` declaration
  returnVal.body.unshift(
    t.VariableDeclaration(
      'const',
      [t.VariableDeclarator(
        stateRefs,
        t.MemberExpression(
          t.ThisExpression(),
          t.Identifier('state')))]));

  // rewrite `context` declaration
  if (isCtx) {
    returnVal.body.unshift(
      t.VariableDeclaration(
        'const',
        [t.VariableDeclarator(
          ctxRefs,
          t.MemberExpression(
            t.ThisExpression(),
            t.Identifier('context')))]));
  }

  // rewrite `props` declaration
  returnVal.body.unshift(
    t.VariableDeclaration(
      'const',
      [t.VariableDeclarator(
        propsRefs,
        t.MemberExpression(
          t.ThisExpression(),
          t.Identifier('props')))]));

  // rewrite functional component into ES2015 class
  path.replaceWith(
    t.ClassDeclaration(
      className,
      t.MemberExpression(
        t.Identifier('React'),
        t.Identifier('Component')),
      t.ClassBody([
        t.ClassMethod(
          'constructor',
          t.Identifier('constructor'),
          [],
          t.BlockStatement([
            t.ExpressionStatement(
              t.CallExpression(
                t.Super(),
                [])),
            t.ExpressionStatement(
              t.AssignmentExpression(
                '=',
                t.MemberExpression(
                  t.ThisExpression(),
                  t.Identifier('state')),
                stateVal))])),
        t.ClassMethod(
          'method',
          t.Identifier('render'),
          [],
          returnVal)]),
      []));
}

function isStatefulFn(t, init) {
  return (
    t.isArrowFunctionExpression(init) &&
    init.params.length === 3 &&
    t.isAssignmentPattern(init.params[1]) &&
    t.isObjectExpression(init.params[1].right) &&
    init.params[2].name === 'setState'
  );
}

function isStatefulFnWithContext(t, init) {
  return (
    t.isArrowFunctionExpression(init) &&
    init.params.length === 4 &&
    t.isAssignmentPattern(init.params[2]) &&
    t.isObjectExpression(init.params[2].right) &&
    init.params[3].name === 'setState'
  );
}

export default function (babel) {
  const { types: t } = babel;

  return {
    visitor: {
      VariableDeclaration(path) {

        const init = path.node.declarations[0].init;
        const isCtx = isStatefulFnWithContext(t, init);

        if (isStatefulFn(t, init) || isCtx) {
          rewriteFunctionalComponent(t, path, isCtx);
        }
      }
    }
  };
}
