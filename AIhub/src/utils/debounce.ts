export const debounce=  (func: any, delay: number) => {
  let timer: any = null
  return function(this:any,...args: any)  {
    const context :any= this
    if (timer) clearTimeout(timer)
    timer = setTimeout(()=>func.apply(context, args), delay)
  }
}

const jieliu =(func:any, delay: number)=>{

let last:any=null;
return (...args:any)=>{
  let now=new Date().getTime()
  if(now<last+delay)
  {
    last=now
    func.apply((this,args),)
  }
}
}