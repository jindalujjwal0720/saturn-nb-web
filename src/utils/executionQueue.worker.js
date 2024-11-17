/* eslint-disable no-restricted-globals */

const worker = () => {
  const executeCode = (code, id) => {
    // Capture console.log output
    console.__customLog__ = (...args) => {
      self.postMessage({
        event: "code:log",
        message: args.join(" "),
        context: { id },
      });
    };

    // Capture console.error output
    console.__customError__ = (...args) => {
      self.postMessage({
        event: "code:error",
        message: args.join(" "),
        context: { id },
      });
    };

    // Replace console.log in the code with the custom log
    code = code.replace(/console.log/g, "console.__customLog__");
    code = code.replace(/console.error/g, "console.__customError__");

    // Replace function declarations with arrow functions without the const keyword
    // e.g. function foo() { return 1; } => foo = () => { return 1; };
    function replaceFunctionDeclarations(code) {
      // Regular expression to match function declarations
      const functionRegex =
        /function\s+([a-zA-Z0-9_$]+)\s*\(([^)]*)\)\s*\{([^}]*)\}/g;

      // Replace each function declaration with an arrow function assignment
      const transformedCode = code.replace(
        functionRegex,
        (match, functionName, params, body) => {
          // Create the arrow function format
          const arrowFunction = `${functionName} = (${params}) => {${body}};`;
          return arrowFunction;
        }
      );

      return transformedCode;
    }
    code = replaceFunctionDeclarations(code);

    // Execute the code
    const startTime = performance.now();
    try {
      // eslint-disable-next-line no-eval
      eval(code);
    } catch (error) {
      throw error;
    }
    const endTime = performance.now();

    // Return the execution time
    return { executionTime: endTime - startTime };
  };

  const formatError = (error) => {
    if (!error) return null;
    if (typeof error === "string") return { message: error };
    return {
      message: error.message,
      stack: error.stack,
    };
  };

  self.onmessage = (e) => {
    let { event } = e.data;

    if (event === "code:execute") {
      try {
        const { code } = e.data;
        const result = executeCode(code);
        self.postMessage({
          event: "code:executed",
          executionTime: result.executionTime,
        });
      } catch (error) {
        // console.error(error);
        self.postMessage({
          event: "code:error",
          message: formatError(error),
        });
        self.postMessage({
          event: "code:executed",
          executionTime: null,
        });
      }
    }
  };
};

export default worker;
