declare namespace delay {
  interface ClearablePromise<T> extends Promise<T> {
    /**
    Clears the delay and settles the promise.
    */
    clear(): void;
  }

  /**
  Minimal subset of `AbortSignal` that delay will use if passed.
  This avoids a dependency on dom.d.ts.
  The dom.d.ts `AbortSignal` is compatible with this one.
  */
  interface AbortSignal {
    readonly aborted: boolean;
    addEventListener(
      type: 'abort',
      listener: () => void,
      options?: { once?: boolean }
    ): void;
    removeEventListener(type: 'abort', listener: () => void): void;
  }

  interface Options {
    /**
    An optional AbortSignal to abort the delay.
    If aborted, the Promise will be rejected with an AbortError.
    */
    signal?: AbortSignal;
  }

  type Time = number | string;

  type StartTime = Time | [Time];
}

type Delay = {
  /**
  Create a promise which resolves after the specified `milliseconds`.

  @param time - Time to delay the promise.
  @param endTime - Random time range in (`time`, `endTime`) to delay the promise.
  @returns A promise which resolves after the specified `time` or the random time range in (`time`, `endTime`).
  */
  (
    time: delay.StartTime,
    endTime?: delay.Time | delay.Options,
    options?: delay.Options
  ): delay.ClearablePromise<void>;

  /**
  Create a promise which resolves after the specified `milliseconds`.

  @param time - Time to delay the promise.
  @param endTime - Random time range in (`time`, `endTime`) to delay the promise.
  @returns A promise which resolves after the specified `time` or the random time range in (`time`, `endTime`).
  */
  <T>(
    time: delay.StartTime,
    endTime?:
      | delay.Time
      | delay.Options & {
          /** Value to resolve in the returned promise. */
          value: T;
        },
    options?: delay.Options & {
      /**
      Value to resolve in the returned promise.
      */
      value: T;
    }
  ): delay.ClearablePromise<T>;

  /**
  Create a promise which rejects after the specified `milliseconds`.

  @param time - Time to delay the promise.
  @param endTime - Random time range in (`time`, `endTime`) to delay the
  @returns A promise which rejects after the specified `time` or the random time range in (`time`, `endTime`).
  */
  // TODO: Allow providing value type after https://github.com/Microsoft/TypeScript/issues/5413 will be resolved.
  reject(
    StartTime: delay.StartTime,
    endTime?:
      | delay.Time
      | delay.Options & {
          /** Value to reject in the returned promise. */
          value?: unknown;
        },
    options?: delay.Options & {
      /**
      Value to reject in the returned promise.
      */
      value?: unknown;
    }
  ): delay.ClearablePromise<never>;
};

declare const delay: Delay & {
  createWithTimers(timers: {
    clearTimeout: typeof clearTimeout;
    setTimeout: typeof setTimeout;
  }): Delay;

  // TODO: Remove this for the next major release
  default: typeof delay;
};

export = delay;
