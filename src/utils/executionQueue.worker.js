/* eslint-disable no-restricted-globals */

const worker = () => {
  const executeCode = (code, context) => {
    let index = 0;
    // Capture console.log output
    const consoleLogs = [];
    const originalConsoleLog = console.log;
    console.log = (args) => {
      consoleLogs.push({
        index: index++,
        args,
        type: "log",
      });
    };

    // Capture console.error output
    const consoleErrors = [];
    const originalConsoleError = console.error;
    console.error = (args) => {
      consoleErrors.push({
        index: index++,
        args: args,
        type: "error",
      });
    };

    // Execute the code
    const startTime = performance.now();
    let endTime = performance.now();
    try {
      // eslint-disable-next-line no-new-func
      new Function(...Object.keys(context), code)(...Object.values(context));
      endTime = performance.now();
    } catch (error) {
      endTime = performance.now();
      consoleErrors.push({
        index: index++,
        args: error,
        type: "error",
      });
    }

    // Restore the original functions
    console.log = originalConsoleLog;
    console.error = originalConsoleError;

    // Update the state with console output
    return {
      consoleLogs,
      consoleErrors,
      length: index,
      executionTime: endTime - startTime,
    };
  };

  const formatOutput = (output) => {
    console.log(output);

    const { consoleLogs, consoleErrors } = output;
    // arrange console output in order
    let consoleOutput = [...consoleLogs, ...consoleErrors].sort(
      (a, b) => a.index - b.index
    );

    console.log(consoleOutput);

    // remove the index from the output and generate the html
    consoleOutput = consoleOutput.map((log) => {
      if (log.type === "error") {
        return `<span style="color: red;">${log.args}</span>`;
      } else {
        return `<span>${log.args}</span>`;
      }
    });
    const executionDetails = `<br/><span style="color: grey;">Ran in ${output.executionTime.toFixed(
      2
    )}ms</span><br/>`;
    consoleOutput.push(executionDetails);

    // return the output as html
    return consoleOutput.join("\n");
  };

  const formatError = (error) => {
    const { message, stack } = error;
    return { message, stack };
  };

  self.onmessage = (e) => {
    let { code, context } = e.data;

    try {
      const result = executeCode(code, context);
      // update the context without object spread
      context = Object.assign({}, context, result);
      self.postMessage({
        output: formatOutput(result),
        error: null,
        context,
      });
    } catch (error) {
      self.postMessage({
        output: null,
        error: formatError(error),
        context,
      });
    }
  };
};

export default worker;
