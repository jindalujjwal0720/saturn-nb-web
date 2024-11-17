// executionQueue.js
import worker from "./executionQueue.worker.js";
import WebWorker from "./web-worker.js";

class QueueWebWorker {
  constructor(worker) {
    this.worker = new WebWorker(worker);
    this.isExecuting = false;
    /** @type {Array<{code: string, context: any, callback: (output: any) => void}>} */
    this.queue = [];
  }

  postMessage = (message) => {
    this.worker.postMessage(message);
  };

  terminate = () => {
    this.worker.terminate();
  };

  onmessage = (callback) => {
    this.worker.onmessage = callback;
  };

  /**
   * @param {string} code
   * @param {any} context
   * @param {(output: any) => void} callback
   * @returns {void}
   */
  addToQueue = (code, context, callback) => {
    this.queue.push({
      code,
      context,
      callback,
    });
    if (!this.isExecuting) {
      this.isExecuting = true;
      this.executeNext();
    }
  };

  executeNext = () => {
    if (this.queue.length > 0) {
      this.isExecuting = true;
      const { code, context, callback } = this.queue.shift();
      this.worker.postMessage({ event: "code:execute", code, context });

      this.worker.onmessage = (e) => {
        const { event } = e.data;
        if (event === "code:executed") {
          const { executionTime } = e.data;
          callback({ executionTime }, true);
          this.executeNext();
        } else if (event === "code:log") {
          callback({ output: e.data.message }, false);
        } else if (event === "code:error") {
          callback({ error: e.data.message }, false);
        }
      };
    } else {
      this.isExecuting = false;
    }
  };
}

const executionQueue = {
  /** @type {Record<string, QueueWebWorker>} */
  workers: {
    default: new QueueWebWorker(worker),
  },

  /**
   * @typedef {Object} Context
   * @property {string} notebookId
   * @property {string} cellId
   *
   * @typedef {Object} ExecutionResult
   * @property {string} output
   * @property {string} error
   * @property {number} executionTime
   *
   * @param {string} code
   * @param {Context} context
   * @param {(result: ExecutionResult, isFinal: boolean) => void} callback
   * @param {boolean} [stream=false] If true, the callback will be called multiple times
   */
  push: (code, context, callback, stream = false) => {
    const { notebookId } = context;
    if (!executionQueue.workers[notebookId]) {
      executionQueue.workers[notebookId] = new QueueWebWorker(worker);
    }
    executionQueue.workers[notebookId].addToQueue(
      code,
      context,
      callback,
      stream
    );
  },

  terminate: (notebookId) => {
    if (executionQueue.workers[notebookId]) {
      executionQueue.workers[notebookId].terminate();
      delete executionQueue.workers[notebookId];
    }
  },

  reset: () => {
    Object.values(executionQueue.workers).forEach((worker) => {
      worker.terminate();
    });
    executionQueue.workers = {
      default: new QueueWebWorker(worker),
    };
  },
};

export default executionQueue;
