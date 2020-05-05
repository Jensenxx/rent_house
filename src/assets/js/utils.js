export function formatDate (date, type = 'YYMMDD') {
  var myyear = date.getFullYear()
  var mymonth = date.getMonth() + 1
  var myweekday = date.getDate()
  var myhour = date.getHours()
  var mymin = date.getMinutes()
  var mysecond = date.getSeconds()
  mymonth = mymonth < 10 ? '0' + mymonth : mymonth
  myweekday = myweekday < 10 ? '0' + myweekday : myweekday
  myhour = myhour < 10 ? '0' + myhour : myhour
  mymin = mymin < 10 ? '0' + mymin : mymin
  mysecond = mysecond < 10 ? '0' + mysecond : mysecond
  if (type === 'YYMMDD') {
    return (myyear + '-' + mymonth + '-' + myweekday)
  } else {
    return (`${myyear}-${mymonth}-${myweekday} ${myhour}:${mymin}:${mysecond}`)
  }
}

export function convertBase64ToBlob (base64) {
  const base64Arr = base64.split(',')
  let imgtype = ''
  let base64String = ''
  if (base64Arr.length > 1) {
    base64String = base64Arr[1]
    imgtype = base64Arr[0].substring(base64Arr[0].indexOf(':') + 1, base64Arr[0].indexOf(';'))
  }
  const bytes = atob(base64String)
  const bytesCode = new ArrayBuffer(bytes.length)
  const byteArray = new Uint8Array(bytesCode)
  for (let i = 0; i < bytes.length; i++) {
    byteArray[i] = bytes.charCodeAt(i)
  }
  return new Blob([bytesCode], { type: imgtype })
}
