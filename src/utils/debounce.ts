/* eslint-disable @typescript-eslint/no-explicit-any */
export function debounce(func: any, delay: number) {
  let timer: ReturnType<typeof setTimeout> | null = null

  return function (this: any, ...args: any) {
    const context = this
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => func.apply(context, args), delay)
  }
}

export function throttle(func: Function, delay: number) {
  let lastTime = 0
  return function (this: any, ...args: any[]) {
    const now = Date.now()
    if (now - lastTime >= delay) {
      lastTime = now
      func.apply(this, args)
    }
  }
}
