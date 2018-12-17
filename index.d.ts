export interface ClearablePromise<T> extends Promise<T> {
  /**
   * Clears the randelay and settles the promise.
   */
  clear(): void;
}

/**
 * Minimal subset of `AbortSignal` that randelay will use if passed.
 * This avoids a dependency on dom.d.ts.
 * The dom.d.ts `AbortSignal` is compatible with this one.
 */
interface AbortSignal {
  readonly aborted: boolean;
  addEventListener(type: 'abort', listener: () => void, options?: { once?: boolean }): void;
  removeEventListener(type: 'abort', listener: () => void): void;
}

export interface Options {
  /**
   * An optional AbortSignal to abort the randelay.
   * If aborted, the Promise will be rejected with an AbortError.
   */
  signal?: AbortSignal
}

declare type Time = number | string

declare type StartTime = Time | [Time]

type Randelay = {
  /**
   * Create a promise which resolves after the specified `time`.
   *
   * @param time - Time to delay the promise.
   * @param endTime - Random time range in (`time`, `endTime`) to delay the promise.
   * @returns A promise which rejects after the specified `time` or the random time range in (`time`, `endTime`).
   */
  (time: StartTime, endTime?: Time | Options, options?: Options): ClearablePromise<void>;

  /**
   * Create a promise which resolves after the specified `time`.
   *
   * @param time - Time to delay the promise.
   * @param endTime - Random time range in (`time`, `endTime`) to delay the promise.
   * @returns A promise which rejects after the specified `time` or the random time range in (`time`, `endTime`).
   */
  <T>(time: StartTime, endTime?: Time | Options & {
    /** Value to resolve in the returned promise. */
    value: T
  }, options?: Options & {
    /** Value to resolve in the returned promise. */
    value: T
  }): ClearablePromise<T>;

  /**
   * Create a promise which resolves after the specified `time`.
   *
   * @param time - Time to delay the promise.
   * @param endTime - Random time range in (`time`, `endTime`) to delay the promise.
   * @returns A promise which rejects after the specified `time` or the random time range in (`time`, `endTime`).
   */
  // TODO: Allow providing value type after https://github.com/Microsoft/TypeScript/issues/5413 will be resolved.
  reject(StartTime, endTime?: Time | Options & {
    /** Value to reject in the returned promise. */
    value?: any
  }, options?: Options & {
    /** Value to reject in the returned promise. */
    value?: any
  }): ClearablePromise<never>;
}

declare const randelay: Randelay & {
  createWithTimers(timers: {clearTimeout: typeof clearTimeout, setTimeout: typeof setTimeout}): Randelay
};

export default randelay;
