const worker = () => {
  const executeCode = (code, context) => {
    // Capture console.log output
    const consoleLogs = [];
    const originalConsoleLog = console.log;
    console.log = (...args) => {
      consoleLogs.push(args);
      originalConsoleLog(...args);
    };

    // Execute the provided JavaScript code
    /* eslint-disable no-eval */
    eval(code);

    // Restore the original console.log function
    console.log = originalConsoleLog;

    // Update the state with console output
    return consoleLogs;
  };

  const formatOutput = (output) => {
    return output.map((log) => {
      return log.map((arg) => {
        if (typeof arg === "object") {
          return JSON.stringify(arg, null, 4);
        } else {
          return arg;
        }
      });
    });
  };

  const formatError = (error) => {
    const { message, stack } = error;
    return { message, stack };
  };

  onmessage = (e) => {
    let { code, context } = e.data;

    try {
      const result = executeCode(code, context);
      context = { ...context, ...result };
      postMessage({ output: formatOutput(result), error: null, context });
    } catch (error) {
      postMessage({ output: null, error: formatError(error), context });
    }
  };
};

let code = worker.toString();
code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));
const blob = new Blob([code], { type: "application/javascriptssky" });
const workerScript = URL.createObjectURL(blob);
export default workerScript;
