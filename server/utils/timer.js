/**
 * 取得hh:mm格式的时间
 */
export function getHm(date) {
  let hour = date.getHours();
  hour = hour < 10 ? '0' + hour : hour;
  let min = date.getMinutes(); 
  min = min < 10 ? '0' + min : min;
  return hour + ':' + min;
}

/**
 * 取得'YYYY-MM-dd'格式的日期
 */
export function getYmd(date, divider = '') {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  month = month < 10 ? '0' + month : month;
  
  let day = date.getDate();
  day = day < 10 ? '0' + day : day;
  return '' + year + divider + month + divider + day;
}

//将微秒duration转化为对应的hh:mm:ss格式
export function getDuration(duration) {
  let hour = parseInt(Math.round(duration / (60 * 60 * 1000)));
  hour = hour < 10 ? '0' + hour : hour;
  let min = parseInt(Math.round((duration - hour * 60 * 60 * 1000) / (60 * 1000)));
  min = min < 10 ? '0' + min : min;
  let second = parseInt(Math.round(duration % (60 * 1000) / 1000));
  second = second < 10 ? '0' + second : second;
  duration = hour + ':' + min + ":" + second;
  return duration;
}

export function firstDayOfWeek(today) {
  let dayNum = today.getDay() == 0 ? 7 : today.getDay();
  var mondayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - dayNum + 1);
  return mondayOfWeek;
}
