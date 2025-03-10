
const principles = {
  pureNum: (num:string) => {
    return /^\d+$/.test(num)
  }, //纯数字
  passwordPer: (num:string) => {
     return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/.test(num)
    // return /^\d+$/.test(num)
  }, //密码需包含大小写字母、数字、特殊符号，且长度 8-20 位
  samePassword:(num:string,val:string)=>{
    return num===val
  },

}

// const rules = {
//   username: [
//     {
//       required: true,
//       validator(rule, value) {
//         if (!value) {
//           return new Error('账号不能为空')
//         } else if (!principles.pureNum(value)) return new Error('账号必须为纯数字')
//         else if (value.length != 11) return new Error('账号必须为11位数字')
//         else if (value == '00000000000') return new Error('账号不能全为0')
//         return true
//       },
//     },
//   ],
//   password: [
//     {
//       required: true,
//       validator(rule, value) {
//         if (!value) {
//           return new Error('密码不能为空')
//         } else if (!principles.passwordPer(value)) return new Error('密码格式错误')
//         return true
//       },
//     },
//   ],
//   reenteredPassword: [
//     {
//       required: true,
//       validator(rule, value) {
//         if (!value) {
//           return new Error('重复密码不能为空')
//         } else if (!principles.samePassword(value,principles.password)) return new Error('两次输入的密码不一致')
//         return true
//       },
//     },
//   ],
// }
export const returnRules=(passwords:string|null)=>{
  return {
    username: [
      {
        required: true,
        validator(rule:string, value:string) {
          if (!value) {
            return new Error('账号不能为空')
          } else if (!principles.pureNum(value)) return new Error('账号必须为纯数字')
          else if (value.length != 11) return new Error('账号必须为11位数字')
          else if (value == '00000000000') return new Error('账号不能全为0')
          return true
        },
      },
    ],
    password: [
      {
        required: true,
        validator(rule:string, value:string) {
          if (!value) {
            return new Error('密码不能为空')
          } else if (!principles.passwordPer(value)) {

            return new Error('密码格式错误')}
          return true
        },
      },
    ],
    reenteredPassword: [
      {
        required: true,
        validator(rule:string, value:string) {
          if (!value) {
            return new Error('重复密码不能为空')
          } else if (passwords!==value) {     console.log(value,passwords)
            return new Error('两次输入的密码不一致')}
          return true
        },
      },
    ],
  }
}

