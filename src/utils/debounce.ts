export const debounce = (func: any, delay: number) => {
  let timer: ReturnType<typeof setTimeout> | null = null

  return function (this: any, ...args: any) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => func.apply(this, args), delay)
  }
}

const jieliu = (func: any, delay: number) => {
  let last: any = null
  return (...args: any) => {
    let now = new Date().getTime()
    if (now < last + delay) {
      last = now
      func.apply((this, args))
    }
  }
}
