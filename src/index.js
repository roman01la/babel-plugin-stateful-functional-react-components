function rewriteFunctionalComponent(t, path) {

  const bodyPath = path.get('declarations.0.init.body');

  const className = path.node.declarations[0].id;
  const propsRefs = path.node.declarations[0].init.params[0];
  const stateRefs = path.node.declarations[0].init.params[1].left;
  const stateVal = path.node.declarations[0].init.params[1].right;

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

  const returnVal = t.isBlockStatement(bodyPath.node)
    ? bodyPath.node
    : t.BlockStatement([
            t.ReturnStatement(bodyPath.node)]);

  returnVal.body.unshift(
    t.VariableDeclaration(
      'const',
      [t.VariableDeclarator(
        propsRefs,
        t.MemberExpression(
          t.ThisExpression(),
          t.Identifier('props')))]),
    t.VariableDeclaration(
      'const',
      [t.VariableDeclarator(
        stateRefs,
        t.MemberExpression(
          t.ThisExpression(),
          t.Identifier('state')))]));

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

export default function (babel) {
  const { types: t } = babel;

  return {
    visitor: {
      VariableDeclaration(path) {

        const init = path.node.declarations[0].init;

        if (t.isArrowFunctionExpression(init) &&
            init.params.length === 3 &&
            t.isAssignmentPattern(init.params[1]) &&
            t.isObjectExpression(init.params[1].right) &&
            init.params[2].name === 'setState') {

          rewriteFunctionalComponent(t, path);
        }
      }
    }
  };
}
