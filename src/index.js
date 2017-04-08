function rewriteSetState(t, path) {
  path.traverse({
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
}

function rewriteStateRefs(t, path) {

  path.traverse({
    MemberExpression(path) {
      if (t.isIdentifier(path.node.object) &&
          path.node.object.name === 'state') {

        path.replaceWith(
          t.MemberExpression(
            t.MemberExpression(
              t.ThisExpression(),
              t.Identifier('state')),
            path.node.property,
            path.node.computed));
      }
    },
    VariableDeclarator(path) {
      if (t.isIdentifier(path.node.init) &&
          path.node.init.name === 'state')

        path.get('init')
          .replaceWith(
            t.MemberExpression(
              t.ThisExpression(),
              t.Identifier('state')));
      }
  });
}

function rewriteFunctionalComponent(t, path) {

  const bodyPath = path.get('declarations.0.init.body');

  const name = path.node.declarations[0].id;
  const state = path.node.declarations[0].init.params[1].right;

  let returnVal = path.node.declarations[0].init.body;

  returnVal = t.isBlockStatement(returnVal)
    ? returnVal
    : t.BlockStatement([
            t.ReturnStatement(returnVal)]);

  rewriteSetState(t, bodyPath);
  rewriteStateRefs(t, bodyPath);

  path.replaceWith(
    t.ClassDeclaration(
      name,
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
                state))])),
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

        if (t.isArrowFunctionExpression(init)) {

          const hasState = t.isAssignmentPattern(init.params[1]) &&
                           init.params[1].left.name === 'state' &&
                           t.isObjectExpression(init.params[1].right);

          const hasSetState = t.isIdentifier(init.params[2]) &&
                              init.params[2].name === 'setState';

          if (hasState && hasSetState) {
            rewriteFunctionalComponent(t, path);
          }
        }
      }
    }
  };
}
