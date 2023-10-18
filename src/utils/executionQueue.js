// executionQueue.js
import workerScript from "./worker";

const executionQueue = {
  queue: [],
  isExecuting: false,
  worker: new Worker(workerScript), // Create a dedicated web worker for execution

  addToQueue: (code, context, callback) => {
    executionQueue.queue.push({
      code,
      context,
      callback,
    });
    if (!executionQueue.isExecuting) {
      executionQueue.executeNext();
    }
  },

  executeNext: () => {
    if (executionQueue.queue.length > 0) {
      executionQueue.isExecuting = true;
      const { code, context, callback } = executionQueue.queue.shift();

      // Send the code, context, and callback to the web worker for execution
      // setTimeout(() => {
      executionQueue.worker.postMessage({ code, context });
      // }, 5000);

      executionQueue.worker.onmessage = (e) => {
        const { output, error, context } = e.data;
        callback({ output, error, context });
        executionQueue.executeNext();
      };
    } else {
      executionQueue.isExecuting = false;
    }
  },
};

export default executionQueue;
