'use strict';

const ms = require('ms');

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const formatTime = (m) => (typeof m === 'string' ? ms(m) : m);

const formatParam = (min, max, option) => {
  let time, endTime;

  if (typeof max === 'object') {
    option = max;
  } else if (max) {
    endTime = max;
  }

  if (Array.isArray(min)) {
    endTime = min[1];
    time = min[0];
  } else {
    time = min;
  }

  time = formatTime(time);

  if (endTime) {
    time = randomInt(time, formatTime(endTime));
  }

  return [time, option];
};

const createAbortError = () => {
  const error = new Error('Randelay aborted');
  error.name = 'AbortError';
  return error;
};

const createRandelay = ({
  clearTimeout: defaultClear,
  setTimeout: set,
  willResolve,
}) => (time, endTime, option = {}) => {
  const [delayTime, opt] = formatParam(time, endTime, option);
  const { value, signal } = opt;

  if (signal && signal.aborted) {
    return Promise.reject(createAbortError());
  }

  let timeoutId;
  let settle;
  let rejectFn;
  const clear = defaultClear || clearTimeout;

  const signalListener = () => {
    clear(timeoutId);
    rejectFn(createAbortError());
  };

  const cleanup = () => {
    if (signal) {
      signal.removeEventListener('abort', signalListener);
    }
  };

  const randelayPromise = new Promise((resolve, reject) => {
    settle = () => {
      cleanup();
      if (willResolve) {
        resolve(value);
      } else {
        reject(value);
      }
    };
    rejectFn = reject;
    timeoutId = (set || setTimeout)(settle, delayTime);
  });

  if (signal) {
    signal.addEventListener('abort', signalListener, { once: true });
  }

  randelayPromise.clear = () => {
    clear(timeoutId);
    timeoutId = null;
    settle();
  };

  return randelayPromise;
};

const randelay = createRandelay({ willResolve: true });
randelay.reject = createRandelay({ willResolve: false });
randelay.createWithTimers = ({ clearTimeout, setTimeout }) => {
  const randelay = createRandelay({
    clearTimeout,
    setTimeout,
    willResolve: true,
  });
  randelay.reject = createRandelay({
    clearTimeout,
    setTimeout,
    willResolve: false,
  });
  return randelay;
};
module.exports = randelay;
// TODO: Remove this for the next major release
module.exports.default = randelay;
