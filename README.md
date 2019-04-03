<div align="center">
	<div>
		<img width="300" height="196" src="https://github.com/yahtnif/static/raw/master/logo/randelay.svg?sanitize=true" alt="randelay">
	</div>
</div>

[![npm](https://badgen.net/npm/v/randelay)](https://www.npmjs.com/package/randelay)
[![Build Status](https://travis-ci.org/yahtnif/randelay.svg?branch=master)](https://travis-ci.org/yahtnif/randelay)
[![LICENSE](https://img.shields.io/badge/license-Anti%20996-blue.svg)](https://github.com/996icu/996.ICU/blob/master/LICENSE)

> Random + [delay](https://github.com/sindresorhus/delay) + [ms](https://github.com/zeit/ms)

## Install

```
$ npm install randelay
```

## Usage

```js
const delay = require('randelay')

;(async () => {
  bar()

  await delay(100)

  // Executed 100 milliseconds later
  baz()

  // Or
  await delay('1s')

  await delay(100, 500)

  await delay(100, '1s')

  await delay('5s', '1m')

  await delay(['5s', '1m'])
})()
```

## API

### delay(time, [endTime], [options])

Create a promise which resolves after the specified `time` or the random time range in (`time`, `endTime`).

### delay.reject(time, [endTime], [options])

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

### delayPromise.clear()

Clears the delay and settles the promise.

### delay.createWithTimers({clearTimeout, setTimeout})

Creates a new `delay` instance using the provided functions for clearing and setting timeouts. Useful if you're about to stub timers globally, but you still want to use `delay` to manage your tests.

## Advanced usage

Passing a value:

```js
const delay = require('randelay')

;(async () => {
  const result = await delay(100, { value: '🦄' })

  // Executed after 100 milliseconds
  console.log(result)
  //=> '🦄'
})()
```

Using `delay.reject()`, which optionally accepts a value and rejects it `ms` later:

```js
const delay = require('randelay')

;(async () => {
  try {
    await delay.reject(100, { value: new Error('🦄') })

    console.log('This is never executed')
  } catch (error) {
    // 100 milliseconds later
    console.log(error)
    //=> [Error: 🦄]
  }
})()
```

You can settle the delay early by calling `.clear()`:

```js
const delay = require('randelay')

;(async () => {
  const delayedPromise = delay(1000, { value: 'Done' })

  setTimeout(() => {
    delayedPromise.clear()
  }, 500)

  // 500 milliseconds later
  console.log(await delayedPromise)
  //=> 'Done'
})()
```

You can abort the delay with an AbortSignal:

```js
const delay = require('randelay')

;(async () => {
  const abortController = new AbortController()

  setTimeout(() => {
    abortController.abort()
  }, 500)

  try {
    await delay(1000, { signal: abortController.signal })
  } catch (error) {
    // 500 milliseconds later
    console.log(error.name)
    //=> 'AbortError'
  }
})()
```

Create a new instance that is unaffected by libraries such as [lolex](https://github.com/sinonjs/lolex/):

```js
const delay = require('randelay')

const customDelay = delay.createWithTimers({ clearTimeout, setTimeout })

;(async () => {
  const result = await customDelay(100, { value: '🦄' })

  // Executed after 100 milliseconds
  console.log(result)
  //=> '🦄'
})()
```

## License

[996ICU](./LICENSE)
