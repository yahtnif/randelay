'use strict';

const ParkMiller = require('park-miller');
const ms = require('ms');

const MAX_INT32 = 2147483647;

const seed = () => Math.floor(Math.random() * MAX_INT32);

const random = new ParkMiller(seed());

const formatTime = m => (typeof m === 'string' ? ms(m) : m);

const formatParam = (min, max, option) => {
  let time = formatTime(min);

  if (max) {
    if (typeof max === 'object') {
      option = max;
    } else {
      time = random.integerInRange(time, formatTime(max));
    }
  }

  return [time, option];
};

const createAbortError = () => {
  const error = new Error('Randelay aborted');
  error.name = 'AbortError';
  return error;
};

const createRandelay = ({
  clearTimeout: clear = clearTimeout,
  setTimeout: set = setTimeout,
  willResolve
}) => (min, max, option = {}) => {
  const [time, opt] = formatParam(min, max, option);
  const { value, signal } = opt;

  if (signal && signal.aborted) {
    return Promise.reject(createAbortError());
  }

  let timeoutId;
  let settle;
  let rejectFn;

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
    timeoutId = set(settle, time);
  });

  if (signal) {
    signal.addEventListener('abort', signalListener, { once: true });
  }

  randelayPromise.clear = () => {
    clear(timeoutId);
    timeoutId = null;
    cleanup();
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
    willResolve: true
  });
  randelay.reject = createRandelay({
    clearTimeout,
    setTimeout,
    willResolve: false
  });
  return randelay;
};
module.exports = randelay;
module.exports.default = randelay;
