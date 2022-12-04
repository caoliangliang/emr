// 密码验证正则
export const regexPwd =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=([\x21-\x7e]+)[^a-zA-Z0-9]).{8,30}$/

export const pwdRegex1 = new RegExp('(?=.*[0-9]).{8,30}') //纯数字
export const pwdRegex2 = new RegExp('(?=.*[a-z]).{8,30}') //小写字母
export const pwdRegex3 = new RegExp('(?=.*[A-Z]).{8,30}') //大写字母
export const pwdRegex4 = new RegExp('(?=([\x21-\x7e]+)[^a-zA-Z0-9]).{8,30}') //特殊字符
