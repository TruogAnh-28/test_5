/* eslint-disable custom-rules/encourage-object-params */

export function throttle<T extends (...args: Parameters<T>) => ReturnType<T>>(
  callback: T, ms: number
): (...args: Parameters<T>) => void {
  let waiting = false

  return (...args: Parameters<T>) => {
    if (!waiting) {
      // eslint-disable-next-line callback-return
      callback(...args)

      waiting = true
      setTimeout(
        () => {
          waiting = false
        }, ms
      )
    }
  }
}
