export function timeAgo (time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

function pluralize (time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

export function unescape (text) {
  let res = text || ''

  ;[
    ['<p>', '\n'],
    ['&amp;', '&'],
    ['&amp;', '&'],
    ['&apos;', '\''],
    ['&#x27;', '\''],
    ['&#x2F;', '/'],
    ['&#39;', '\''],
    ['&#47;', '/'],
    ['&lt;', '<'],
    ['&gt;', '>'],
    ['&nbsp;', ' '],
    ['&quot;', '"']
  ].forEach(pair => {
    res = res.replace(new RegExp(pair[0], 'ig'), pair[1])
  })

  return res
}

export function timeFormat (text, formatStr) {
  let date = new Date()
  date.setTime(text)
  let _year = date.getFullYear()
  let _month = ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1))
  let _day = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate())
  let _hour = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours())
  let _minute = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
  let _second = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
  return formatStr.replace('YYYY', _year)
    .replace('MM', _month)
    .replace('M', (date.getMonth() + 1))
    .replace('DD', _day)
    .replace('D', date.getDate())
    .replace('hh', _hour)
    .replace('h', date.getHours())
    .replace('mm', _minute)
    .replace('m', date.getMinutes())
    .replace('ss', _second)
    .replace('s', date.getSeconds())
}
