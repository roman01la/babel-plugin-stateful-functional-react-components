function rewriteFunctionalComponent(t, path, isCtx, isWithHelpers) {

  const bodyPath = path.get('declarations.0.init.body');
  const decl = path.node.declarations[0];

  const className = decl.id;
  const propsRefs = decl.init.params[0];
  const ctxRefs = isCtx ? decl.init.params[1] : null;
  const stateRefs = isCtx ? decl.init.params[2].left : decl.init.params[1].left;
  const stateVal = isCtx ? decl.init.params[2].right : decl.init.params[1].right;
  const helpersRefs = isWithHelpers ? isCtx ? decl.init.params[3] : decl.init.params[2] : null;
  const helpers = isWithHelpers ? helpersRefs.properties.map((prop) => prop.key.name) : [];
  const bindEntries = [];

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

  // replace `bindTo` with `this[bindTarget]`
  if (helpers.some((h) => h === 'bindTo')) {
    bodyPath.traverse({
      CallExpression(path) {

        if (path.node.callee.name === 'bindTo') {

          const bindTarget = path.node.arguments[0].value;
          const bindFn = path.node.arguments[1];

          bindEntries.push([bindTarget, bindFn]);

          path.replaceWith(
            t.MemberExpression(
              t.ThisExpression(),
              t.Identifier(bindTarget)));
        }
      }
    });
  }

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

    // Ensure React is avaible in the global scope
  if (!path.scope.hasGlobal("React") && !path.scope.hasBinding("React")) {
    throw new Error(
      `
React was not found.

You need to add this import on top of your file:
import React from 'react'
	`
    );
  }

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
                stateVal)),
            ...bindEntries.map(([methodName, fn]) => {
              return (
                t.ExpressionStatement(
                  t.AssignmentExpression(
                    '=',
                    t.MemberExpression(
                      t.ThisExpression(),
                      t.Identifier(methodName)),
                    fn)));
            })])),
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

function isStatefulFnWithHelpers(t, init) {
  return (
    t.isArrowFunctionExpression(init) &&
    init.params.length === 3 &&
    t.isAssignmentPattern(init.params[1]) &&
    t.isObjectExpression(init.params[1].right) &&
    t.isObjectPattern(init.params[2]) &&
    init.params[2].properties.some((prop) => prop.key.name === 'setState')
  );
}

export default function (babel) {
  const { types: t } = babel;

  return {
    visitor: {
      VariableDeclaration(path) {

        const init = path.node.declarations[0].init;
        const isCtx = isStatefulFnWithContext(t, init);
        const isWithHelpers = isStatefulFnWithHelpers(t, init);

        if (isStatefulFn(t, init) || isCtx || isWithHelpers) {
          rewriteFunctionalComponent(t, path, isCtx, isWithHelpers);
        }
      }
    }
  };
}
