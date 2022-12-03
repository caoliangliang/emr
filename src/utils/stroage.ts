// 本地存储方法

// set
export const setStroage = <T>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value))
}
// get
export const getStroage = (key: string): any => {
  let data = localStorage.getItem(key)
  if (data) data = JSON.parse(data)
  return data
}

// remove
export const removeStroage = (key: string) => {
  localStorage.removeItem(key)
}

// clear
export const clearStorage = () => {
  localStorage.clear()
}
