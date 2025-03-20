/* eslint-disable @typescript-eslint/no-explicit-any */
export function debounce(func: any, delay: number) {
  let timer: ReturnType<typeof setTimeout> | null = null

  return function (this: any, ...args: any) {
    const context = this
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => func.apply(context, args), delay)
  }
}
