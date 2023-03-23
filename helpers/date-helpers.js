const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
require('dayjs/locale/zh-tw')

dayjs.locale('zh-tw')
dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Taipei')

const timeFormat = time => {
  const now = dayjs()
  const diff = now.diff(time, 'day')
  const isAM = dayjs.utc(time).hour() < 12

  if (diff < 7) {
    return dayjs.utc(time).fromNow()
  }

  return dayjs.utc(time).format(`${isAM ? '上午' : '下午'} hh:mm YYYY年MM月DD日`)
}

module.exports = timeFormat
