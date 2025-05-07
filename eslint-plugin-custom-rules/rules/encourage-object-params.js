/* eslint-disable no-restricted-syntax */
// @ts-nocheck

module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Encourage using object params when there are multiple arguments",
      category: "Best Practices",
      recommended: false,
    },
    fixable: null,
    hasSuggestions: true,
    schema: [
      {
        type: "object",
        properties: {
          minParams: {
            type: "number",
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create: function (context) {
    const minParams = context.options[0]?.minParams || 2

    // List of built-in objects to check against
    const builtInObjects = [
      "Object",
      "Array",
      "String",
      "Number",
      "Boolean",
      "Date",
      "Math",
      "RegExp",
      "JSON",
      "Promise",
      "Map",
      "Set",
      "WeakMap",
      "WeakSet",
      "Symbol",
      "Error",
      "EvalError",
      "RangeError",
      "ReferenceError",
      "SyntaxError",
      "TypeError",
      "URIError",
    ]

    // List of built-in array methods that accept callbacks
    const builtInCallbackMethods = [
      "map",
      "filter",
      "reduce",
      "reduceRight",
      "forEach",
      "every",
      "some",
      "find",
      "findIndex",
      "flatMap",
    ]

    return {
      FunctionDeclaration: checkFunctionParams,
      FunctionExpression: checkFunctionParams,
      ArrowFunctionExpression: checkFunctionParams,
    }

    function isBuiltInMethod(node) {
      // Check if function is a callback to built-in array methods
      if (node.parent && node.parent.type === "CallExpression") {
        const callee = node.parent.callee
        if (callee.type === "MemberExpression"
          && builtInCallbackMethods.includes(callee.property.name)) {
          return true
        }
      }

      if (node.parent && node.parent.type === "MethodDefinition") {
        // Check if the method is part of a class that extends a built-in
        const classNode = node.parent.parent
        if (classNode.superClass
          && classNode.superClass.type === "Identifier"
          && builtInObjects.includes(classNode.superClass.name)) {
          return true
        }
      }

      if (node.parent && node.parent.type === "Property") {
        // Check if the function is a method of a built-in prototype
        const objectExpr = node.parent.parent
        if (objectExpr.parent
          && objectExpr.parent.type === "AssignmentExpression"
          && objectExpr.parent.left.type === "MemberExpression") {
          const left = objectExpr.parent.left
          if (left.object
            && left.object.type === "MemberExpression"
            && left.object.property.name === "prototype"
            && builtInObjects.includes(left.object.object.name)) {
            return true
          }
        }
      }

      return false
    }

    function checkFunctionParams(node) {
      // Skip checking if this is a built-in method or callback
      if (isBuiltInMethod(node)) {
        return
      }

      if (node.params.length >= minParams) {
        // Check if all params are simple identifiers (not destructured)
        const allSimpleParams = node.params.every(param => param.type === "Identifier")

        if (allSimpleParams) {
          context.report({
            node: node,
            message: `Function has ${node.params.length} parameters. Consider using an object parameter for better clarity when there are ${minParams} or more parameters.`,
            suggest: [
              {
                desc: "Use an object parameter",
                fix: function (fixer) {
                  const paramNames = node.params.map(param => param.name)
                  const objectParam = `{ ${paramNames.join(", ")} }`

                  return fixer.replaceText(
                    node.params[0],
                    objectParam
                  )
                },
              },
            ],
          })
        }
      }
    }
  },
}
