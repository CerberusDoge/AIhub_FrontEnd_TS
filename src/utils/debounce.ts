/* eslint-disable @typescript-eslint/no-explicit-any */
export const debounce = (func: any, delay: number) => {
  let timer: ReturnType<typeof setTimeout> | null = null

  return function (this: any, ...args: any) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => func.apply(this, args), delay)
  }
}
