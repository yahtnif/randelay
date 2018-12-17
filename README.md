# randelay [![Build Status](https://travis-ci.org/yahtnif/randelay.svg?branch=master)](https://travis-ci.org/yahtnif/randelay)

> Random + [delay](https://github.com/sindresorhus/delay) + [ms](https://github.com/zeit/ms)


## Install

```
$ npm install randelay
```


## Usage

```js
const randelay = require('randelay');

(async () => {
  bar();

  await randelay(100);

  // Executed 100 milliseconds later
  baz();

  // Or
  await randelay('1s');

  await randelay(100, 500);

  await randelay(100, '1s');

  await randelay('5s', '1m');

  await randelay(['5s', '1m']);
})();
```


## API

### randelay(time, [endTime], [options])

Create a promise which resolves after the specified `time` or the random time range in (`time`, `endTime`).

### randelay.reject(time, [endTime], [options])

Create a promise which rejects after the specified `time` or the random time range in (`time`, `endTime`).

#### time

Type: `number` | `string` | `Array`

Time to delay the promise. See [ms](https://github.com/zeit/ms).

#### endTime

Type: `number` | `string`

Random time range in (`time`, `endTime`) to delay the promise. See [ms](https://github.com/zeit/ms).

#### options

Type: `Object`

##### value

Type: `any`

Optional value to resolve or reject in the returned promise.

##### signal

Type: [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)

The returned promise will be rejected with an AbortError if the signal is aborted. AbortSignal is available in all modern browsers and there is a [ponyfill for Node.js](https://github.com/mysticatea/abort-controller).

### randelayPromise.clear()

Clears the randelay and settles the promise.

### randelay.createWithTimers({clearTimeout, setTimeout})

Creates a new `randelay` instance using the provided functions for clearing and setting timeouts. Useful if you're about to stub timers globally, but you still want to use `randelay` to manage your tests.


## Advanced usage

Passing a value:

```js
const randelay = require('randelay');

(async() => {
  const result = await randelay(100, {value: '🦄'});

  // Executed after 100 milliseconds
  console.log(result);
  //=> '🦄'
})();
```

Using `randelay.reject()`, which optionally accepts a value and rejects it `ms` later:

```js
const randelay = require('randelay');

(async () => {
  try {
    await randelay.reject(100, {value: new Error('🦄')});

    console.log('This is never executed');
  } catch (error) {
    // 100 milliseconds later
    console.log(error);
    //=> [Error: 🦄]
  }
})();
```

You can settle the randelay early by calling `.clear()`:

```js
const randelay = require('randelay');

(async () => {
  const randelayedPromise = randelay(1000, {value: 'Done'});

  setTimeout(() => {
    randelayedPromise.clear();
  }, 500);

  // 500 milliseconds later
  console.log(await randelayedPromise);
  //=> 'Done'
})();
```

You can abort the randelay with an AbortSignal:

```js
const randelay = require('randelay');

(async () => {
  const abortController = new AbortController();

  setTimeout(() => {
    abortController.abort();
  }, 500);

  try {
    await randelay(1000, {signal: abortController.signal});
  } catch (error) {
    // 500 milliseconds later
    console.log(error.name)
    //=> 'AbortError'
  }
})();
```

Create a new instance that is unaffected by libraries such as [lolex](https://github.com/sinonjs/lolex/):

```js
const randelay = require('randelay');

const customRandelay = randelay.createWithTimers({clearTimeout, setTimeout});

(async() => {
  const result = await customRandelay(100, {value: '🦄'});

  // Executed after 100 milliseconds
  console.log(result);
  //=> '🦄'
})();
```


## License

[MIT](http://opensource.org/licenses/MIT)
