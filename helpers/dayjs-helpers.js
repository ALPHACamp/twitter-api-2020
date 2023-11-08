const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime') // 相對時間差
const zhTw = require('dayjs/locale/zh-tw') // 繁體中文

dayjs.extend(relativeTime)
dayjs.locale(zhTw)

const calculateRelativeTime = targetDate => {
  return dayjs(targetDate).fromNow()
}

const formatDate = datetime => {
  return dayjs(datetime).format('YYYY年MM月DD日')
}

const formatTime = datetime => {
  return dayjs(datetime)
    .format('A h:mm')
    .replace('AM', '上午')
    .replace('PM', '下午')
}

module.exports = {
  currentYear: () => dayjs().year(), // 取得當年年份作為 currentYear 的屬性值
  relativeTimeFromNow: calculateRelativeTime, // 計算與現在時間的相對時間差
  formatDate,
  formatTime
}
