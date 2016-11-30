import moment from 'moment'

class Timer {
  start() {
    this.startAt = Date.now();
  }

  duration() {
    let now = Date.now();
    let duration = now - this.startAt;
    return Timer.hms(duration);
  }

  stop() {
    // let duration = Timer.hms(now - this.startAt);
    // this.startAt = Timer.getHm(new Date(this.startAt));
    // this.stopAt = Timer.getHm(now);
    // this.time = duration;
    this.stopAt = Date.now();
    return this.stopAt;
  }
}

//将微秒duration转化为对应的hh:mm:ss格式
Timer.hms = (duration) => {
  let hour = parseInt(Math.floor(duration / (60 * 60 * 1000)));
  hour = hour < 10 ? '0' + hour : hour;
  let min = parseInt(Math.floor((duration - hour * 60 * 60 * 1000) / (60 * 1000)));
  min = min < 10 ? '0' + min : min;
  let second = parseInt(Math.floor(duration % (60 * 1000) / 1000));
  second = second < 10 ? '0' + second : second;
  duration = hour + ':' + min + ":" + second;
  return duration;
}

Timer.hour = (duration) => {
  let hour = parseInt(Math.floor(duration / (60 * 60 * 1000)));
  let min = parseInt(Math.floor((duration - hour * 60 * 60 * 1000) / (60 * 1000)));
  return hour + min / 60;
}

//从Date.now()中返回当前时间的'hh:mm'格式
Timer.getHm = (date) => {
  return moment(date).format('HH:mm');
  // date = new Date(parseInt(date));
  // let hour = date.getHours();
  // hour = hour < 10 ? '0' + hour : hour;
  // let min = date.getMinutes();
  // min = min < 10 ? '0' + min : min;
  // return hour + ':' + min;
}

//返回当前时间的'HH:mm:ss'
Timer.getHms = (date) => {
  return moment(date).format('HH:mm:ss');
  // date = new Date(parseInt(date));
  // let hour = date.getHours();
  // hour = hour < 10 ? '0' + hour : hour;
  // let min = date.getMinutes();
  // min = min < 10 ? '0' + min : min;
  // let second = date.getSeconds();
  // second = second < 10 ? '0' + second : second;
  // return hour + ':' + min + ':' + second;
}

/**
 * 取得'YYYY-MM-dd'格式的日期
 */
Timer.getYmd = (date, symbol = '-') => {
  return moment(date).format('YYYY-MM-DD');
}

//将Date转成HH:MM格式
Timer.getTime = (date) => {
  let hour = date.getHours();
  hour = hour < 10 ? '0' + hour : hour;
  let min = date.getMinutes();
  min = min < 10 ? '0' + min : min;
  return hour + ':' + min;
}

Timer.lastSunday = (today) => {
  return moment(today).subtract(1, 'weeks').endOf('isoWeek').format();
}

Timer.lastMonday = (today) => {
  return moment(today).subtract(1, 'weeks').startOf('isoWeek').format();
}

Timer.nextSunday = (today) => {
  return moment(today).add(1, 'weeks').endOf('isoWeek').format();
}

Timer.nextMonday = (today) => {
  return moment(today).add(1, 'weeks').startOf('isoWeek').format();
}

Timer.showWeekFirstDay = (today) => {
  return moment(today).startOf('isoWeek').format();
}

Timer.showWeekLastDay = (today) => {
  return moment(today).endOf('isoWeek').format();
}

Timer.showMonthFirstDay = (nowdate) => {
  var monthFirstDay = new Date(nowdate.getFullYear(), nowdate.getMonth(), 1);
  return monthFirstDay;
}

Timer.yesterday = (nowdate) => {
  let yesterday = new Date();
  yesterday.setDate(nowdate.getDate() - 1);
  return yesterday;

}

Timer.week = (today) => {
  today = moment(today);
  var monday = moment(Timer.showWeekFirstDay(today));
  var week = [];
  for(let i = 0; i < 7; i ++) {
	week.push(Timer.getYmd(monday)); 
    monday = monday.add(1, 'day');
  }
  return week;
}

const MS_PER_DAY = 1000 * 60 * 60 * 24;
Timer.dateDiffInDays = (a, b) => {
  // Discard the time and time-zone information.
  var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / MS_PER_DAY);
}

export default Timer;
