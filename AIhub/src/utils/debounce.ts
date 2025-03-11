export const debounce = (func: any, delay: number) => {
  let timer: any = null
  return (...args: any) => {
    const context = this
    if (timer) clearTimeout(timer)
    timer = setTimeout(func.apply(context, args), delay)
  }
}
